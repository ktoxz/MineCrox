from __future__ import annotations

from fastapi import FastAPI
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address


limiter = Limiter(key_func=get_remote_address)


def init_rate_limiter(app: FastAPI) -> None:
    app.state.limiter = limiter

    @app.exception_handler(RateLimitExceeded)
    async def _rate_limit_handler(request, exc):
        return limiter._rate_limit_exceeded_handler(request, exc)

    app.add_middleware(SlowAPIMiddleware)
