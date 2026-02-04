from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.api.public import router as public_router
from app.config.settings import settings
from app.db.session import init_db
from app.middleware.rate_limit import init_rate_limiter
from app.storage.s3_storage import S3Storage
from app.utils.scheduler import start_scheduler


def create_app() -> FastAPI:
    app = FastAPI(
        title="MineCrox API",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    @app.exception_handler(Exception)
    async def _unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        # If an exception reaches Starlette's ServerErrorMiddleware, CORS headers won't be added.
        # Converting it to a normal response ensures CORSMiddleware can decorate it.
        return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})

    @app.get("/", include_in_schema=False)
    async def _root() -> dict:
        return {
            "name": "MineCrox API",
            "docs": "/docs",
            "openapi": "/openapi.json",
        }

    @app.get("/healthz", include_in_schema=False)
    async def _healthz() -> dict:
        return {"status": "ok"}

    init_rate_limiter(app)

    # Add CORS last so it wraps responses from all other middleware.
    cors_origin_regex = settings.cors_origin_regex_value()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list(),
        allow_origin_regex=cors_origin_regex,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)
    app.include_router(public_router)

    @app.on_event("startup")
    async def _startup() -> None:
        await init_db()
        if settings.s3_endpoint_url is not None:
            try:
                await S3Storage().ensure_bucket()
            except Exception:
                # Non-fatal: production buckets usually exist already.
                pass

            start_scheduler()

    return app


app = create_app()
