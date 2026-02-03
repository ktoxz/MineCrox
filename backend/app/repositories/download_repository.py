from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.download import Download


class DownloadRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def add(self, download: Download) -> Download:
        self._session.add(download)
        await self._session.flush()
        return download
