from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

class WebhookConfigBase(BaseModel):
    zapier_url: str
    events: List[str]
    active: bool = True

class WebhookConfigCreate(WebhookConfigBase):
    pass

class WebhookConfig(WebhookConfigBase):
    id: str
    user_id: str
    secret: str
    created_at: datetime

    class Config:
        from_attributes = True

class InboundWebhookRequest(BaseModel):
    user_id: str
    file_id: str
    query: str
    signature: str
