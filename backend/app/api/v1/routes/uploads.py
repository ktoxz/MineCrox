from fastapi import APIRouter, Depends, File, Form, Request, UploadFile

from app.middleware.rate_limit import limiter
from app.schemas.file import FileCreateResponse
from app.services.upload_service import UploadService
from app.config.settings import settings

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
    # CAPTCHA placeholder: wire this to a real provider later.
    _ = captcha_token
    _ = request

    return await service.handle_upload(
        upload=upload,
    )
