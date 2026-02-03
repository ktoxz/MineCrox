from __future__ import annotations

import json

from pydantic import AnyUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

    domain: str = Field(default="minecrox.ktoxz.id.vn", alias="DOMAIN")
    backend_env: str = Field(default="dev", alias="BACKEND_ENV")

    # Use a string here because pydantic-settings tries to JSON-decode list[str]
    # env values and will raise if the value isn't valid JSON.
    cors_origins: str = Field(default="http://localhost:3000", alias="BACKEND_CORS_ORIGINS")

    def cors_origins_list(self) -> list[str]:
        s = (self.cors_origins or "").strip()
        if not s:
            return ["http://localhost:3000"]
        if s.startswith("["):
            try:
                parsed = json.loads(s)
                if isinstance(parsed, list) and all(isinstance(x, str) for x in parsed):
                    return parsed
            except Exception:
                pass
        return [part.strip() for part in s.split(",") if part.strip()]

    database_url: str = Field(default="sqlite+aiosqlite:///./app.db", alias="DATABASE_URL")

    max_upload_bytes: int = Field(default=104857600, alias="MAX_UPLOAD_BYTES")
    ip_hash_secret: str = Field(default="dev-secret-change-me", alias="IP_HASH_SECRET")

    file_expire_days: int = Field(default=3, alias="FILE_EXPIRE_DAYS")
    download_log_retention_days: int = Field(default=90, alias="DOWNLOAD_LOG_RETENTION_DAYS")

    enable_scheduler: bool = Field(default=False, alias="ENABLE_SCHEDULER")

    # S3
    s3_endpoint_url: AnyUrl | None = Field(default=None, alias="S3_ENDPOINT_URL")
    # Endpoint used ONLY to generate presigned URLs (publicly reachable hostname).
    # Important: do not change the host of a presigned URL after signing.
    s3_presign_endpoint_url: AnyUrl | None = Field(default=None, alias="S3_PRESIGN_ENDPOINT_URL")
    s3_region: str | None = Field(default=None, alias="S3_REGION")
    s3_bucket: str = Field(default="minecrox-dev", alias="S3_BUCKET")
    s3_access_key_id: str = Field(default="minio", alias="S3_ACCESS_KEY_ID")
    s3_secret_access_key: str = Field(default="minio123456", alias="S3_SECRET_ACCESS_KEY")
    s3_presign_ttl_seconds: int = Field(default=600, alias="S3_PRESIGN_TTL_SECONDS")

    # Rate limits (SlowAPI format)
    rate_limit_upload_3_per_hour: str = Field(default="3/hour", alias="RATE_LIMIT_UPLOAD_3_PER_HOUR")
    rate_limit_upload_10_per_day: str = Field(default="10/day", alias="RATE_LIMIT_UPLOAD_10_PER_DAY")
    rate_limit_download_per_minute: str = Field(default="30/minute", alias="RATE_LIMIT_DOWNLOAD_PER_MINUTE")
    rate_limit_redis_url: str | None = Field(default=None, alias="RATE_LIMIT_REDIS_URL")


settings = Settings()  # type: ignore[call-arg]
