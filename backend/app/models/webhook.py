from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime


class WebhookConfigBase(BaseModel):
    zapier_url: str
    events: List[str]
    active: bool = True


class WebhookConfigCreate(WebhookConfigBase):
    pass


class WebhookConfig(WebhookConfigBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    secret: str
    created_at: datetime


class InboundWebhookRequest(BaseModel):
    user_id: str
    file_id: str
    query: str
    signature: str
