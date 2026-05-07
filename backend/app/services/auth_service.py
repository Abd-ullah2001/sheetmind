import datetime
import httpx
from typing import Dict, Any, Optional
from jose import jwt, JWTError
import msal

from backend.app.config import get_settings
from backend.app.database import supabase_client

settings = get_settings()

def create_jwt_token(user_id: str, email: str, provider: str) -> str:
    now = datetime.datetime.utcnow()
    expire = now + datetime.timedelta(minutes=settings.jwt_expire_minutes)
    payload = {
        "sub": str(user_id),
        "email": email,
        "provider": provider,
        "exp": expire,
        "iat": now
    }
    encoded_jwt = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return encoded_jwt

def verify_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        raise ValueError("Invalid or expired token")

def upsert_user(email: str, name: str, avatar_url: str, provider: str) -> dict:
    # Check if user exists
    res = supabase_client.table("users").select("*").eq("email", email).execute()
    users = res.data
    
    if len(users) > 0:
        user = users[0]
        # Update last_login
        supabase_client.table("users").update({"last_login": "now()"}).eq("id", user["id"]).execute()
        return user
    else:
        # Insert new user
        new_user = {
            "email": email,
            "name": name,
            "avatar_url": avatar_url,
            "provider": provider
        }
        res = supabase_client.table("users").insert(new_user).execute()
        return res.data[0]

def store_oauth_tokens(user_id: str, provider: str, access_token: str, refresh_token: str, expires_at: datetime.datetime, scopes: list):
    token_data = {
        "user_id": user_id,
        "provider": provider,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_at": expires_at.isoformat() if expires_at else None,
        "scopes": scopes
    }
    # Supabase UPSERT based on user_id + provider
    # Note: supabase-py doesn't cleanly expose ON CONFLICT out of the box in simple .insert(), 
    # but we can use .upsert()
    supabase_client.table("oauth_tokens").upsert(token_data, on_conflict="user_id,provider").execute()

def get_oauth_tokens(user_id: str, provider: str) -> str:
    res = supabase_client.table("oauth_tokens").select("*").eq("user_id", user_id).eq("provider", provider).execute()
    if not res.data:
        raise ValueError("No tokens found")
        
    token_row = res.data[0]
    
    # Check expiration
    if token_row.get("expires_at"):
        expires_at = datetime.datetime.fromisoformat(token_row["expires_at"].replace("Z", "+00:00"))
        if datetime.datetime.utcnow().replace(tzinfo=datetime.timezone.utc) >= expires_at:
            if provider == "google":
                return refresh_google_token(user_id, token_row.get("refresh_token"))
            elif provider == "microsoft":
                return refresh_microsoft_token(user_id, token_row.get("refresh_token"))
                
    return token_row["access_token"]

def refresh_google_token(user_id: str, refresh_token: str) -> str:
    if not refresh_token:
        raise ValueError("No refresh token available")
        
    data = {
        "client_id": settings.google_client_id,
        "client_secret": settings.google_client_secret,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token"
    }
    
    response = httpx.post("https://oauth2.googleapis.com/token", data=data)
    if response.status_code != 200:
        raise ValueError(f"Failed to refresh Google token: {response.text}")
        
    result = response.json()
    new_access_token = result["access_token"]
    expires_in = result.get("expires_in", 3600)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in)
    
    # Only updates access_token and expires_at
    supabase_client.table("oauth_tokens").update({
        "access_token": new_access_token,
        "expires_at": expires_at.isoformat(),
        "updated_at": "now()"
    }).eq("user_id", user_id).eq("provider", "google").execute()
    
    return new_access_token

def refresh_microsoft_token(user_id: str, refresh_token: str) -> str:
    if not refresh_token:
        raise ValueError("No refresh token available")
        
    app = msal.ConfidentialClientApplication(
        settings.azure_ad_client_id,
        authority=f"https://login.microsoftonline.com/{settings.azure_ad_tenant_id}",
        client_credential=settings.azure_ad_client_secret
    )
    
    result = app.acquire_token_by_refresh_token(refresh_token, scopes=["https://graph.microsoft.com/.default"])
    
    if "access_token" not in result:
        raise ValueError(f"Failed to refresh MS token: {result.get('error_description')}")
        
    new_access_token = result["access_token"]
    # refresh token may also be rotated
    new_refresh_token = result.get("refresh_token", refresh_token)
    expires_in = result.get("expires_in", 3600)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in)
    
    supabase_client.table("oauth_tokens").update({
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "expires_at": expires_at.isoformat(),
        "updated_at": "now()"
    }).eq("user_id", user_id).eq("provider", "microsoft").execute()
    
    return new_access_token
