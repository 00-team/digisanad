
from pydantic import BaseModel
from sqlalchemy import JSON, Column, Integer

from .common import BaseTable


class GeneralTable(BaseTable):
    __tablename__ = 'general'

    general_id = Column(Integer, primary_key=True, autoincrement=True)
    coin = Column(JSON, nullable=False, server_default='[]')


class GeneralCoinModel(BaseModel):
    name: str
    network: str
    display: str
    free: int
    total: int


class GeneralModel(BaseModel):
    general_id: int
    coin: list[GeneralCoinModel]
