from pydantic import BaseModel

from settings import DEF_USER_PIC_DIR


class UserModel(BaseModel):
    user_id: int
    phone: str
    first_name: str
    last_name: str
    birth_date: tuple[int, int, int]
    national_id: str
    postal_code: str
    address: str
    email: str
    wallet: int

    token: str | None

    def __init__(self, **data) -> None:
        print('user model init')
        super().__init__(**data)


class VerificationModel(BaseModel):
    phone: str
    code: str
    action: str
    expires: int = 0
    tries: int = 0
