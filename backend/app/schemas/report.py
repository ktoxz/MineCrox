from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class ReportCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=255)
    reason: str = Field(min_length=3, max_length=2000)
    email: str | None = Field(default=None, max_length=320)


class ReportPublic(BaseModel):
    id: int
    slug: str
    reason: str
    email: str | None
    created_at: datetime
