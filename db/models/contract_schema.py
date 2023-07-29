
from typing import Literal

from pydantic import BaseModel
from sqlalchemy import JSON, Boolean, Column, Integer, String

from .common import BaseTable


class ContractSchemaTable(BaseTable):
    __tablename__ = 'contract_schemas'

    schema_id = Column(
        Integer, primary_key=True,
        index=True, autoincrement=True
    )
    draft = Column(Boolean, nullable=False, server_default='true')
    title = Column(String, nullable=False)
    description = Column(String)
    schema = Column(JSON, nullable=False, server_default='{}')


class BaseField(BaseModel):
    uid: str
    title: str
    description: str | None = None


class UserField(BaseField):
    type = 'user'
    user_id: int


class IntField(BaseField):
    type: Literal['int'] = 'int'
    min: int | None = None
    max: int | None = None


Field = UserField | IntField


class Stage(BaseField):
    fields: list[Field]


class ContractSchemaData(BaseModel):
    stages: list[Stage]


class ContractSchemaModel(BaseModel):
    schema_id: int
    draft: bool
    title: str
    description: str | None = None
    schema: ContractSchemaData
