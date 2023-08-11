
from enum import Enum

from pydantic import BaseModel
from sqlalchemy import JSON, Boolean, Column, ForeignKey, Integer, String
from sqlalchemy import UniqueConstraint, text

from .common import BaseTable
from .user import UserTable


class ContractTable(BaseTable):
    __tablename__ = 'contracts'

    contract_id = Column(
        Integer, primary_key=True,
        index=True, autoincrement=True
    )
    creator = Column(
        Integer,
        ForeignKey(UserTable.user_id, ondelete='CASCADE'),
        nullable=False, index=True
    )
    stage = Column(String, nullable=False, server_default='draft')
    data = Column(JSON, nullable=False, server_default='{}')
    start_date = Column(Integer, nullable=False, server_default=text('0'))
    finish_date = Column(Integer, nullable=False, server_default=text('0'))
    pepper = Column(String, nullable=False)
    disable_invites = Column(
        Boolean,
        nullable=False,
        server_default=text('false')
    )


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
    key = UniqueConstraint('contract', 'user')


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
    start_date: int
    finish_date: int
    pepper: str
    disable_invites: bool
