
from fastapi import APIRouter, Response
from pydantic import BaseModel, EmailStr, conlist, constr, validator

from api.verification import Action, verify_verification
from db.models import UserModel, UserTable
from db.user import user_add, user_get, user_update
from deps import rate_limit
from shared.errors import account_exists, bad_verification, register_required
from shared.jdate import jdate, jdatetime
from shared.tools import new_token
from shared.validators import NationalID, PhoneNumber, PostalCode
from shared.validators import VerificationCode

router = APIRouter(
    prefix='/auth',
    tags=['auth'],
    dependencies=[rate_limit('auth', 30 * 60, 20, False)]
)


class RegisterResponse(BaseModel):
    user_id: int
    token: str


class RegisterBody(BaseModel):
    phone: PhoneNumber
    code: VerificationCode
    first_name: str
    last_name: str
    birth_date: conlist(int, max_length=3, min_length=3)
    national_id: NationalID
    postal_code: PostalCode
    address: constr(strip_whitespace=True, max_length=2048)
    email: EmailStr

    class Config:
        json_schema_extra = {'example': {
            'phone': '09223334444',
            'code': '99999',
            'first_name': 'Harold',
            'last_name': 'Krabs',
            'birth_date': [1369, 7, 7],
            'national_id': '1234567890',
            'postal_code': '1234567890',
            'address': 'krusty krabs',
            'email': 'mr.krabs@gmail.com'
        }}

    @validator('birth_date')
    def v_birth_date(cls, value):
        try:
            date = jdate(*value)
        except Exception:
            raise ValueError('invalid birth date')

        year = jdatetime.now().year

        if date.year > year - 18:
            raise ValueError('too young')

        if date.year < year - 150:
            raise ValueError('too old')

        return value


@router.post(
    '/register/', response_model=RegisterResponse,
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


class LoginBody(BaseModel):
    phone: PhoneNumber
    code: VerificationCode


class LoginResponse(BaseModel):
    user: UserModel
    token: str


@router.post(
    '/login/', response_model=LoginResponse,
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
    user.token = token_hash[:32]

    token = f'{user.user_id}:{token}'
    response.set_cookie(
        key='Authorization',
        value=f'Bearer {token}',
        secure=True,
        samesite='strict'
    )

    return {
        'user': user,
        'token': token,
    }
