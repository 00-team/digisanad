
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
    description: str = Field(
        None, description='optinal description of the field'
    )


class UserField(BaseField):
    type: Literal['user']


class IntField(BaseField):
    type: Literal['int']
    min: int = None
    max: int = None


class StrField(IntField):
    type: Literal['str']


class TextField(IntField):
    type: Literal['text']


class GeoField(BaseField):
    type: Literal['geo']


class RecordField(BaseField):
    type: Literal['record']


class UIDD(BaseModel):
    '''unique id & display'''
    uid: str
    display: str


class QuestionField(BaseField):
    type: Literal['questions']
    answers: list[UIDD]
    questions: list[UIDD]


Field = (
    UserField | IntField | StrField |
    TextField | GeoField | QuestionField | RecordField
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
