from __future__ import annotations

from datetime import UTC, date, datetime, timedelta

from fastapi import Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.download import Download
from app.repositories.file_repository import FileRepository
from app.schemas.analytics import FileAnalytics
from app.services.deps import get_session


class AnalyticsService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._files = FileRepository(session)

    @staticmethod
    def from_depends(session: AsyncSession = Depends(get_session)) -> "AnalyticsService":
        return AnalyticsService(session)

    async def get_file_analytics(self, slug: str) -> FileAnalytics:
        file = await self._files.get_by_slug(slug)
        if file is None:
            raise HTTPException(status_code=404, detail="File not found")

        today = date.today()
        start = datetime.now(UTC).replace(hour=0, minute=0, second=0, microsecond=0)

        result = await self._session.execute(
            select(func.count()).select_from(Download).where(
                Download.file_id == file.id,
                Download.timestamp >= start,
            )
        )
        today_downloads = int(result.scalar_one())

        return FileAnalytics(
            slug=file.slug,
            download_count=file.download_count,
            last_download=file.last_download,
            today_downloads=today_downloads,
            today=today,
        )
