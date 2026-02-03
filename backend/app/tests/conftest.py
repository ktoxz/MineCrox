from __future__ import annotations

import os
import tempfile
from collections.abc import AsyncIterator

import pytest
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient

from app.main import create_app
from app.db.session import reset_engine
from app.storage.s3_storage import S3Storage


class FakeS3Storage:
    def __init__(self) -> None:
        self.objects: dict[str, bytes] = {}

    def build_key(self, file_id: str, filename: str, now) -> str:  # noqa: ANN001
        return f"files/test/{file_id}/{filename}"

    async def upload_file(self, tmp_path: str, s3_key: str) -> None:
        with open(tmp_path, "rb") as f:
            self.objects[s3_key] = f.read()

    async def delete_object(self, s3_key: str) -> None:
        self.objects.pop(s3_key, None)

    async def ensure_bucket(self) -> None:
        return

    def create_presigned_download_url(self, s3_key: str) -> str:
        # Deterministic, not a real signed URL.
        return f"https://cdn.test.local/{s3_key}"


@pytest.fixture
async def app() -> AsyncIterator:
    # Isolated temp DB per test session.
    fd, path = tempfile.mkstemp(prefix="minecrox-test-", suffix=".db")
    os.close(fd)
    await reset_engine(f"sqlite+aiosqlite:///{path}")

    application = create_app()

    fake = FakeS3Storage()
    application.dependency_overrides[S3Storage.from_depends] = lambda: fake

    async with LifespanManager(application):
        yield application

    try:
        os.remove(path)
    except OSError:
        pass


@pytest.fixture
async def client(app) -> AsyncIterator[AsyncClient]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
