import hmac
import hashlib
import uuid
import secrets
from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from app.middleware.auth_middleware import get_current_user
from app.database import supabase_client
from app.models.webhook import WebhookConfig, WebhookConfigCreate, InboundWebhookRequest
from app.services.agent_service import run_agent_query

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

@router.get("/", response_model=List[WebhookConfig])
async def list_webhooks(current_user: dict = Depends(get_current_user)):
    """
    Returns all webhook configurations for the current user.
    """
    res = supabase_client.table("webhook_configs") \
        .select("*") \
        .eq("user_id", current_user["user_id"]) \
        .execute()
    return res.data

@router.post("/", response_model=WebhookConfig)
async def create_webhook(config: WebhookConfigCreate, current_user: dict = Depends(get_current_user)):
    """
    Creates a new webhook configuration.
    """
    new_webhook = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["user_id"],
        "zapier_url": config.zapier_url,
        "events": config.events,
        "active": config.active,
        "secret": secrets.token_hex(32)
    }
    res = supabase_client.table("webhook_configs").insert(new_webhook).execute()
    return res.data[0]

@router.put("/{webhook_id}", response_model=WebhookConfig)
async def update_webhook(webhook_id: str, config: WebhookConfigCreate, current_user: dict = Depends(get_current_user)):
    """
    Updates an existing webhook configuration.
    """
    update_data = {
        "zapier_url": config.zapier_url,
        "events": config.events,
        "active": config.active
    }
    res = supabase_client.table("webhook_configs") \
        .update(update_data) \
        .eq("id", webhook_id) \
        .eq("user_id", current_user["user_id"]) \
        .execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Webhook not found")
    return res.data[0]

@router.delete("/{webhook_id}")
async def delete_webhook(webhook_id: str, current_user: dict = Depends(get_current_user)):
    """
    Deletes a webhook configuration.
    """
    supabase_client.table("webhook_configs") \
        .delete() \
        .eq("id", webhook_id) \
        .eq("user_id", current_user["user_id"]) \
        .execute()
    return {"message": "Webhook deleted"}

@router.post("/inbound")
async def inbound_webhook(request: InboundWebhookRequest):
    """
    External endpoint to trigger an agent query via webhook (e.g., from Zapier).
    """
    # 1. Fetch user's webhook config to get the secret
    res = supabase_client.table("webhook_configs") \
        .select("secret") \
        .eq("user_id", request.user_id) \
        .eq("active", True) \
        .execute()
    
    if not res.data:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # We verify against all active webhooks for this user
    # In a real app, you might want to specify which webhook ID is calling
    authorized = False
    for config in res.data:
        secret = config["secret"]
        # Verify HMAC signature
        # Payload for signature should be carefully defined. Here we assume it's user_id + file_id + query
        payload = f"{request.user_id}{request.file_id}{request.query}"
        expected_signature = hmac.new(
            secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if hmac.compare_digest(expected_signature, request.signature):
            authorized = True
            break
            
    if not authorized:
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    # 2. Run the agent query
    try:
        result = run_agent_query(
            user_id=request.user_id,
            file_id=request.file_id,
            query=request.query
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
