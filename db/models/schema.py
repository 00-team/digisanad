
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field, constr
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


class SchemaModel(BaseModel):
    schema_id: int
    draft: bool
    title: str
    description: str | None = None
    data: dict
