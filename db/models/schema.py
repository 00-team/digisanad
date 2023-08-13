

from pydantic import BaseModel
from sqlalchemy import JSON, Boolean, Column, Integer, String, text

from .common import BaseTable


class SchemaTable(BaseTable):
    __tablename__ = 'schemas'

    schema_id = Column(
        Integer, primary_key=True,
        index=True, autoincrement=True
    )
    draft = Column(Boolean, nullable=False, server_default='true')
    title = Column(String, nullable=False)
    description = Column(String)
    data = Column(JSON, nullable=False, server_default='{}')
    creator = Column(Integer, nullable=False, server_default=text('-1'))


class SchemaModel(BaseModel):
    schema_id: int
    draft: bool
    title: str
    description: str | None = None
    data: dict
    creator: int
