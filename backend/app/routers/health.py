from fastapi import APIRouter
from app.database import supabase_client
from app.redis_client import redis_client
from app.s3_client import s3_client
from app.config import get_settings

router = APIRouter(tags=["health"])
settings = get_settings()

@router.get("/health")
def health_check():
    status = {
        "status": "ok",
        "version": "1.0.0",
        "services": {
            "database": "ok",
            "redis": "ok",
            "s3": "ok"
        }
    }
    
    # Check Supabase
    try:
        supabase_client.table("users").select("id", count="exact").limit(1).execute()
    except Exception as e:
        status["services"]["database"] = f"error: {str(e)}"
        status["status"] = "error"
        
    # Check Redis
    try:
        redis_client.get("health_check_ping")
    except Exception as e:
        status["services"]["redis"] = f"error: {str(e)}"
        status["status"] = "error"
        
    # Check S3
    try:
        s3_client.head_bucket(Bucket=settings.aws_s3_bucket_name)
    except Exception as e:
        status["services"]["s3"] = f"error: {str(e)}"
        status["status"] = "error"
        
    return status
