"""Middleware: API-key auth + per-IP rate limiting.

Both are intentionally simple. For multi-tenant SaaS later, swap
`APIKeyMiddleware` for JWT + per-user keys, and `RateLimitMiddleware`
for a Redis-backed limiter (e.g. slowapi).
"""
from __future__ import annotations

import time
from collections import defaultdict, deque

from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.config import get_settings
from app.logging_config import get_logger

log = get_logger(__name__)


class APIKeyMiddleware(BaseHTTPMiddleware):
    """Require `X-API-Key: <BIAZMARK_API_KEY>` on everything under /api/*.

    Bypassed for the paths in `Settings.auth_skip_paths` (health, OAuth callbacks,
    static media, OpenAPI docs). If the setting is empty, auth is DISABLED —
    useful for local dev with no key configured.
    """

    def __init__(self, app):
        super().__init__(app)
        s = get_settings()
        self._key = s.biazmark_api_key
        self._skip = tuple(p.strip() for p in s.auth_skip_paths.split(",") if p.strip())

    def _skippable(self, path: str) -> bool:
        # Exact match on "/" and prefix match on everything else.
        if path == "/":
            return True
        return any(path.startswith(p) for p in self._skip if p != "/")

    async def dispatch(self, request: Request, call_next):
        if not self._key:
            return await call_next(request)
        if self._skippable(request.url.path):
            return await call_next(request)
        provided = request.headers.get("x-api-key") or request.query_params.get("api_key", "")
        if provided != self._key:
            log.info("auth_rejected", path=request.url.path, ip=_client_ip(request))
            return JSONResponse(
                {"error": "invalid_api_key", "detail": "missing or bad X-API-Key"},
                status_code=401,
            )
        return await call_next(request)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """In-memory sliding-window rate limit — N requests per IP per 60s.

    Good enough for a single-machine deploy. When you scale to multiple
    machines, replace with a Redis-backed limiter (arq is already in the stack).
    """

    def __init__(self, app: FastAPI, *, limit: int | None = None):
        super().__init__(app)
        self.limit = limit or get_settings().rate_limit_per_minute
        self._hits: dict[str, deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next):
        # Never rate-limit health probes — Fly would start cycling the machine.
        if request.url.path in ("/healthz", "/readyz", "/api/health"):
            return await call_next(request)

        ip = _client_ip(request)
        now = time.monotonic()
        window_start = now - 60.0
        hits = self._hits[ip]
        while hits and hits[0] < window_start:
            hits.popleft()
        if len(hits) >= self.limit:
            retry_after = int(60 - (now - hits[0])) + 1
            return JSONResponse(
                {"error": "rate_limited", "detail": f"max {self.limit}/min"},
                status_code=429,
                headers={"Retry-After": str(retry_after)},
            )
        hits.append(now)
        return await call_next(request)


def _client_ip(request: Request) -> str:
    # Fly and Vercel both forward the real client IP in Fly-Client-IP /
    # X-Forwarded-For. Falls back to the socket peer.
    xff = request.headers.get("fly-client-ip") or request.headers.get("x-forwarded-for", "")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else "unknown"
