
from pydantic import BaseModel
from sqlalchemy import Column, Integer, text

from .common import BaseTable


class GeneralTable(BaseTable):
    __tablename__ = 'general'

    general_id = Column(Integer, primary_key=True)

    usd_irr = Column(Integer, nullable=False, server_default=text('0'))
    usd_irr_lu = Column(Integer, nullable=False, server_default=text('0'))
    eth_usd = Column(Integer, nullable=False, server_default=text('0'))
    eth_usd_lu = Column(Integer, nullable=False, server_default=text('0'))

    eth_total = Column(Integer, nullable=False, server_default=text('0'))
    eth_available = Column(Integer, nullable=False, server_default=text('0'))


class GeneralModel(BaseModel):
    general_id: int

    usd_irr: int
    usd_irr_lu: int
    eth_usd: int
    eth_usd_lu: int

    eth_total: int
    eth_available: int
