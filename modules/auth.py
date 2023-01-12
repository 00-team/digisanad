
from fastapi import APIRouter, HTTPException, Request

from database.api import user_add, user_get_by_phone, user_update
from models.auth import AuthResponse, LoginBody, RegisterBody, VerifyBody
from models.auth import VerifyResponse
from shared.tools import new_token
from utils import rate_limit, send_verification, verify_verification

AUTH_RATE_LIMIT = rate_limit('auth', 30 * 60, 20, False)

router = APIRouter(
    prefix='/auth',
    tags=['auth'],
    dependencies=[AUTH_RATE_LIMIT]
)


@router.post('/verify/', response_model=VerifyResponse)
async def verify(body: VerifyBody):
    return await send_verification(body.phone, body.action)


@router.post('/register/', response_model=AuthResponse)
async def register(body: RegisterBody):
    await verify_verification(body.phone, body.code, 'REGISTER')
    user = await user_get_by_phone(body.phone)
    if user:
        raise HTTPException(400, 'Login.')

    token, token_hash = new_token()
    bd = body.birth_date

    user_id = await user_add(
        phone=body.phone,
        first_name=body.first_name,
        last_name=body.last_name,
        birth_date=f'{bd[0]}-{bd[1]}-{bd[2]}',
        national_id=body.national_id,
        postal_code=body.postal_code,
        address=body.address,
        email=body.email,
        wallet=0,
        token=token_hash
    )

    return {
        'user_id': user_id,
        'token': f'{user_id}:{token}',
    }


@router.post('/login/', response_model=AuthResponse)
async def login(body: LoginBody):
    await verify_verification(body.phone, body.code, 'LOGIN')

    user = await user_get_by_phone(body.phone)
    if not user:
        raise HTTPException(400, 'Register First.')

    token, token_hash = new_token()
    await user_update(user.user_id, token=token_hash)

    return {
        'user_id': user.user_id,
        'token': f'{user.user_id}:{token}',
    }
