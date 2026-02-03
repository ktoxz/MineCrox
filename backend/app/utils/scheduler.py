from __future__ import annotations

import asyncio
import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.config.settings import settings
from app.db import session as db_session
from app.services.maintenance_service import MaintenanceService
from app.storage.s3_storage import S3Storage

logger = logging.getLogger(__name__)


def start_scheduler() -> AsyncIOScheduler | None:
    if not settings.enable_scheduler:
        return None

    scheduler = AsyncIOScheduler(timezone="UTC")

    async def _run_cleanup() -> None:
        db_session.init_engine()
        assert db_session.SessionLocal is not None
        async with db_session.SessionLocal() as session:
            svc = MaintenanceService(session=session, storage=S3Storage())
            try:
                deleted = await svc.cleanup_expired_files()
                pruned = await svc.prune_download_logs()
                if deleted or pruned:
                    logger.info("maintenance: deleted=%s pruned=%s", deleted, pruned)
            except Exception:
                logger.exception("maintenance job failed")

    def _kickoff() -> None:
        asyncio.create_task(_run_cleanup())

    scheduler.add_job(_kickoff, "interval", hours=1, id="maintenance-hourly", max_instances=1)
    scheduler.start()
    return scheduler
