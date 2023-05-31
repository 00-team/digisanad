
from pydantic import BaseModel
from sqlalchemy import JSON, Column, ForeignKey, Integer, String

from .common import BaseTable
from .user import UserTable


class WalletTable(BaseTable):
    __tablename__ = 'wallets'

    wallet_id = Column(
        Integer, primary_key=True,
        index=True, autoincrement=True
    )
    user_id = Column(
        'user_id', Integer,
        ForeignKey(UserTable.user_id, ondelete='CASCADE'),
        nullable=False, index=True
    )
    eth_pk = Column(String, nullable=False)
    eth_addr = Column(String, nullable=False)
    eth_tokens = Column(JSON, nullable=False, server_default='{}')


class WalletModel(BaseModel):
    wallet_id: int
    user_id: int
    eth_pk: str
    eth_addr: str
    eth_tokens: dict
