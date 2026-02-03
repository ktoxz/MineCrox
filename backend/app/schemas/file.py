from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, HttpUrl


class ResourcePackGeneratorInfo(BaseModel):
    download_url: HttpUrl
    sha1: str
    server_properties_snippet: str


class FileCreateResponse(BaseModel):
    id: str
    slug: str
    landing_page_url: HttpUrl
    delete_token: str
    resource_pack: ResourcePackGeneratorInfo | None = None


class FilePublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    filename: str
    slug: str
    file_type: str
    minecraft_version: str | None
    loader: str | None
    description: str | None
    tags: str | None
    file_size: int
    sha1_hash: str
    download_count: int
    created_at: datetime
    last_download: datetime | None
    expire_at: datetime
