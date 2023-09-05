
import logging
from typing import ClassVar

from fastapi import APIRouter, Request
from pydantic import BaseModel, conint, constr

from db.general import general_get, general_update
from db.models import TransactionStatus, UserModel, UserTable
from db.transaction import transaction_add
from db.user import user_update
from deps import rate_limit, user_required
from shared import ETH_ACC, settings, w3
from shared.crypto import update_wallet
from shared.errors import bad_args, bad_balance
from shared.models import IDModel
from shared.tools import utc_now

router = APIRouter(
    prefix='/user',
    tags=['user'],
    dependencies=[user_required(), rate_limit('user', 60, 120)]
)


class UserModelNoPK(UserModel):
    w_eth_pk: ClassVar


@router.get('/', response_model=UserModelNoPK)
async def get(request: Request):
    user: UserModel = request.state.user
    user.token = user.token[:32]

    if user.w_next_update < 1:
        user = await update_wallet(user)

    return user


class WithdrawalBody(BaseModel):
    addr: constr(min_length=16, max_length=1024)
    amount: conint(ge=1)


@router.post(
    '/withdrawal/', response_model=IDModel,
    openapi_extra={'errors': [bad_balance, bad_args]}
)
async def withdrawal(request: Request, body: WithdrawalBody):
    user: UserModel = request.state.user

    if not user.w_eth_pk or body.amount > user.w_eth_in_sys:
        raise bad_balance

    balance = user.w_eth_in_sys
    sys_fee = settings.eth_fee
    gas = 21000
    gas_price = await w3.eth.gas_price
    gas_fee = gas * gas_price

    total_fee = gas_fee + sys_fee

    if body.amount + total_fee <= balance:
        value = body.amount
    else:
        value = body.amount - total_fee

    general = await general_get()

    eth_balance = await w3.eth.get_balance(ETH_ACC.address)
    general.eth_total = eth_balance

    if eth_balance < value + total_fee:
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

    user.w_eth_in_sys -= value + total_fee

    general.eth_total -= value + gas_fee
    general.eth_available += sys_fee

    await general_update(
        eth_total=general.eth_total,
        eth_available=general.eth_available
    )
    await user_update(
        UserTable.user_id == user.user_id,
        w_eth_in_sys=user.w_eth_in_sys
    )

    transaction_id = await transaction_add(
        transaction_hash=tx.hex(),
        sender=-1,
        receiver=user.user_id,
        status=TransactionStatus.UNKNOWN,
        amount=value,
        fee=sys_fee,
        last_update=utc_now(),
        timestamp=utc_now(),
    )

    return {
        'id': transaction_id
    }


@router.get('/ether_price/')
async def ether_price(request: Request):
    pass
