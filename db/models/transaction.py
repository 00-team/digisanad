
from enum import Enum

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, text

from shared import settings
from shared.tools import utc_now

from .common import BaseTable, NetworkType


class TransactionTable(BaseTable):
    __tablename__ = 'transactions'

    transaction_id = Column(
        Integer, primary_key=True,
        index=True, autoincrement=True
    )
    transaction_hash = Column(String)
    network = Column(Integer, nullable=False)
    coin_name = Column(String, nullable=False)

    sender = Column(
        'sender', Integer,
        nullable=False, index=True, server_default=text('-1')
    )
    receiver = Column(
        'receiver', Integer,
        nullable=False, index=True, server_default=text('-1')
    )
    network = Column(String, nullable=False)
    status = Column(String, nullable=False, server_default=text('unknown'))
    amount = Column(Integer, nullable=False)
    fee = Column(Integer, nullable=False)
    last_update = Column(Integer, nullable=False, server_default=text('0'))
    timestamp = Column(Integer, nullable=False, server_default=text('0'))


class TransactionStatus(str, Enum):
    UNKNOWN = 'unknown'
    SUCCESS = 'success'
    FAILURE = 'failure'


class TransactionModel(BaseModel):
    transaction_id: int
    transaction_hash: str | None = None
    network: NetworkType
    coin_name: str
    sender: int
    receiver: int
    amount: int
    fee: int
    status: TransactionStatus
    last_update: int
    timestamp: int

    @property
    def next_update(self) -> int:
        return (
            (self.last_update + settings.update_transaction_timeout)
            - utc_now()
        )
