from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel


class FileAnalytics(BaseModel):
    slug: str
    download_count: int
    last_download: datetime | None
    today_downloads: int
    today: date
