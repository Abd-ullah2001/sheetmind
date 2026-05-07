import uuid
import time
import structlog
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

log = structlog.get_logger()


class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Middleware that:
    - Generates a unique request ID per request
    - Attaches it to the request state for downstream use
    - Logs request start/end with method, path, status, and latency
    - Returns the request ID in the X-Request-ID response header
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id

        start_time = time.time()

        log.info(
            "request_started",
            request_id=request_id,
            method=request.method,
            path=request.url.path,
            client=request.client.host if request.client else "unknown",
        )

        try:
            response = await call_next(request)
        except Exception as exc:
            latency_ms = int((time.time() - start_time) * 1000)
            log.error(
                "request_failed",
                request_id=request_id,
                method=request.method,
                path=request.url.path,
                latency_ms=latency_ms,
                error=str(exc),
            )
            raise

        latency_ms = int((time.time() - start_time) * 1000)

        log.info(
            "request_completed",
            request_id=request_id,
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            latency_ms=latency_ms,
        )

        response.headers["X-Request-ID"] = request_id
        return response
