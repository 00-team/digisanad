
from typing import Literal

from fastapi import APIRouter, Request
from pydantic import BaseModel

from db.models import NetworkType, TransactionModel, TransactionStatus
from db.models import TransactionTable, UserTable
from db.transaction import transaction_get, transaction_update
from deps import rate_limit, user_required
from shared import settings, sqlx
from shared.errors import bad_id
from shared.tools import utc_now

router = APIRouter(
    prefix='/transactions',
    tags=['transactions'],
    dependencies=[user_required(), rate_limit('transactions', 60, 120)]
)


class UserModel(BaseModel):
    user_id: int
    first_name: str
    last_name: str


class TransactionResponse(BaseModel):
    transaction_id: int
    transaction_hash: str | None = None
    network: NetworkType
    sender: UserModel | Literal['system']
    receiver: UserModel | Literal['system']
    amount: int
    status: TransactionStatus
    last_update: int
    timestamp: int


@router.get('/transactions/', response_model=list[TransactionModel])
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
    return [TransactionModel(**r) for r in rows]


@router.get(
    '/transactions/{transaction_id}/',
    response_model=TransactionModel,
    openapi_extra={'errors': [bad_id]}
)
async def get_transaction(request: Request, transaction_id: int):
    user: UserModel = request.state.user
    transaction = await transaction_get(
        TransactionTable.transaction_id == transaction_id,
        TransactionTable.user_id == user.user_id
    )

    if transaction is None:
        raise bad_id('Transaction', transaction_id, id=transaction_id)

    return [TransactionModel(**r) for r in rows]
