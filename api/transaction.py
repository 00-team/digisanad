
import logging
from typing import Literal

from fastapi import APIRouter, Request
from pydantic import BaseModel
from sqlalchemy import or_, select

from db.general import general_get, general_update
from db.models import TransactionModel, TransactionStatus, TransactionTable
from db.models import UserModel, UserPublic, UserTable
from db.transaction import transaction_get, transaction_update
from db.user import user_get, user_public, user_update
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


SR = UserPublic | Literal['system'] | Literal['contract'] | None


class TransactionResponse(BaseModel):
    transaction_id: int
    transaction_hash: str | None = None
    sender: SR
    receiver: SR
    amount: int | float
    fee: int | float
    status: TransactionStatus
    next_update: int
    timestamp: int


async def check_transaction(ta: TransactionModel) -> TransactionModel:
    if not ta.transaction_hash or ta.status != TransactionStatus.UNKNOWN:
        return ta

    if ta.next_update > 1:
        return ta

    if ta.sender == ta.receiver:
        logging.warn(f'invalid transaction: {ta.transaction_id}')
        return ta

    status = await transaction_status(ta.transaction_hash)
    ta.status = status

    await transaction_update(
        TransactionTable.transaction_id == ta.transaction_id,
        status=status,
        last_update=utc_now(),
    )

    if ta.status != TransactionStatus.FAILURE:
        return ta

    general = await general_get()

    if ta.sender == -1:
        # from system to user
        # withdraw
        receiver = await user_get(UserTable.user_id == ta.receiver)
        receiver.w_eth_in_sys += ta.amount + ta.fee

        general.eth_available -= ta.fee
        general.eth_total += ta.amount

        await general_update(
            eth_available=general.eth_available,
            eth_total=general.eth_total
        )

        await user_update(
            UserTable.user_id == receiver.user_id,
            w_eth_in_sys=receiver.w_eth_in_sys
        )

    elif ta.receiver == -1:
        # from user to system

        sender = await user_get(UserTable.user_id == ta.sender)
        sender.w_eth_in_sys -= ta.amount - ta.fee
        sender.w_eth_in_acc += ta.amount

        general.eth_total -= ta.amount
        general.eth_available -= ta.fee

        await general_update(
            eth_available=general.eth_available,
            eth_total=general.eth_total
        )
        await user_update(
            UserTable.user_id == receiver.user_id,
            w_eth_in_sys=receiver.w_eth_in_sys,
            w_eth_in_acc=receiver.w_eth_in_acc
        )
    else:
        # from user to another user
        # user to user transactions dont have any tx hash
        logging.warn(
            f'invalid state of transaction: {ta.transaction_id}'
        )


async def transaction_to_response(
    ta_list: list[TransactionModel]
) -> list[TransactionResponse]:
    if not ta_list:
        return []

    user_ids = set()

    for ta in ta_list:
        ta = await check_transaction(ta)

        if ta.sender != -1:
            user_ids.add(ta.sender)

        if ta.receiver != -1:
            user_ids.add(ta.receiver)

    users = await user_public(user_ids)
    result = []
    for ta in ta_list:
        result.append(TransactionResponse(
            transaction_id=ta.transaction_id,
            transaction_hash=ta.transaction_hash,
            sender=users.get(ta.sender),
            receiver=users.get(ta.receiver),
            amount=ta.amount,
            fee=ta.fee,
            status=ta.status,
            next_update=ta.next_update,
            timestamp=ta.timestamp,
        ))

    return result


@router.get('/global/', response_model=list[TransactionResponse])
async def global_transactions(request: Request, page: int = 0):
    query = (
        select(TransactionTable)
        .order_by(TransactionTable.transaction_id.desc())
        .limit(settings.page_size)
        .offset(page * settings.page_size)
    )
    rows = await sqlx.fetch_all(query)
    return await transaction_to_response(
        [TransactionModel(**r) for r in rows]
    )


@router.get('/', response_model=list[TransactionResponse])
async def get_transactions(request: Request, page: int = 0):
    user: UserModel = request.state.user
    query = (
        select(TransactionTable)
        .where(or_(
            TransactionTable.sender == user.user_id,
            TransactionTable.receiver == user.user_id
        ))
        .order_by(TransactionTable.transaction_id.desc())
        .limit(settings.page_size)
        .offset(page * settings.page_size)
    )

    rows = await sqlx.fetch_all(query)

    return await transaction_to_response(
        [TransactionModel(**r) for r in rows]
    )


@router.get(
    '/{transaction_id}/',
    response_model=TransactionResponse,
    openapi_extra={'errors': [bad_id]}
)
async def get_transaction(request: Request, transaction_id: int):
    ta = await transaction_get(
        TransactionTable.transaction_id == transaction_id,
    )

    if ta is None:
        raise bad_id('Transaction', transaction_id, id=transaction_id)

    return (await transaction_to_response([ta]))[0]
