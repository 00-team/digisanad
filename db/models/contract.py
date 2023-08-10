
from enum import Enum

from pydantic import BaseModel
from sqlalchemy import JSON, Column, ForeignKey, Integer, String

from .common import BaseTable
from .user import UserTable


class ContractTable(BaseTable):
    __tablename__ = 'contracts'

    contract_id = Column(
        Integer, primary_key=True,
        index=True, autoincrement=True
    )
    creator = Column(
        'user_id', Integer,
        ForeignKey(UserTable.user_id, ondelete='CASCADE'),
        nullable=False, index=True
    )
    stage = Column(String, nullable=False, server_default='draft')
    data = Column(JSON, nullable=False, server_default='{}')


class ContractUserTable(BaseTable):
    __tablename__ = 'contract_user'

    cuid = Column(Integer, primary_key=True, autoincrement=True)
    contract = Column(
        Integer,
        ForeignKey(ContractTable.contract_id, ondelete='CASCADE'),
        nullable=False, index=True
    )
    user = Column(
        Integer,
        ForeignKey(UserTable.user_id, ondelete='CASCADE'),
        nullable=False, index=True
    )


class ContractUserModel(BaseModel):
    cuid: int
    contract: int
    user: int


class ContractStage(str, Enum):
    DRAFT = 'draft'
    ACTION = 'action'
    DONE = 'done'


class ContractModel(BaseModel):
    contract_id: int
    creator: int
    stage: ContractStage
    data: dict
