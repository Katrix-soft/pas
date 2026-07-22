import os
import json
import logging
from typing import Optional, Any
import redis.asyncio as aioredis

logger = logging.getLogger("redis_client")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

redis_client: Optional[aioredis.Redis] = None

def get_redis_client() -> Optional[aioredis.Redis]:
    global redis_client
    if redis_client is None and REDIS_URL:
        try:
            redis_client = aioredis.from_url(
                REDIS_URL, 
                encoding="utf-8", 
                decode_responses=True,
                socket_timeout=5.0
            )
        except Exception as e:
            logger.error(f"Error initializing Redis client: {e}")
            redis_client = None
    return redis_client

async def set_cache(key: str, value: Any, ttl_seconds: int = 3600) -> bool:
    try:
        client = get_redis_client()
        if client:
            serialized = json.dumps(value) if not isinstance(value, str) else value
            await client.set(key, serialized, ex=ttl_seconds)
            return True
    except Exception as e:
        logger.warning(f"Redis SET failed for key {key}: {e}")
    return False

async def get_cache(key: str) -> Optional[Any]:
    try:
        client = get_redis_client()
        if client:
            val = await client.get(key)
            if val:
                try:
                    return json.loads(val)
                except Exception:
                    return val
    except Exception as e:
        logger.warning(f"Redis GET failed for key {key}: {e}")
    return None

async def check_redis_health() -> dict:
    try:
        client = get_redis_client()
        if client and await client.ping():
            # Return masked redis url host
            host_info = REDIS_URL.split("@")[-1] if "@" in REDIS_URL else REDIS_URL
            return {"status": "connected", "redis": host_info}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
    return {"status": "disconnected", "detail": "Redis no disponible"}
