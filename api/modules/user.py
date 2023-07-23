

from fastapi import APIRouter, Request
from pydantic import BaseModel, constr

from db.models import NetworkType, TransactionModel, TransactionTable
from db.models import UserModel, WalletCoin, WalletTable
from db.transaction import transaction_get
from db.wallet import wallet_add, wallet_get, wallet_update
from deps import rate_limit, user_required
from shared import settings, sqlx
from shared.crypto import update_wallet
from shared.errors import bad_id

router = APIRouter(
    prefix='/user',
    tags=['user'],
    dependencies=[user_required(), rate_limit('user', 60, 120)]
)


@router.get('/', response_model=UserModel)
async def get(request: Request):
    user: UserModel = request.state.user
    user.token = user.token[:32]
    return user


class WalletAddr(BaseModel):
    network: NetworkType
    addr: str


class WalletResponse(BaseModel):
    wallet_id: int
    user_id: int
    next_update: int
    coins: list[WalletCoin]
    addrs: list[WalletAddr]


@router.get('/wallet/', response_model=WalletResponse)
async def wallet(request: Request):
    user: UserModel = request.state.user
    wallet = await wallet_get(WalletTable.user_id == user.user_id)

    if wallet is None or wallet.next_update < 1:
        new_wallet = await update_wallet(wallet)

        if wallet is None:
            new_wallet.user_id = user.user_id
            del new_wallet.wallet_id
            wallet_id = await wallet_add(**new_wallet.dict())
            new_wallet.wallet_id = wallet_id
        else:
            await wallet_update(
                WalletTable.wallet_id == wallet.wallet_id,
                **new_wallet.dict()
            )

        wallet = new_wallet

    return WalletResponse(
        wallet_id=wallet.wallet_id,
        user_id=wallet.user_id,
        next_update=wallet.next_update,
        coins=[c for c in wallet.coins.values()],
        addrs=[
            WalletAddr(network=a.network, addr=a.addr)
            for a in wallet.accounts.values()
        ],
    )


class TransferBody(BaseModel):
    addr: constr(min_length=16, max_length=1024)
    coin_name: str
    coin_network: str


@router.post('/transfer/')
async def transfer(request: Request, body: TransferBody):
    return {'hi': 0}
