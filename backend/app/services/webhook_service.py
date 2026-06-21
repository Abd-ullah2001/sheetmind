import hmac
import hashlib
import json
import httpx
from typing import List, Dict, Any
import app.database
from app.tasks.celery_app import celery_app

def get_active_webhooks(user_id: str, event_type: str):
    """
    Fetches active webhooks for a user and event type.
    """
    res = app.database.supabase_client.table("webhook_configs") \
        .select("*") \
        .eq("user_id", user_id) \
        .eq("active", True) \
        .execute()
    
    # Filter by event_type in events array
    return [w for w in res.data if event_type in w.get("events", [])]

async def fire_webhook(webhook_config: Dict[str, Any], payload: Dict[str, Any]):
    """
    Sends a POST request to the webhook URL with an HMAC signature.
    """
    url = webhook_config["zapier_url"]
    secret = webhook_config["secret"]
    
    payload_json = json.dumps(payload)
    signature = hmac.new(
        secret.encode(),
        payload_json.encode(),
        hashlib.sha256
    ).hexdigest()
    
    headers = {
        "Content-Type": "application/json",
        "X-SheetMind-Signature": f"sha256={signature}"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            res = await client.post(url, content=payload_json, headers=headers, timeout=10.0)
            return res.status_code == 200
        except Exception:
            return False

def notify_event(user_id: str, event_type: str, data: Dict[str, Any]):
    """
    Dispatches a Celery task to fire webhooks for an event.
    """
    webhooks = get_active_webhooks(user_id, event_type)
    for webhook in webhooks:
        # Import task here to avoid circular imports
        from app.tasks.webhook_tasks import fire_webhook_task
        fire_webhook_task.delay(webhook["id"], data)
