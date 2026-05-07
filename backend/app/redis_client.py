import redis
from upstash_redis import Redis as UpstashRedis
from app.config import get_settings

settings = get_settings()

if "upstash.io" in settings.upstash_redis_rest_url:
    # Use Upstash Redis REST Client for production
    redis_client = UpstashRedis(
        url=settings.upstash_redis_rest_url,
        token=settings.upstash_redis_rest_token
    )
else:
    # Use standard Redis for local development via standard Redis protocol
    # Provide an adapter that mimics the sync REST API of Upstash
    class LocalRedisClient:
        def __init__(self, url):
            self.client = redis.from_url(url, decode_responses=True)
            
        def get(self, key):
            return self.client.get(key)
            
        def set(self, key, value, ex=None):
            return self.client.set(key, value, ex=ex)
            
        def delete(self, *keys):
            return self.client.delete(*keys)
            
        def scan(self, cursor=0, match=None, count=None):
            return self.client.scan(cursor=cursor, match=match, count=count)
            
    redis_client = LocalRedisClient(settings.redis_url)
