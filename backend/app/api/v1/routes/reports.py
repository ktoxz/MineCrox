from fastapi import APIRouter, Depends, HTTPException, Request
from urllib.parse import urlparse

from app.schemas.report import ReportCreate, ReportPublic
from app.services.report_service import ReportService
from app.config.settings import settings
from app.utils.turnstile import get_request_ip, verify_turnstile

router = APIRouter(prefix="/reports")


@router.post("", response_model=ReportPublic)
async def create_report(
    payload: ReportCreate,
    request: Request,
    service: ReportService = Depends(ReportService.from_depends),
) -> ReportPublic:
    if settings.turnstile_enabled:
        try:
            ip = get_request_ip(dict(request.headers), request.client.host if request.client else None)
            origin = request.headers.get("origin") or ""
            origin_host = urlparse(origin).hostname if origin else None
            await verify_turnstile(payload.captcha_token or "", ip, origin_host)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    return await service.create_report(payload, request)
