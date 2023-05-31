
from pydantic import BaseModel


class WalletResponse(BaseModel):
    wallet_id: int
    user_id: int
    next_update: int
    eth_addr: str
    eth_balance: int
    eth_tokens: dict
