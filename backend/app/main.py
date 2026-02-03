from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    init_rate_limiter(app)
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
