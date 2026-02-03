from __future__ import annotations

import os
import tempfile
import uuid
from datetime import UTC, datetime, timedelta
import hashlib
import hmac

from fastapi import Depends, HTTPException, Request, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

import aiofiles

from app.config.settings import settings
from app.models.file import File
from app.repositories.file_repository import FileRepository
from app.schemas.file import FileCreateResponse, ResourcePackGeneratorInfo
from app.services.deps import get_session
from app.storage.s3_storage import S3Storage
from app.utils.files import allowed_extension, detect_zip_file_type
from app.utils.ip import client_ip_hash
from app.utils.slug import generate_random_slug


class UploadService:
    def __init__(self, session: AsyncSession, storage: S3Storage, request: Request) -> None:
        self._session = session
        self._repo = FileRepository(session)
        self._storage = storage
        self._request = request

    @staticmethod
    def from_depends(
        request: Request,
        session: AsyncSession = Depends(get_session),
        storage: S3Storage = Depends(S3Storage.from_depends),
    ) -> "UploadService":
        return UploadService(session=session, storage=storage, request=request)

    async def handle_upload(
        self,
        upload: UploadFile,
    ) -> FileCreateResponse:
        if upload.filename is None:
            raise HTTPException(status_code=400, detail="Missing filename")

        filename = os.path.basename(upload.filename)
        if not allowed_extension(filename):
            raise HTTPException(status_code=400, detail="Only .zip files are supported")

        # Simple anti-abuse: max files stored per IP (helpful on small VPS).
        uploader_hash = client_ip_hash(self._request)
        existing_count = await self._repo.count_by_uploader_ip_hash(uploader_hash)
        if existing_count >= 10:
            raise HTTPException(status_code=429, detail="Upload limit reached for this IP")

        now = datetime.now(UTC)
        file_id = str(uuid.uuid4())
        delete_token = uuid.uuid4().hex
        delete_token_hash = hmac.new(
            settings.ip_hash_secret.encode("utf-8"),
            delete_token.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

        tmp_dir = os.path.join(os.getcwd(), ".temp_uploads")
        os.makedirs(tmp_dir, exist_ok=True)

        with tempfile.NamedTemporaryFile(delete=False, dir=tmp_dir) as tmp:
            tmp_path = tmp.name

        size = 0
        sha1_hasher = hashlib.sha1()
        try:
            # Stream to disk to avoid RAM usage; enforce max size while streaming.
            async with aiofiles.open(tmp_path, "wb") as out:
                while True:
                    chunk = await upload.read(1024 * 1024)
                    if not chunk:
                        break
                    size += len(chunk)
                    if size > settings.max_upload_bytes:
                        raise HTTPException(status_code=413, detail="File too large (max 100MB)")
                    sha1_hasher.update(chunk)
                    await out.write(chunk)

            sha1 = sha1_hasher.hexdigest()

            file_type = detect_zip_file_type(tmp_path)

            # Privacy/anti-abuse: do not embed filename in URL; use an unguessable random slug.
            slug = generate_random_slug(16)
            for _ in range(10):
                if await self._repo.get_by_slug(slug) is None:
                    break
                slug = generate_random_slug(16)
            else:
                raise HTTPException(status_code=500, detail="Failed to allocate a unique slug")

            s3_key = self._storage.build_key(file_id=file_id, filename=filename, now=now)
            await self._storage.upload_file(tmp_path=tmp_path, s3_key=s3_key)

            file = File(
                id=file_id,
                filename=filename,
                slug=slug,
                file_type=file_type,
                minecraft_version=None,
                loader=None,
                description=None,
                tags=None,
                file_size=size,
                s3_key=s3_key,
                sha1_hash=sha1,
                download_count=0,
                created_at=now,
                last_download=None,
                expire_at=now + timedelta(days=settings.file_expire_days),
                uploader_ip_hash=uploader_hash,
                delete_token_hash=delete_token_hash,
            )
            await self._repo.add(file)
            await self._session.commit()

            landing = f"https://{settings.domain}/files/{slug}"
            resource_pack_info: ResourcePackGeneratorInfo | None = None
            if file_type == "resource_pack":
                download_url = f"https://{settings.domain}/download/{slug}"
                snippet = f"resource-pack={download_url}\nresource-pack-sha1={sha1}\n"
                resource_pack_info = ResourcePackGeneratorInfo(
                    download_url=download_url,
                    sha1=sha1,
                    server_properties_snippet=snippet,
                )

            return FileCreateResponse(
                id=file_id,
                slug=slug,
                landing_page_url=landing,
                delete_token=delete_token,
                resource_pack=resource_pack_info,
            )
        finally:
            try:
                await upload.close()
            except Exception:
                pass
            try:
                os.remove(tmp_path)
            except Exception:
                pass
