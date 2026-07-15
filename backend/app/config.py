from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=(".env", "backend/.env"), extra="ignore")

    app_env: str = "development"
    secret_key: str

    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_key: str

    # AWS S3
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_s3_bucket_name: str
    aws_region: str = "us-east-1"

    # Redis (Upstash)
    upstash_redis_rest_url: str
    upstash_redis_rest_token: str

    # Redis (Standard for Celery)
    redis_url: str = "redis://redis:6379/0"

    # NVIDIA NIM
    nvidia_api_key: str
    nvidia_base_url: str = "https://integrate.api.nvidia.com/v1"
    nvidia_model: str = "meta/llama-3.1-70b-instruct"

    # Google OAuth
    google_client_id: str
    google_client_secret: str

    # Microsoft OAuth
    azure_ad_client_id: str
    azure_ad_client_secret: str
    azure_ad_tenant_id: str

    # Sentry
    sentry_dsn: str = ""

    # JWT
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache()
def get_settings():
    return Settings()
