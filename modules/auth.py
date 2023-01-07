
from fastapi import APIRouter, Request

from database.api import user_add, user_get_by_phone, user_update
from models.auth import LoginBody, LoginResponse, VerifyBody, VerifyResponse
from utils import new_token, rate_limit, send_verification, verify_verification

AUTH_RATE_LIMIT = rate_limit('auth', 30 * 60, 20, False)

router = APIRouter(
    prefix='/auth',
    tags=['auth'],
    dependencies=[AUTH_RATE_LIMIT]
)


@router.post('/login/', response_model=LoginResponse)
async def login(body: LoginBody):
    return await send_verification(body.phone, 'LOGIN')


@router.post('/verify/', response_model=VerifyResponse)
async def verify(request: Request, body: VerifyBody):
    await verify_verification(body.phone, body.code, 'LOGIN')

    token, token_hash = new_token()

    user = await user_get_by_phone(body.phone)

    if not user:
        user_id = await user_add(phone=body.phone, token=token_hash)
        return {
            'created': True,
            'user_id': user_id,
            'wallet': user.wallet,
            'token': f'{user_id}:{token}',
        }
    else:
        await user_update(user.user_id, token=token_hash)
        return {
            'created': False,
            'user_id': user.user_id,
            'nickname': user.nickname,
            'wallet': user.wallet,
            'picture': user.picture_url(request.base_url),
            'token': f'{user.user_id}:{token}',
        }
