from __future__ import annotations

import os
from datetime import datetime

import aioboto3
import boto3
from botocore.config import Config

from app.config.settings import settings


class S3Storage:
    def __init__(self) -> None:
        self._aiosession = aioboto3.Session(
            aws_access_key_id=settings.s3_access_key_id,
            aws_secret_access_key=settings.s3_secret_access_key,
            region_name=settings.s3_region or None,
        )
        signature_version = (settings.s3_signature_version or "").strip() or "s3v4"
        # Vietnix commonly prefers path-style; MinIO also works well with it.
        self._config = Config(signature_version=signature_version, s3={"addressing_style": "path"})

    @staticmethod
    def from_depends() -> "S3Storage":
        return S3Storage()

    def build_key(self, file_id: str, filename: str, now: datetime) -> str:
        year = now.strftime("%Y")
        month = now.strftime("%m")
        safe_name = os.path.basename(filename)
        return f"files/{year}/{month}/{file_id}/{safe_name}"

    async def upload_file(self, tmp_path: str, s3_key: str) -> None:
        file_size = os.path.getsize(tmp_path)
        async with self._aiosession.client(
            "s3",
            endpoint_url=str(settings.s3_endpoint_url) if settings.s3_endpoint_url else None,
            config=self._config,
        ) as s3:
            # Use PutObject streaming from disk.
            # This avoids multipart compatibility issues and keeps memory usage low.
            with open(tmp_path, "rb") as f:
                await s3.put_object(
                    Bucket=settings.s3_bucket,
                    Key=s3_key,
                    Body=f,
                    ContentLength=file_size,
                )

    async def delete_object(self, s3_key: str) -> None:
        async with self._aiosession.client(
            "s3",
            endpoint_url=str(settings.s3_endpoint_url) if settings.s3_endpoint_url else None,
            config=self._config,
        ) as s3:
            await s3.delete_object(Bucket=settings.s3_bucket, Key=s3_key)

    async def ensure_bucket(self) -> None:
        async with self._aiosession.client(
            "s3",
            endpoint_url=str(settings.s3_endpoint_url) if settings.s3_endpoint_url else None,
            config=self._config,
        ) as s3:
            try:
                await s3.head_bucket(Bucket=settings.s3_bucket)
            except Exception:
                await s3.create_bucket(Bucket=settings.s3_bucket)

    def create_presigned_download_url(self, s3_key: str) -> str:
        # Presigned URLs cannot be infinite; /download/{slug} is the permanent URL.
        presign_endpoint = settings.s3_presign_endpoint_url or settings.s3_endpoint_url
        client = boto3.client(
            "s3",
            endpoint_url=str(presign_endpoint) if presign_endpoint else None,
            aws_access_key_id=settings.s3_access_key_id,
            aws_secret_access_key=settings.s3_secret_access_key,
            region_name=settings.s3_region or None,
            config=self._config,
        )
        return client.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": settings.s3_bucket, "Key": s3_key},
            ExpiresIn=settings.s3_presign_ttl_seconds,
        )
