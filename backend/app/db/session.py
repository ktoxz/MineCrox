from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from app.config.settings import settings
from app.db.base import Base

engine: AsyncEngine | None = None
SessionLocal: async_sessionmaker[AsyncSession] | None = None


def init_engine() -> None:
    global engine, SessionLocal
    if engine is None:
        engine = create_async_engine(settings.database_url, pool_pre_ping=True)
        SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def reset_engine(database_url: str) -> None:
    global engine, SessionLocal
    if engine is not None:
        await engine.dispose()
    settings.database_url = database_url
    engine = create_async_engine(settings.database_url, pool_pre_ping=True)
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def init_db() -> None:
    init_engine()
    # Ensure models are imported before create_all.
    from app.models import download, file, report  # noqa: F401

    assert engine is not None
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
