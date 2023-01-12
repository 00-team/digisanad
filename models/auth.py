from pydantic import BaseModel, validator

from shared.tools import code_validator, isallnum


class LoginBody(BaseModel):
    phone: str

    @validator('phone')
    def phone_validator(cls, value: str):
        if not value:
            raise ValueError('invalid phone number')

        # only accept IR phones
        if len(value) != 11:
            raise ValueError('invalid phone number length')

        if value[:2] != '09':
            raise ValueError('invalid phone number')

        if not isallnum(value):
            raise ValueError('invalid phone number')

        return value


class LoginResponse(BaseModel):
    timer: int


class VerifyBody(LoginBody):
    code: str

    @validator('code')
    def code_validator(cls, value: str):
        return code_validator(value)


class VerifyResponse(BaseModel):
    created: bool
    user_id: int
    token: str
    wallet: int
    nickname: str | None
    picture: str | None


__all__ = [
    'LoginBody',
    'LoginResponse',
    'VerifyBody'
]
