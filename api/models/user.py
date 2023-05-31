
from pydantic import BaseModel

from db.models import WalletModel


class WalletResponse(BaseModel):
    wallet_id: int
    user_id: int
    next_update: int
    eth_addr: str
    eth_balance: int
    eth_tokens: dict
