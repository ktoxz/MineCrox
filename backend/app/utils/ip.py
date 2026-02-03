from __future__ import annotations

import hashlib
import hmac

from fastapi import Request

from app.config.settings import settings


def _client_ip(request: Request) -> str:
    # Prefer reverse-proxy header if present.
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "0.0.0.0"


def client_ip_hash(request: Request) -> str:
    ip = _client_ip(request).encode("utf-8")
    secret = settings.ip_hash_secret.encode("utf-8")
    return hmac.new(secret, ip, hashlib.sha256).hexdigest()
