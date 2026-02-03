from __future__ import annotations

from datetime import UTC, datetime

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.report import Report
from app.repositories.report_repository import ReportRepository
from app.schemas.report import ReportCreate, ReportPublic
from app.services.deps import get_session
from app.utils.ip import client_ip_hash


class ReportService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._repo = ReportRepository(session)

    @staticmethod
    def from_depends(session: AsyncSession = Depends(get_session)) -> "ReportService":
        return ReportService(session)

    async def create_report(self, payload: ReportCreate, request: Request) -> ReportPublic:
        report = Report(
            slug=payload.slug,
            reason=payload.reason,
            email=payload.email,
            created_at=datetime.now(UTC),
            ip_hash=client_ip_hash(request),
        )
        await self._repo.add(report)
        await self._session.commit()
        return ReportPublic(
            id=report.id,
            slug=report.slug,
            reason=report.reason,
            email=report.email,
            created_at=report.created_at,
        )
