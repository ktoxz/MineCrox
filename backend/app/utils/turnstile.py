from __future__ import annotations

from typing import Any

import httpx

from app.config.settings import settings


def get_request_ip(request_headers: dict[str, str], fallback: str | None) -> str | None:
    # Prefer Cloudflare header when behind CF.
    cf_ip = request_headers.get("cf-connecting-ip") or request_headers.get("CF-Connecting-IP")
    if cf_ip:
        return cf_ip.strip()
    xff = request_headers.get("x-forwarded-for") or request_headers.get("X-Forwarded-For")
    if xff:
        # first IP is original client
        return xff.split(",")[0].strip()
    return fallback


async def verify_turnstile(token: str, request_ip: str | None, request_hostname: str | None) -> None:
    """Raises ValueError when invalid."""

    if not settings.turnstile_enabled:
        return

    if not settings.turnstile_secret_key:
        raise ValueError("Turnstile is enabled but TURNSTILE_SECRET_KEY is not set")

    if not token or not token.strip():
        raise ValueError("Missing captcha token")

    payload: dict[str, Any] = {
        "secret": settings.turnstile_secret_key,
        "response": token.strip(),
    }
    if request_ip:
        payload["remoteip"] = request_ip

    async with httpx.AsyncClient(timeout=5.0) as client:
        res = await client.post(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            data=payload,
        )
        data = res.json() if res.headers.get("content-type", "").startswith("application/json") else {}

    if not data or not bool(data.get("success")):
        raise ValueError("Captcha verification failed")

    expected = (settings.turnstile_expected_hostname or "").strip().lower() or None
    if expected:
        hostname = str(data.get("hostname") or "").strip().lower()
        if hostname and hostname != expected:
            raise ValueError("Captcha hostname mismatch")

    # Optional: if request has Host header and Turnstile returns hostname, do a soft check.
    if not expected and request_hostname:
        hostname = str(data.get("hostname") or "").strip().lower()
        if hostname and hostname != request_hostname.strip().lower():
            # Don't hard fail unless configured; helps with staging.
            return
