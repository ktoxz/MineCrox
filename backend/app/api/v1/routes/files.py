from fastapi import APIRouter, Depends, Header, Response

from app.schemas.file import FilePublic
from app.services.file_service import FileService

router = APIRouter(prefix="/files")


@router.get("/{slug}", response_model=FilePublic)
async def get_file(
    slug: str,
    service: FileService = Depends(FileService.from_depends),
) -> FilePublic:
    return await service.get_public_by_slug(slug)


@router.delete("/{slug}", status_code=204)
async def delete_file(
    slug: str,
    x_delete_token: str = Header(alias="X-Delete-Token"),
    service: FileService = Depends(FileService.from_depends),
) -> Response:
    await service.delete_by_slug(slug=slug, delete_token=x_delete_token)
    return Response(status_code=204)
