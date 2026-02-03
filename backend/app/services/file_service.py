from __future__ import annotations

import hashlib
import hmac

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.file_repository import FileRepository
from app.schemas.file import FilePublic
from app.services.deps import get_session
from app.storage.s3_storage import S3Storage
from app.config.settings import settings


class FileService:
    def __init__(self, session: AsyncSession, storage: S3Storage) -> None:
        self._repo = FileRepository(session)
        self._session = session
        self._storage = storage

    @staticmethod
    def from_depends(
        session: AsyncSession = Depends(get_session),
        storage: S3Storage = Depends(S3Storage.from_depends),
    ) -> "FileService":
        return FileService(session, storage)

    async def get_public_by_slug(self, slug: str) -> FilePublic:
        file = await self._repo.get_by_slug(slug)
        if file is None:
            raise HTTPException(status_code=404, detail="File not found")
        return FilePublic.model_validate(file)

    async def delete_by_slug(self, slug: str, delete_token: str) -> None:
        file = await self._repo.get_by_slug(slug)
        if file is None:
            raise HTTPException(status_code=404, detail="File not found")

        token_hash = hmac.new(
            settings.ip_hash_secret.encode("utf-8"),
            delete_token.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

        if token_hash != file.delete_token_hash:
            raise HTTPException(status_code=403, detail="Invalid delete token")

        await self._storage.delete_object(file.s3_key)
        await self._repo.delete(file)
        await self._session.commit()
