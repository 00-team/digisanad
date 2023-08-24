

from pydantic import BaseModel, Extra
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


class SchemaPage(BaseModel, extra=Extra.allow):
    content: str


class SchemaField(BaseModel, extra=Extra.allow):
    uid: str
    optional: bool = False


class SchemaData(BaseModel, extra=Extra.allow):
    pages: list[SchemaPage]
    fields: dict[str, SchemaField]


class SchemaModel(BaseModel):
    schema_id: int
    draft: bool
    title: str
    description: str | None = None
    data: SchemaData
    creator: int
