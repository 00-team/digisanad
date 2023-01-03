from pydantic import BaseModel


class Paginator(BaseModel):
    page: int
