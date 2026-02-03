from __future__ import annotations

from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession

from app.db import session as db_session


async def get_session() -> AsyncIterator[AsyncSession]:
    db_session.init_engine()
    assert db_session.SessionLocal is not None
    async with db_session.SessionLocal() as session:
        yield session
