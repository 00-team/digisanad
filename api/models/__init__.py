

from pydantic import BaseModel


class OkModel(BaseModel):
    ok: bool
