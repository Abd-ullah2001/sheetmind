from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import verify_jwt_token

# Tests expect 403 for missing/invalid JWT.
security = HTTPBearer(auto_error=False)

def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security)):
    if credentials is None:
        raise HTTPException(
            status_code=403,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    try:
        payload = verify_jwt_token(token)
        return {
            "user_id": payload.get("sub"),
            "email": payload.get("email"),
            "provider": payload.get("provider"),
        }
    except Exception:
        raise HTTPException(
            status_code=403,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


