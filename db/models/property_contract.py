
from enum import Enum

from pydantic import BaseModel
from sqlalchemy import JSON, Column, ForeignKey, Integer, String

from .common import BaseTable
from .user import UserTable


class PropertyContractTable(BaseTable):
    __tablename__ = 'property_contracts'

    ps_id = Column(
        Integer, primary_key=True,
        index=True, autoincrement=True
    )
    creator = Column(
        'user_id', Integer,
        ForeignKey(UserTable.user_id, ondelete='CASCADE'),
        nullable=False, index=True
    )
    stage = Column(String, nullable=False, server_default='draft')
    seller = Column(Integer, index=True)
    buyer = Column(Integer, index=True)
    data = Column(JSON, nullable=False, server_default='{}')


class ContractStage(str, Enum):
    DRAFT = 'draft'
    ACTION = 'action'
    DONE = 'done'


class BQuestion(BaseModel):
    question: str
    display: tuple[str, str]
    answer: bool


class PropertyContractData(BaseModel):
    stake: int
    main_plate: str
    sub_plate: str
    register_section: str
    city: str
    postal_code: str
    address: str
    latitude: float
    longitude: float
    ownership_status: list[BQuestion]
    documents_status: list[BQuestion]
    records: list[int]


class PropertyContractModel(BaseModel):
    ps_id: int
    creator: int
    stage: ContractStage
    seller: int | None = None
    buyer: int | None = None
    data: PropertyContractData
