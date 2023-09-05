
from enum import Enum, auto

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String

from .common import BaseTable


class CompanyTable(BaseTable):
    __tablename__ = 'companies'

    company_id = Column(
        Integer, primary_key=True, autoincrement=True
    )
    name = Column(String, nullable=False)
    kind = Column(Integer, nullable=False)
    ceo_name = Column(String, nullable=False)
    cob_name = Column(String, nullable=False)
    formation_date = Column(Integer, nullable=False)
    expiration_date = Column(Integer, nullable=False)
    cash_capital = Column(Integer, nullable=False)
    asset_capital = Column(String, nullable=False)
    shares = Column(Integer, nullable=False)
    activity = Column(String, nullable=False)
    net_profit = Column(Integer, nullable=False)
    legal_reserve = Column(Integer, nullable=False)
    address = Column(String, nullable=False)


class CompanyKind(int, Enum):
    PUBLIC_STOCK = auto()
    PRIVATE_STOCK = auto()
    LIMITED_RESPONSIBILITY = auto()
    RELATIVE = auto()
    SOLIDARITY = auto()
    MIXED_STOCK = auto()
    MIXED_NON_STOCK = auto()
    COOPERATIVE_PRODUCTION = auto()


class CompanyModel(BaseModel):
    company_id: int
    name: str
    kind: CompanyKind
    ceo_name: str
    cob_name: str
    formation_date: int
    expiration_date: int
    cash_capital: int
    asset_capital: str
    shares: int
    activity: str
    net_profit: int
    legal_reserve: int
    address: str
