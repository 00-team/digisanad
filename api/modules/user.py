
from datetime import timedelta

from fastapi import APIRouter, Request

from api.models.user import WalletResponse
from db.models import UserModel, WalletTable
from db.wallet import wallet_add, wallet_get, wallet_update
from deps import rate_limit, user_required
from shared.crypto import update_wallet
from shared.tools import utc_now

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

    response = wallet.dict()
    response['next_update'] = wallet.next_update

    for k, t in response['eth_tokens'].items():
        response['eth_tokens'][k] = str(response['eth_tokens'][k])

    return response
