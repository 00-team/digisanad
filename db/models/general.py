
from pydantic import BaseModel
from sqlalchemy import Column, Integer, text

from shared import settings
from shared.tools import utc_now

from .common import BaseTable


class GeneralTable(BaseTable):
    __tablename__ = 'general'

    general_id = Column(Integer, primary_key=True)

    usd_irr = Column(Integer, nullable=False, server_default=text('0'))
    eth_usd = Column(Integer, nullable=False, server_default=text('0'))
    last_update = Column(Integer, nullable=False, server_default=text('0'))

    eth_total = Column(Integer, nullable=False, server_default=text('0'))
    eth_available = Column(Integer, nullable=False, server_default=text('0'))


class GeneralModel(BaseModel):
    general_id: int

    usd_irr: int | float
    eth_usd: int | float
    last_update: int

    eth_total: int | float
    eth_available: int | float

    @property
    def next_update(self) -> int:
        return (
            self.last_update + settings.update_price_timeout
        ) - utc_now()
