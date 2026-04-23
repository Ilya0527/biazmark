"""Security middleware tests: API-key auth + rate limiting."""
from __future__ import annotations

import pytest


@pytest.fixture
def secure_app(monkeypatch):
    """App instance with a known API key + low rate limit, no DB side effects."""
    monkeypatch.setenv("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
    monkeypatch.setenv("BIAZMARK_API_KEY", "test-key-123")
    monkeypatch.setenv("RATE_LIMIT_PER_MINUTE", "5")
    monkeypatch.setenv("BIAZMARK_TIER", "free")

    from app import config as _cfg

    _cfg.get_settings.cache_clear()

    # Build a fresh app with the new settings baked in.
    from fastapi import FastAPI

    from app.api import router
    from app.security import APIKeyMiddleware, RateLimitMiddleware

    app = FastAPI()
    app.add_middleware(APIKeyMiddleware)
    app.add_middleware(RateLimitMiddleware)
    app.include_router(router)

    @app.get("/healthz")
    async def hz():
        return {"status": "ok"}

    yield app
    _cfg.get_settings.cache_clear()


def test_auth_blocks_missing_key(secure_app):
    from fastapi.testclient import TestClient

    with TestClient(secure_app) as c:
        r = c.get("/api/tier")
    assert r.status_code == 401
    assert r.json()["error"] == "invalid_api_key"


def test_auth_allows_correct_key(secure_app):
    from fastapi.testclient import TestClient

    with TestClient(secure_app) as c:
        r = c.get("/api/tier", headers={"X-API-Key": "test-key-123"})
    assert r.status_code == 200


def test_auth_allows_health_without_key(secure_app):
    from fastapi.testclient import TestClient

    with TestClient(secure_app) as c:
        r1 = c.get("/healthz")
        r2 = c.get("/api/health")
    assert r1.status_code == 200
    assert r2.status_code == 200


def test_rate_limit_kicks_in(secure_app):
    from fastapi.testclient import TestClient

    with TestClient(secure_app) as c:
        headers = {"X-API-Key": "test-key-123"}
        # Limit=5/min → 6th should 429.
        statuses = [c.get("/api/tier", headers=headers).status_code for _ in range(6)]
    assert statuses[:5] == [200] * 5
    assert statuses[5] == 429


def test_rate_limit_skips_health(secure_app):
    from fastapi.testclient import TestClient

    with TestClient(secure_app) as c:
        # Hit /healthz 20 times — must never 429.
        statuses = [c.get("/healthz").status_code for _ in range(20)]
    assert statuses == [200] * 20
