from fastapi import APIRouter, Depends, File, Form, Request, UploadFile
from fastapi import HTTPException
from urllib.parse import urlparse

from app.middleware.rate_limit import limiter
from app.schemas.file import FileCreateResponse
from app.services.upload_service import UploadService
from app.config.settings import settings
from app.utils.turnstile import get_request_ip, verify_turnstile

router = APIRouter(prefix="/uploads")


@router.post("", response_model=FileCreateResponse)
@limiter.limit(settings.rate_limit_upload_3_per_hour)
@limiter.limit(settings.rate_limit_upload_10_per_day)
async def upload_file(
    request: Request,
    upload: UploadFile = File(..., description="Minecraft-related file"),
    captcha_token: str | None = Form(default=None),
    service: UploadService = Depends(UploadService.from_depends),
) -> FileCreateResponse:
    if settings.turnstile_enabled:
        try:
            ip = get_request_ip(dict(request.headers), request.client.host if request.client else None)
            origin = request.headers.get("origin") or ""
            origin_host = urlparse(origin).hostname if origin else None
            await verify_turnstile(captcha_token or "", ip, origin_host)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    return await service.handle_upload(
        upload=upload,
    )
