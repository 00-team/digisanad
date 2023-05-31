from pydantic import BaseModel, EmailStr, conlist, constr, validator

from db.models import UserModel
from shared.jdate import jdate, jdatetime
from shared.validators import NationalID, PhoneNumber, PostalCode
from shared.validators import VerificationCode


class LoginBody(BaseModel):
    phone: PhoneNumber
    code: VerificationCode


class LoginResponse(BaseModel):
    user: UserModel
    token: str


class RegisterBody(LoginBody):
    first_name: str
    last_name: str
    birth_date: conlist(int, max_items=3, min_items=3)
    national_id: NationalID
    postal_code: PostalCode
    address: constr(strip_whitespace=True, max_length=2048)
    email: EmailStr

    class Config:
        schema_extra = {'example': {
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


class RegisterResponse(BaseModel):
    user_id: int
    token: str
