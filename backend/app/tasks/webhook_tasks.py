import asyncio
from app.tasks.celery_app import celery_app
from app.database import supabase_client
import app.services.webhook_service as webhook_service

@celery_app.task(bind=True, max_retries=3)
def fire_webhook_task(self, webhook_config_id: str, payload: dict):
    """
    Celery task to fire a webhook with exponential backoff retries.
    """
    res = supabase_client.table("webhook_configs") \
        .select("*") \
        .eq("id", webhook_config_id) \
        .single() \
        .execute()
    
    if not res.data:
        return f"Webhook config {webhook_config_id} not found"
    
    webhook_config = res.data
    
    # Run async function in sync Celery task
    loop = asyncio.get_event_loop()
    if loop.is_running():
        # This shouldn't really happen in a standard Celery worker, but just in case
        success = asyncio.run_coroutine_threadsafe(
            webhook_service.fire_webhook(webhook_config, payload), 
            loop
        ).result()
    else:
        success = asyncio.run(webhook_service.fire_webhook(webhook_config, payload))
    
    if not success:
        # Retry with exponential backoff: 1s, 5s, 25s...
        retry_delay = 5 ** self.request.retries
        raise self.retry(countdown=retry_delay)
    
    return f"Webhook {webhook_config_id} fired successfully"
