from fastapi import APIRouter, Depends, Request
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
    service: UploadService = Depends(UploadService.from_depends),
) -> FileCreateResponse:
    # IMPORTANT:
    # Starlette's multipart parser has a per-part size limit (default is small).
    # For real uploads (~100MB), parsing can fail before we reach UploadService.
    # Parse the form here with an explicit max_part_size.
    try:
        form = await request.form(max_part_size=settings.max_upload_bytes)
    except Exception as e:
        # Convert parser errors into a consistent client error.
        raise HTTPException(status_code=413, detail=str(e) or "Upload too large")

    upload = form.get("upload")
    captcha_token = form.get("captcha_token")
    if not hasattr(upload, "read"):
        # Match FastAPI's typical validation behavior.
        raise HTTPException(status_code=422, detail="Field 'upload' is required")
    if captcha_token is not None and not isinstance(captcha_token, str):
        captcha_token = str(captcha_token)

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
