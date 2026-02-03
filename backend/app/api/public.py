from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse

from app.middleware.rate_limit import limiter
from app.config.settings import settings
from app.services.download_service import DownloadService

router = APIRouter()


@router.get("/download/{slug}")
@limiter.limit(settings.rate_limit_download_per_minute)
async def public_download(
    request: Request,
    slug: str,
    service: DownloadService = Depends(DownloadService.from_depends),
) -> RedirectResponse:
    _ = request
    url = await service.create_download_redirect(slug)
    return RedirectResponse(url=url, status_code=302)
