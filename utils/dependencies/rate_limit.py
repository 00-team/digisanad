from hashlib import sha256

from fastapi import Depends, HTTPException, Request

from database.api.redis import rate_limit_get, rate_limit_set

from .auth import user_required


def rate_limit(path_id: str, period: int, amount: int, use_id=True):
    async def check(identifier: str):
        identifier = f'rate_limit:{identifier}'
        value, expire = await rate_limit_get(identifier)

        if value >= amount:
            raise HTTPException(
                429, 'Too Many Requests',
                headers={
                    'X-RateLimit-Limit': str(amount),
                    'X-RateLimit-Reset-After': str(expire)
                }
            )

        await rate_limit_set(identifier, period)

    async def with_id(user_id: int = user_required()):
        key = f'{path_id}:{user_id}'
        identifier = sha256(key.encode('utf-8')).hexdigest()
        await check(identifier)

    async def with_ip(request: Request):
        forwarded = request.headers.get('X-Forwarded-For')
        if forwarded:
            ip = forwarded.split(',')[0]
        else:
            ip = request.client.host

        identifier = sha256(f'{path_id}:{ip}'.encode('utf-8')).hexdigest()
        await check(identifier)

    if use_id:
        return Depends(with_id)
    else:
        return Depends(with_ip)
