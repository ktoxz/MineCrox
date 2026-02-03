from __future__ import annotations

from datetime import UTC, datetime, timedelta

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import settings
from app.models.download import Download
from app.models.file import File
from app.storage.s3_storage import S3Storage


class MaintenanceService:
    def __init__(self, session: AsyncSession, storage: S3Storage) -> None:
        self._session = session
        self._storage = storage

    async def cleanup_expired_files(self) -> int:
        now = datetime.now(UTC)
        result = await self._session.execute(select(File).where(File.expire_at < now).limit(200))
        expired = list(result.scalars().all())

        for f in expired:
            await self._storage.delete_object(f.s3_key)
            await self._session.delete(f)

        if expired:
            await self._session.commit()
        return len(expired)

    async def prune_download_logs(self) -> int:
        cutoff = datetime.now(UTC) - timedelta(days=settings.download_log_retention_days)
        result = await self._session.execute(delete(Download).where(Download.timestamp < cutoff))
        await self._session.commit()
        return int(result.rowcount or 0)
