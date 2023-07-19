
from pydantic import BaseModel
from sqlalchemy import JSON, Column, ForeignKey, Integer, String, text

from shared import settings
from shared.tools import utc_now

from .common import BaseCoin, BaseTable
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
    last_update = Column(Integer, nullable=False, server_default=text('0'))
    coins = Column(JSON, nullable=False, server_default='{}')


class WalletCoin(BaseCoin):
    in_wallet: int
    in_system: int
    pk: str | None = None
    addr: str | None = None
    contract: str | None = None
    hidden: bool = False


class WalletModel(BaseModel):
    wallet_id: int
    user_id: int
    last_update: int
    coins: dict[str, WalletCoin]

    @property
    def next_update(self) -> int:
        return (self.last_update + settings.update_wallet_timeout) - utc_now()
