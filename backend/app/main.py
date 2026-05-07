import structlog
import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.limiter import limiter
from app.config import get_settings
from app.middleware.logging_middleware import RequestIDMiddleware

# Routers
from app.routers import auth, files, sheets, agent, webhooks, logs, health

settings = get_settings()

# --- Structlog configuration (Phase 7.1) ---
structlog.configure(
    processors=[
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer(),
    ]
)

if settings.is_production and settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        traces_sample_rate=1.0,
    )

app = FastAPI(title="SheetMind API", version="1.0.0")

# --- Request ID / Logging middleware (Phase 7.2) ---
app.add_middleware(RequestIDMiddleware)

# CORS middleware
origins = [
    "http://localhost:3000",
]
if settings.is_production:
    # We would add the production frontend URL here
    origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiter setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Redirect root to docs
@app.get("/", include_in_schema=False)
def redirect_root():
    return RedirectResponse(url="/docs")

# Mount routers
app.include_router(health.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(files.router, prefix="/api/v1")
app.include_router(sheets.router, prefix="/api/v1")
app.include_router(agent.router, prefix="/api/v1")
app.include_router(webhooks.router, prefix="/api/v1")
app.include_router(logs.router, prefix="/api/v1")
