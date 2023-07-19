
from pydantic import BaseModel
from sqlalchemy import JSON, Column, Integer

from .common import BaseCoin, BaseTable


class GeneralTable(BaseTable):
    __tablename__ = 'general'

    general_id = Column(Integer, primary_key=True, autoincrement=True)
    coin = Column(JSON, nullable=False, server_default='[]')


class GeneralCoin(BaseCoin):
    available: int
    total: int


class GeneralModel(BaseModel):
    general_id: int
    coin: list[GeneralCoin]
