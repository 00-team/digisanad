
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field
from sqlalchemy import JSON, Boolean, Column, Integer, String

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


class BaseField(BaseModel):
    uid: str = Field(title='unique id', description='unique id of the field')
    title: str
    description: str | None = Field(
        None, description='optinal description of the field'
    )
    optinal: bool = False


class FieldTypes(str, Enum):
    USER = 'user'
    GEO = 'geo'
    RECORD = 'record'
    DATE = 'date'
    SIGNATURE = 'signature'


class GenericField(BaseField):
    type: FieldTypes


class IntField(BaseField):
    type: Literal['int']
    min: int | None = None
    max: int | None = None


class StrField(IntField):
    type: Literal['str']


class TextField(IntField):
    type: Literal['text']


class UIDD(BaseModel):
    '''unique id & display'''
    uid: str
    display: str


class QuestionField(BaseField):
    type: Literal['question']
    answers: list[UIDD]
    questions: list[UIDD]


class OptionFeild(BaseField):
    type: Literal['option']
    singleton: bool = False
    options: list[UIDD]


Field = (
    GenericField | IntField | StrField | OptionFeild |
    TextField | QuestionField
)


class Stage(BaseField):
    fields: list[Field]


class SchemaData(BaseModel):
    stages: list[Stage]


class SchemaModel(BaseModel):
    schema_id: int
    draft: bool
    title: str
    description: str | None = None
    data: SchemaData
