"""FastAPI application entry point."""
from __future__ import annotations

import os
import pathlib
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Importing triggers registrations: connectors, oauth providers, media providers.
import app.connectors
import app.media
import app.oauth
from app import __version__
from app.api import router as api_router
from app.config import get_settings
from app.db import init_db
from app.logging_config import get_logger, setup_logging

setup_logging()
log = get_logger(__name__)

# Capture startup time for uptime reporting.
_BOOT_TIME = time.time()


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    log.info("autocmo_starting", version=__version__, tier=settings.biazmark_tier.value)

    # Production safety checks — loud warnings, never crash.
    is_prod = settings.oauth_redirect_base.startswith("https://")
    if is_prod:
        if settings.secret_key in ("", "change-me", "change-me-in-production-please"):
            log.warning(
                "insecure_secret_key",
                message="SECRET_KEY is default in production — set a strong value "
                        "(e.g. `python -c \"import secrets; print(secrets.token_urlsafe(48))\"`).",
            )
        if not settings.anthropic_api_key and settings.biazmark_tier.value != "free":
            log.warning(
                "missing_anthropic_key",
                message="Tier is non-free but ANTHROPIC_API_KEY is empty — LLM calls will fail.",
            )

    await init_db()
    log.info("autocmo_ready")
    yield
    log.info("autocmo_shutting_down")


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="AutoCMO",
        version=__version__,
        description=(
            "AutoCMO — your AI Chief Marketing Officer. Brief in, campaigns out. "
            "Five autonomous agents handle research, strategy, content, publishing, "
            "analytics, and optimization end-to-end."
        ),
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Order matters (outermost first = runs first):
    #   RateLimit → APIKey → routes
    # So we add APIKey first (inner), RateLimit second (outer).
    from app.security import APIKeyMiddleware, RateLimitMiddleware

    app.add_middleware(APIKeyMiddleware)
    app.add_middleware(RateLimitMiddleware)

    app.include_router(api_router)

    # Serve generated media assets.
    media_dir = pathlib.Path(settings.media_storage_dir)
    media_dir.mkdir(parents=True, exist_ok=True)
    app.mount("/media", StaticFiles(directory=str(media_dir)), name="media")

    @app.get("/")
    async def root():
        return {
            "name": "autocmo",
            "version": __version__,
            "tier": settings.biazmark_tier.value,
            "docs": "/docs",
            "site": "https://autocmo.app",
        }

    # PaaS-standard health endpoints (Fly, Railway, Render, K8s all probe these).
    @app.get("/healthz")
    async def healthz():
        return {
            "status": "ok",
            "version": __version__,
            "uptime_seconds": int(time.time() - _BOOT_TIME),
            # Render injects RENDER_GIT_COMMIT; Vercel/Fly use other names.
            "commit": (
                os.getenv("RENDER_GIT_COMMIT")
                or os.getenv("VERCEL_GIT_COMMIT_SHA")
                or os.getenv("GIT_COMMIT")
                or "unknown"
            )[:7],
        }

    @app.get("/readyz")
    async def readyz():
        # Light DB round-trip to confirm the service can actually do work.
        from sqlalchemy import text

        from app.db import get_engine

        try:
            async with get_engine().connect() as conn:
                await conn.execute(text("SELECT 1"))
            return {
                "status": "ok",
                "db": "ok",
                "version": __version__,
                "uptime_seconds": int(time.time() - _BOOT_TIME),
            }
        except Exception as e:
            return {"status": "degraded", "db": str(e), "version": __version__}

    return app


app = create_app()
