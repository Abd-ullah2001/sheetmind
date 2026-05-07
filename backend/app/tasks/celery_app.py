import os
from celery import Celery
from app.config import get_settings

settings = get_settings()

celery_app = Celery(
    "sheetmind_tasks",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks.file_tasks", "app.tasks.webhook_tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    result_expires=3600
)
