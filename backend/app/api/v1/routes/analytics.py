from fastapi import APIRouter, Depends

from app.schemas.analytics import FileAnalytics
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics")


@router.get("/files/{slug}", response_model=FileAnalytics)
async def file_analytics(
    slug: str,
    service: AnalyticsService = Depends(AnalyticsService.from_depends),
) -> FileAnalytics:
    return await service.get_file_analytics(slug)
