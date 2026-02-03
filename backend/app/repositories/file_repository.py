from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.file import File


class FileRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_slug(self, slug: str) -> File | None:
        result = await self._session.execute(select(File).where(File.slug == slug))
        return result.scalar_one_or_none()

    async def count_by_uploader_ip_hash(self, uploader_ip_hash: str) -> int:
        result = await self._session.execute(
            select(func.count()).select_from(File).where(File.uploader_ip_hash == uploader_ip_hash)
        )
        return int(result.scalar_one())

    async def add(self, file: File) -> File:
        self._session.add(file)
        await self._session.flush()
        return file

    async def delete(self, file: File) -> None:
        await self._session.delete(file)
