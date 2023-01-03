from pydantic import BaseModel, validator

from utils import code_validator


class UpdateResponse(BaseModel):
    user_id: int
    nickname: str | None
    picture: str | None


class DeleteResponse(BaseModel):
    timer: int


class DeleteVerifyBody(BaseModel):
    code: str

    @validator('code')
    def code_validator(cls, value: str):
        return code_validator(value)


class DeleteVerifyResponse(BaseModel):
    ok: bool
    datetime: int
