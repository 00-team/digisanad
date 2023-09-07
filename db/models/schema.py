

from enum import Enum

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
    description = Column(String, nullable=False, server_default='')
    data = Column(JSON, nullable=False, server_default='{}')
    creator = Column(Integer, nullable=False, server_default=text('-1'))


class SchemaPage(BaseModel, extra=Extra.allow):
    content: str


class FieldType(str, Enum):
    GEO = 'geo'
    INT = 'int'
    STR = 'str'
    DATE = 'date'
    USER = 'user'
    TEXT = 'text'
    LINK = 'link'
    PRICE = 'price'
    RECORD = 'record'
    OPTION = 'option'
    QUESTION = 'question'
    SIGNATURE = 'signature'


class SchemaField(BaseModel, extra=Extra.allow):
    uid: str
    type: FieldType
    optional: bool = False
    lock: bool = False
    changers: list[str]


class SchemaData(BaseModel, extra=Extra.allow):
    pages: list[SchemaPage]
    fields: dict[str, SchemaField]


class SchemaModel(BaseModel):
    schema_id: int
    draft: bool
    title: str
    description: str = ''
    data: SchemaData
    creator: int
