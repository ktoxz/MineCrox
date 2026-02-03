from fastapi import APIRouter

from app.api.v1.routes import analytics, downloads, files, reports, uploads

v1_router = APIRouter()

v1_router.include_router(uploads.router, tags=["uploads"])
v1_router.include_router(files.router, tags=["files"])
v1_router.include_router(downloads.router, tags=["downloads"])
v1_router.include_router(analytics.router, tags=["analytics"])
v1_router.include_router(reports.router, tags=["reports"])
