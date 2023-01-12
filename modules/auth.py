
from fastapi import APIRouter, HTTPException, Request

from database.api import user_add, user_get_by_phone, user_update
from models.auth import LoginBody, LoginResponse, RegisterBody
from models.auth import RegisterResponse, VerifyBody, VerifyResponse
from shared.tools import new_token
from utils import rate_limit, send_verification, verify_verification

AUTH_RATE_LIMIT = rate_limit('auth', 30 * 60, 20, False)

router = APIRouter(
    prefix='/auth',
    tags=['auth'],
    dependencies=[AUTH_RATE_LIMIT]
)


@router.post('/login/', response_model=LoginResponse)
async def login(body: LoginBody):
    return await send_verification(body.phone, 'LOGIN')


@router.post('/register/', response_model=RegisterResponse)
async def register(body: RegisterBody):
    print(body)
    return {'timer': 1}
    user_add


@router.post('/verify/', response_model=VerifyResponse)
async def verify(request: Request, body: VerifyBody):
    await verify_verification(body.phone, body.code, 'LOGIN')

    token, token_hash = new_token()

    user = await user_get_by_phone(body.phone)

    if not user:
        raise HTTPException(400, 'Register First.')

    await user_update(user.user_id, token=token_hash)

    return {
        'created': False,
        'user_id': user.user_id,
        'nickname': user.nickname,
        'wallet': user.wallet,
        'picture': user.picture_url(request.base_url),
        'token': f'{user.user_id}:{token}',
    }
