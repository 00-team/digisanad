from pydantic import BaseModel


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

    def __init__(self, birth_date, **data) -> None:
        if isinstance(birth_date, str):
            birth_date = tuple(map(lambda d: int(d), birth_date.split('-')))
        super().__init__(birth_date=birth_date, **data)


class VerificationModel(BaseModel):
    phone: str
    code: str
    action: str
    expires: int = 0
    tries: int = 0
