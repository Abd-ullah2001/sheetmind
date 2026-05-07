from supabase import create_client, Client
from app.config import get_settings

settings = get_settings()

supabase_client: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_key
)
