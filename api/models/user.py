from pydantic import BaseModel, validator

from shared.tools import code_validator


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
