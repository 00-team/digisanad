from database import redis


async def rate_limit_get(identifier: str) -> tuple[int, int]:
    value = await redis.get(identifier)
    if value is None:
        return (0, 0)

    expire = await redis.ttl(identifier)

    return (int(value), expire)


async def rate_limit_set(identifier: str, period: int):
    exists = await redis.exists(identifier)

    if exists:
        await redis.incr(identifier, 1)
    else:
        await redis.set(identifier, 1, period)


__all__ = [
    'rate_limit_get',
    'rate_limit_set',
]
