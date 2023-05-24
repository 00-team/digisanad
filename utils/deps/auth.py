
from hashlib import sha3_512, sha256

from fastapi import Depends, HTTPException, Request

# from database.plutus import User, admin_check_token
from db import UserModel
from db.api.redis import rate_limit_get, rate_limit_set
from db.api.user import user_get_by_id

INVALID_AUTH = HTTPException(403, 'Invalid authentication credentials')


def rate_limit_check(period: int, amount: int):
    async def check(request, path_id, update):
        forwarded = request.headers.get('X-Forwarded-For')
        if forwarded:
            ip = forwarded.split(',')[0]
        else:
            ip = request.client.host

        identifier = sha256(f'{path_id}:{ip}'.encode('utf-8')).hexdigest()

        key = f'rate_limit_token:{identifier}'
        value, expire = await rate_limit_get(key)

        if value >= amount:
            raise HTTPException(
                429, 'Too Many Requests',
                headers={
                    'X-RateLimit-Limit': str(amount),
                    'X-RateLimit-Reset-After': str(expire)
                }
            )

        if update:
            await rate_limit_set(key, period)

    return check


rate_limit = rate_limit_check(3600, 10)


def get_token(request: Request, schema: str) -> str:
    authorization = request.headers.get(
        'Authorization',
        request.cookies.get('Authorization')
    )

    if not authorization:
        raise HTTPException(403, 'Not authenticated')

    token = authorization.partition(' ')

    if len(token) != 3:
        raise INVALID_AUTH

    if token[0].lower() != schema:
        raise INVALID_AUTH

    return token[2]


def token_id(token_raw: str):
    try:
        data_id, token = token_raw.split(':')
        return int(data_id), token
    except ValueError:
        raise INVALID_AUTH


def user_required():
    '''user token is required'''

    async def decorator(request: Request):
        user = getattr(request.state, 'user', None)

        if isinstance(user, UserModel):
            return user.user_id

        user_id, token = token_id(get_token(request, 'user'))
        token_hash = sha3_512(token.encode()).hexdigest()

        user = await user_get_by_id(user_id, token_hash)

        condition = user is None
        await rate_limit(request, 'user_token_check', condition)

        if condition:
            raise INVALID_AUTH

        request.state.user = user
        return user.user_id

    return Depends(decorator)
