
from fastapi import APIRouter, Response

from api.models.auth import AuthResponse, LoginBody, RegisterBody
from api.verification import Action, verify_verification
from db.models import UserTable
from db.user import user_add, user_get, user_update
from deps import rate_limit
from shared.errors import account_exists, bad_verification, register_required
from shared.tools import new_token

router = APIRouter(
    prefix='/auth',
    tags=['auth'],
    dependencies=[rate_limit('auth', 30 * 60, 20, False)]
)


@router.post(
    '/register/', response_model=AuthResponse,
    openapi_extra={'errors': [account_exists, bad_verification]}
)
async def register(response: Response, body: RegisterBody):
    await verify_verification(
        body.phone, body.code, Action.register
    )

    user = await user_get(UserTable.phone == body.phone)
    if user:
        raise account_exists

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
        token=token_hash
    )

    token = f'{user_id}:{token}'
    response.set_cookie(
        key='Authorization',
        value=f'Bearer {token}',
        secure=True,
        samesite='strict'
    )

    return {
        'user_id': user_id,
        'token': token,
    }


@router.post(
    '/login/', response_model=AuthResponse,
    openapi_extra={'errors': [register_required, bad_verification]}
)
async def login(response: Response, body: LoginBody):
    await verify_verification(
        body.phone, body.code, Action.login
    )

    user = await user_get(UserTable.phone == body.phone)
    if user is None:
        raise register_required

    token, token_hash = new_token()
    await user_update(UserTable.user_id == user.user_id, token=token_hash)

    token = f'{user.user_id}:{token}'
    response.set_cookie(
        key='Authorization',
        value=f'Bearer {token}',
        secure=True,
        samesite='strict'
    )

    return {
        'user_id': user.user_id,
        'token': token,
    }
