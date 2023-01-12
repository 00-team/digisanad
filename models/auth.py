from pydantic import BaseModel, EmailStr, validator

from shared.jdate import jdate, jdatetime
from shared.tools import code_validator, isallnum


def phone_validator(value: str):
    if not value or len(value) != 11:
        raise ValueError('invalid phone number')

    if value[:2] != '09' or not isallnum(value):
        raise ValueError('invalid phone number')

    return value


class VerifyBody(BaseModel):
    phone: str
    action: str

    @validator('phone')
    def v_phone(cls, value):
        return phone_validator(value)

    @validator('action')
    def v_action(cls, value: str):
        value = value.upper()

        if not value in ['LOGIN', 'REGISTER']:
            raise ValueError('invalid action')

        return value


class VerifyResponse(BaseModel):
    timer: int


class LoginBody(BaseModel):
    phone: str
    code: str

    @validator('code')
    def v_code(cls, value):
        return code_validator(value)

    @validator('phone')
    def v_phone(cls, value):
        return phone_validator(value)


class RegisterBody(LoginBody):
    first_name: str
    last_name: str
    birth_date: tuple[int, int, int]
    national_id: str
    postal_code: str
    address: str
    email: EmailStr

    @validator('national_id')
    def v_national_id(cls, value):
        if not value or len(value) != 10 or not isallnum(value):
            raise ValueError('invalid national id')

        return value

    @validator('postal_code')
    def v_postal_code(cls, value):
        if not value or len(value) != 10 or not isallnum(value):
            raise ValueError('invalid postal code')

        return value

    @validator('address')
    def v_address(cls, value):
        if len(value) > 1024:
            raise ValueError('address is too long')

        return value

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


class AuthResponse(BaseModel):
    user_id: int
    token: str
