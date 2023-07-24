
import logging

from fastapi import APIRouter, Request
from pydantic import BaseModel, constr

from db.general import general_get, general_update
from db.models import NetworkType, TransactionStatus, UserModel, WalletCoin
from db.models import WalletTable
from db.transaction import transaction_add
from db.wallet import wallet_add, wallet_get, wallet_update
from deps import rate_limit, user_required
from shared import ETH_ACC, settings, w3
from shared.crypto import update_wallet
from shared.errors import bad_args, bad_balance
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


class WithdrawalBody(BaseModel):
    addr: constr(min_length=16, max_length=1024)
    coin_name: str
    network: NetworkType
    amount: int


class WithdrawalResponse(BaseModel):
    transaction_id: int


@router.post(
    '/withdrawal/', response_model=WithdrawalResponse,
    openapi_extra={'errors': [bad_balance, bad_args]}
)
async def withdrawal(request: Request, body: WithdrawalBody):
    user: UserModel = request.state.user
    wallet = await wallet_get(WalletTable.user_id == user.user_id)

    coinkey = f'{body.network.value}_{body.coin_name}'

    if wallet is None or coinkey not in wallet.coins:
        raise bad_balance

    balance = wallet.coins[coinkey].in_system
    sys_fee = settings.eth_fee
    gas = 21000
    gas_price = await w3.eth.gas_price
    gas_fee = gas * gas_price

    total_fee = gas_fee + sys_fee

    if body.amount + total_fee <= balance:
        value = body.amount
    else:
        value = body.amount - total_fee
        if body.amount > balance:
            raise bad_balance

    general = await general_get()
    if coinkey not in general.coins:
        logging.error(f'{coinkey=} is not in general coins')
        raise bad_balance

    # value = body.amount - fee - gas_fee
    # if value < 1:
    #     raise bad_balance
    #
    # if body.amount > balance - fee - gas_fee:
    #     raise bad_balance

    eth_balance = await w3.eth.get_balance(ETH_ACC.address)
    general.coins[coinkey].total = eth_balance

    if eth_balance < value + gas_fee:
        logging.error('not enough money in the system')
        raise bad_balance

    try:
        td = {
            'from': ETH_ACC.address,
            'to': body.addr,
            'value': value,
            'nonce': await w3.eth.get_transaction_count(ETH_ACC.address),
            'gas': gas,
            'gasPrice': gas_price,
        }
        st = ETH_ACC.sign_transaction(td)
        tx = await w3.eth.send_raw_transaction(st.rawTransaction)
    except TypeError:
        raise bad_args

    wallet.coins[coinkey].in_system -= value + total_fee

    general.coins[coinkey].total -= value + gas_fee
    general.coins[coinkey].available += sys_fee

    await general_update(coins=general.coins)
    await wallet_update(
        WalletTable.wallet_id == wallet.wallet_id,
        coins=wallet.coins
    )

    transaction_id = await transaction_add(
        transaction_hash=tx.hex(),
        network=NetworkType.ethereum,
        coin_name='eth',
        sender=-1,
        receiver=wallet.user_id,
        status=TransactionStatus.UNKNOWN,
        amount=value + sys_fee,
        fee=sys_fee,
        last_update=utc_now(),
        timestamp=utc_now(),
    )

    return {
        'transaction_id': transaction_id
    }
