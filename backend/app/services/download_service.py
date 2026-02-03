from __future__ import annotations

from datetime import UTC, datetime, timedelta

from fastapi import Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import settings
from app.models.download import Download
from app.repositories.download_repository import DownloadRepository
from app.repositories.file_repository import FileRepository
from app.services.deps import get_session
from app.storage.s3_storage import S3Storage
from app.utils.ip import client_ip_hash


class DownloadService:
    def __init__(self, session: AsyncSession, storage: S3Storage, request: Request) -> None:
        self._session = session
        self._files = FileRepository(session)
        self._downloads = DownloadRepository(session)
        self._storage = storage
        self._request = request

    @staticmethod
    def from_depends(
        request: Request,
        session: AsyncSession = Depends(get_session),
        storage: S3Storage = Depends(S3Storage.from_depends),
    ) -> "DownloadService":
        return DownloadService(session=session, storage=storage, request=request)

    async def create_download_redirect(self, slug: str) -> str:
        file = await self._files.get_by_slug(slug)
        if file is None:
            raise HTTPException(status_code=404, detail="File not found")

        now = datetime.now(UTC)
        file.download_count += 1
        file.last_download = now
        # Sliding expiration: keep file alive if accessed within FILE_EXPIRE_DAYS.
        file.expire_at = now + timedelta(days=settings.file_expire_days)

        ip_hash = client_ip_hash(self._request)
        await self._downloads.add(Download(file_id=file.id, ip_hash=ip_hash, timestamp=now))

        await self._session.commit()

        return self._storage.create_presigned_download_url(file.s3_key)
