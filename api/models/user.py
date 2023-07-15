
from pydantic import BaseModel

from db.models import CoinModel


class WalletResponse(BaseModel):
    wallet_id: int
    user_id: int
    next_update: int
    coin: list[CoinModel]
