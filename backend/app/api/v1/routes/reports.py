from fastapi import APIRouter, Depends, Request

from app.schemas.report import ReportCreate, ReportPublic
from app.services.report_service import ReportService

router = APIRouter(prefix="/reports")


@router.post("", response_model=ReportPublic)
async def create_report(
    payload: ReportCreate,
    request: Request,
    service: ReportService = Depends(ReportService.from_depends),
) -> ReportPublic:
    return await service.create_report(payload, request)
