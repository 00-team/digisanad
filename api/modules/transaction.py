
import logging
from typing import Literal

from fastapi import APIRouter, Request
from pydantic import BaseModel

from db.general import general_get, general_update
from db.models import NetworkType, TransactionModel, TransactionStatus
from db.models import TransactionTable, UserModel, UserTable, WalletTable
from db.transaction import transaction_get, transaction_update
from db.wallet import wallet_get, wallet_update
from deps import rate_limit, user_required
from shared import settings, sqlx
from shared.crypto import transaction_status
from shared.errors import bad_id
from shared.tools import utc_now

router = APIRouter(
    prefix='/transactions',
    tags=['transactions'],
    dependencies=[user_required(), rate_limit('transactions', 60, 120)]
)


class TransactionUser(BaseModel):
    user_id: int
    first_name: str
    last_name: str


class TransactionResponse(BaseModel):
    transaction_id: int
    transaction_hash: str | None = None
    network: NetworkType
    coin_name: str
    sender: TransactionUser | Literal['system'] | None
    receiver: TransactionUser | Literal['system'] | None
    amount: int
    fee: int
    status: TransactionStatus
    next_update: int
    timestamp: int


async def check_transaction(ta: TransactionModel) -> TransactionModel:
    if not ta.transaction_hash or ta.status != TransactionStatus.UNKNOWN:
        return ta

    if ta.next_update > 1:
        return ta

    status = await transaction_status(ta.transaction_hash)

    await transaction_update(
        TransactionTable.transaction_id == ta.transaction_id,
        status=status,
        last_update=utc_now(),
    )

    if status == ta.status or ta.status == TransactionStatus.SUCCESS:
        return ta

    coinkey = f'{ta.network.value}_{ta.coin_name}'
    general = await general_get()

    if ta.sender == ta.receiver:
        logging.warn(f'invalid transaction: {ta.transaction_id}')
        return ta

    if ta.sender == -1:
        # from system to user
        wallet = await wallet_get(WalletTable.user_id == ta.sender)

        wallet.coins[coinkey].in_system += ta.amount

        general.coins[coinkey].available -= ta.fee
        general.coins[coinkey].total += ta.amount

        await general_update(coins=general.coins)
        await wallet_update(
            WalletTable.wallet_id == wallet.wallet_id,
            coins=wallet.coins
        )

    elif ta.receiver == -1:
        # from user to system
        wallet = await wallet_get(WalletTable.user_id == ta.sender)

        wallet.coins[coinkey].in_system -= ta.amount - settings.eth_main_fee
        wallet.coins[coinkey].in_wallet += ta.amount

        general.coins[coinkey].total -= ta.amount
        general.coins[coinkey].available -= ta.fee

        await general_update(coins=general.coins)
        await wallet_update(
            WalletTable.wallet_id == wallet.wallet_id,
            coins=wallet.coins
        )
    else:
        # from user to another user
        logging.warn(
            f'invalid state of transaction: {ta.transaction_id}'
        )


async def transaction_to_response(
    ta_list: list[TransactionModel]
) -> list[TransactionResponse]:
    if not ta_list:
        return []

    user_ids = set()
    users_dict = {
        -1: 'system'
    }

    for ta in ta_list:
        ta = await check_transaction(ta)

        if ta.sender != -1:
            user_ids.add(ta.sender)

        if ta.receiver != -1:
            user_ids.add(ta.receiver)

    if user_ids:
        users = await sqlx.fetch_all(
            f'''
            SELECT user_id, first_name, last_name
            FROM {UserTable.__tablename__}
            WHERE user_id IN :user_ids
            ''',
            {'user_ids': '(' + ','.join((str(i) for i in user_ids)) + ')'}
        )
        users_dict = {
            u[0]: TransactionUser(**u) for u in users
        }

    result = []

    for ta in ta_list:
        result.append(TransactionResponse(
            transaction_id=ta.transaction_id,
            transaction_hash=ta.transaction_hash,
            network=ta.network,
            coin_name=ta.coin_name,
            sender=users_dict.get(ta.sender),
            receiver=users_dict.get(ta.receiver),
            amount=ta.amount,
            fee=ta.fee,
            status=ta.status,
            next_update=ta.next_update,
            timestamp=ta.timestamp,
        ))

    return result


@router.get('/', response_model=list[TransactionResponse])
async def get_transactions(request: Request, page: int = 0):
    user: UserModel = request.state.user
    rows = await sqlx.fetch_all(
        f'''
        SELECT * FROM {TransactionTable.__tablename__}
        WHERE (sender == :user_id OR receiver == :user_id)
        LIMIT {settings.page_size} OFFSET {page * settings.page_size}
        ''',
        {'user_id': user.user_id}
    )
    return await transaction_to_response([TransactionModel(**r) for r in rows])


@router.get(
    '/{transaction_id}/',
    response_model=TransactionResponse,
    openapi_extra={'errors': [bad_id]}
)
async def get_transaction(request: Request, transaction_id: int):
    user: UserModel = request.state.user
    ta = await transaction_get(
        TransactionTable.transaction_id == transaction_id,
        TransactionTable.user_id == user.user_id
    )

    if ta is None:
        raise bad_id('Transaction', transaction_id, id=transaction_id)

    return (await transaction_to_response([ta]))[0]
