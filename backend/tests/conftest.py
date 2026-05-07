"""
Shared test fixtures and configuration for the SheetMind backend test suite.

All tests use mocked external services (Supabase, S3, Redis) so they can run
without any credentials or network access.
"""
import os
import sys
import pytest

# Ensure the backend directory is on the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# ── Provide fake env vars BEFORE any app module is imported ──────────────
os.environ.setdefault("APP_ENV", "testing")
os.environ.setdefault("SECRET_KEY", "test-secret-key-64-chars-padded-for-length-xxxxxxxxxxxxxxxxxxxxxxxxx")
os.environ.setdefault("SUPABASE_URL", "https://fake-project.supabase.co")
os.environ.setdefault("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZha2UifQ.fake-signature")
os.environ.setdefault("SUPABASE_SERVICE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZha2UifQ.fake-signature")
os.environ.setdefault("AWS_ACCESS_KEY_ID", "FAKEACCESSKEYID")
os.environ.setdefault("AWS_SECRET_ACCESS_KEY", "FAKESECRETACCESSKEY")
os.environ.setdefault("AWS_S3_BUCKET_NAME", "sheetmind-test-bucket")
os.environ.setdefault("AWS_REGION", "us-east-1")
os.environ.setdefault("UPSTASH_REDIS_REST_URL", "https://fake-redis.upstash.io")
os.environ.setdefault("UPSTASH_REDIS_REST_TOKEN", "fake-redis-token")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")
os.environ.setdefault("NVIDIA_API_KEY", "fake-nvidia-key")
os.environ.setdefault("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
os.environ.setdefault("NVIDIA_MODEL", "meta/llama-3.1-70b-instruct")
os.environ.setdefault("GOOGLE_CLIENT_ID", "fake-google-client-id")
os.environ.setdefault("GOOGLE_CLIENT_SECRET", "fake-google-client-secret")
os.environ.setdefault("AZURE_AD_CLIENT_ID", "fake-azure-client-id")
os.environ.setdefault("AZURE_AD_CLIENT_SECRET", "fake-azure-client-secret")
os.environ.setdefault("AZURE_AD_TENANT_ID", "fake-azure-tenant-id")
os.environ.setdefault("JWT_SECRET", "test-jwt-secret-64-chars-padded-for-length-xxxxxxxxxxxxxxxxxxxxxxxxx")
os.environ.setdefault("JWT_ALGORITHM", "HS256")
os.environ.setdefault("JWT_EXPIRE_MINUTES", "60")
os.environ.setdefault("SENTRY_DSN", "")
