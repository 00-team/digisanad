
import json
from sqlite3 import IntegrityError
from typing import ClassVar

from fastapi import APIRouter, Request
from pydantic import BaseModel, constr

from db.contract import contract_add, contract_delete, contract_get
from db.contract import contract_update, contract_user_add
from db.contract import contract_user_delete, contract_user_get
from db.general import general_get, general_update
from db.models import ContractModel, ContractStage, ContractTable
from db.models import ContractUserTable, FieldType, SchemaData
from db.models import TransactionStatus, UserModel, UserPublic, UserTable
from db.transaction import transaction_add
from db.user import user_get, user_public, user_update
from deps import user_required
from shared import settings, sqlx
from shared.errors import bad_args, bad_balance, bad_id, closed_contract
from shared.errors import contract_invalid_changer, contract_invalid_price
from shared.errors import contract_lock_field, contract_new_field, no_change
from shared.models import IDModel, OkModel
from shared.tools import random_string, utc_now

router = APIRouter(
    prefix='/contracts',
    tags=['contract'],
    dependencies=[user_required()]
)


class ContractModelNoData(ContractModel):
    data: ClassVar


@router.get('/', response_model=list[ContractModelNoData])
async def get_contracts(request: Request, page: int = 0):
    user: UserModel = request.state.user

    rows = await sqlx.fetch_all(
        f'''
        SELECT * FROM {ContractUserTable.__tablename__}
        WHERE user = :user_id
        ORDER BY cuid DESC
        LIMIT {settings.page_size} OFFSET :skip
        ''',
        {
            'user_id': user.user_id,
            'skip': page * settings.page_size
        },
    )

    cids = '(' + ','.join((str(r[1]) for r in rows)) + ')'

    rows = await sqlx.fetch_all(f'''
        SELECT * from {ContractTable.__tablename__}
        WHERE contract_id in {cids}
    ''')

    return [ContractModelNoData(**r) for r in rows]


@router.get(
    '/{contract_id}/', response_model=ContractModel,
    openapi_extra={'errors': [bad_id]}
)
async def get(request: Request, contract_id: int):
    user: UserModel = request.state.user

    if not (await contract_user_get(contract_id, user.user_id)):
        raise bad_id('Contract', contract_id, id=contract_id)

    contract = await contract_get(
        ContractTable.contract_id == contract_id,
    )
    if contract is None:
        raise bad_id('Contract', contract_id, id=contract_id)

    return contract


class CreateBody(BaseModel):
    title: constr(max_length=256)
    data: SchemaData


@router.post('/', response_model=IDModel)
async def create(request: Request, body: CreateBody):
    user: UserModel = request.state.user

    contract_id = await contract_add(
        creator=user.user_id,
        stage=ContractStage.DRAFT,
        title=body.title,
        data=dict(body.data),
        start_date=utc_now(),
        finish_date=0,
        pepper=random_string()
    )

    await contract_user_add(contract_id, user.user_id)

    return {'id': contract_id}


async def get_usr_pct(items, user_uids) -> list[tuple[UserModel, int]]:
    if not items:
        raise contract_invalid_price

    output = []

    for item in items:
        if not isinstance(item, list) or len(item) != 2:
            raise contract_invalid_price

        uid, pct = item
        if uid not in user_uids or not isinstance(pct, int):
            raise contract_invalid_price

        user = await user_get(UserTable.user_id == user_uids[uid])
        if user is None:
            raise contract_invalid_price

        output.append([user, pct])

    if sum(p for _, p in output) != 100:
        raise contract_invalid_price

    return output


@router.patch(
    '/{contract_id}/sign/', response_model=OkModel,
    openapi_extra={'errors': [bad_id, closed_contract]}
)
async def sign(request: Request, contract_id: int):
    user: UserModel = request.state.user

    contract = await contract_get(
        ContractTable.contract_id == contract_id,
        ContractTable.creator == user.user_id
    )
    if contract is None:
        raise bad_id('Contract', contract_id, id=contract_id)

    if contract.stage != ContractStage.DRAFT:
        raise closed_contract

    if not contract.data:
        await contract_update(
            ContractTable.contract_id == contract_id,
            stage=ContractStage.DONE,
            finish_date=utc_now(),
            disable_invites=True
        )
        return {'ok': True}

    uid_user_id = {}

    for uid, field in contract.data.fields.items():
        if field.type == FieldType.USER:
            uid_user_id[uid] = field.value

    general = await general_get()
    movements = []

    for uid, field in contract.data.fields.items():
        if field.type == FieldType.PRICE:
            if not field.senders and not field.receivers:
                continue

            price = field.value
            xprice = price / 100
            senders = await get_usr_pct(field.senders, uid_user_id)
            receivers = await get_usr_pct(field.receivers, uid_user_id)

            for sender, pct in senders:
                amount = xprice * pct
                if sender.w_eth_in_sys < amount + settings.eth_fee:
                    raise bad_balance

            movements.append((xprice, senders, receivers))

    for xprice, senders, receivers in movements:
        for sender, pct in senders:
            amount = xprice * pct

            general.eth_available += settings.eth_fee
            sender.w_eth_in_sys -= amount + settings.eth_fee

            await user_update(
                UserTable.user_id == sender.user_id,
                w_eth_in_sys=sender.w_eth_in_sys
            )
            await general_update(eth_available=general.eth_available)
            await transaction_add(
                sender=sender.user_id,
                receiver=-2,
                contract=contract_id,
                status=TransactionStatus.SUCCESS,
                amount=amount,
                fee=settings.eth_fee,
                last_update=utc_now(),
                timestamp=utc_now(),
            )

        for receiver, pct in receivers:
            amount = xprice * pct
            receiver.w_eth_in_sys += amount

            await user_update(
                UserTable.user_id == receiver.user_id,
                w_eth_in_sys=receiver.w_eth_in_sys
            )
            await transaction_add(
                sender=-2,
                receiver=receiver.user_id,
                contract=contract_id,
                status=TransactionStatus.SUCCESS,
                amount=amount,
                fee=0,
                last_update=utc_now(),
                timestamp=utc_now(),
            )

    await contract_update(
        ContractTable.contract_id == contract_id,
        stage=ContractStage.DONE,
        finish_date=utc_now(),
        disable_invites=True
    )
    return {'ok': True}


class UpdateBody(BaseModel):
    title: str = None
    data: SchemaData = None
    disable_invites: bool = None


def jdump(data):
    if isinstance(data, BaseModel):
        data = dict(data)
    return json.dumps(data)


def check_schema(
    before: SchemaData, after: SchemaData,
    changer: int, creator: int
):
    if not before.fields or not before.pages:
        return

    uid_user_id = {}

    for uid, new in after.fields.items():
        if new.type == FieldType.USER:
            uid_user_id[uid] = new.value

    for uid, new in after.fields.items():
        old = before.fields.get(uid)
        if old is None or old.type != new.type:
            raise contract_new_field

        if jdump(old.changers) != jdump(new.changers):
            raise contract_invalid_changer

        if jdump(old) != jdump(new):
            if old.lock:
                raise contract_lock_field

            if old.type == FieldType.USER and changer != creator:
                raise contract_invalid_changer

            if old.changers:
                for cuid in old.changers:
                    if uid_user_id[cuid] == changer:
                        break
                else:
                    raise contract_invalid_changer


@router.patch(
    '/{contract_id}/', response_model=OkModel,
    openapi_extra={'errors': [
        bad_id, no_change, contract_new_field,
        contract_lock_field, contract_invalid_changer,
    ]}
)
async def update(request: Request, contract_id: int, body: UpdateBody):
    user: UserModel = request.state.user
    patch = body.model_dump(exclude_defaults=True)

    if not (await contract_user_get(contract_id, user.user_id)):
        raise bad_id('Contract', contract_id, id=contract_id)

    contract = await contract_get(
        ContractTable.contract_id == contract_id
    )
    if contract is None:
        raise bad_id('Contract', contract_id, id=contract_id)

    if contract.stage != ContractStage.DRAFT:
        raise closed_contract

    if body.data:
        check_schema(
            contract.data, body.data,
            user.user_id, contract.creator
        )

    if not patch:
        raise no_change

    await contract_update(
        ContractTable.contract_id == contract_id,
        **patch
    )

    return {'ok': True}


@router.get(
    '/{contract_id}/parties/', response_model=list[UserPublic],
    openapi_extra={'errors': [bad_id]}
)
async def contract_parties(request: Request, contract_id: int):
    user: UserModel = request.state.user

    contract = await contract_get(ContractTable.contract_id == contract_id)
    if contract is None:
        raise bad_id('Contract', contract_id, id=contract_id)

    rows = await sqlx.fetch_all(
        f'''
        SELECT * FROM {ContractUserTable.__tablename__}
        WHERE contract = :contract_id
        ''',
        {'contract_id': contract_id},
    )

    user_ids = set((r[2] for r in rows))
    if contract.creator != user.user_id and user.user_id not in user_ids:
        raise bad_id('Contract', contract_id, id=contract_id)

    users = await user_public(user_ids)
    users.pop(-1, None)
    users.pop(-2, None)

    return list(users.values())


async def contract_join(user_id: int, id_pepper: str) -> bool:
    if id_pepper.find(':') == -1:
        return False

    contract_id, pepper = id_pepper.split(':')

    try:
        contract_id = int(contract_id)
    except Exception:
        return False

    contract = await contract_get(
        ContractTable.contract_id == contract_id,
        ContractTable.pepper == pepper,
    )
    if contract is None:
        return False

    if contract.disable_invites or contract.stage != ContractStage.DRAFT:
        return False

    try:
        await contract_user_add(contract_id, user_id)
        return True
    except IntegrityError:
        return False


@router.get('/{contract_id}/join/{pepper}/', response_model=OkModel)
async def join(request: Request, contract_id: int, pepper: str):
    user: UserModel = request.state.user

    return {
        'ok': await contract_join(user.user_id, f'{contract_id}:{pepper}')
    }


@router.delete(
    '/{contract_id}/remove/{user_id}/', response_model=OkModel,
    openapi_extra={'errors': [bad_id, closed_contract, bad_args]}
)
async def remove_user(request: Request, contract_id: int, user_id: int):
    user: UserModel = request.state.user

    if user.user_id == user_id:
        raise bad_args

    contract = await contract_get(
        ContractTable.contract_id == contract_id,
        ContractTable.creator == user.user_id
    )
    if contract is None:
        raise bad_id('Contract', contract_id, id=contract_id)

    if contract.stage != ContractStage.DRAFT:
        raise closed_contract

    return {
        'ok': bool(await contract_user_delete(
            ContractUserTable.contract == contract_id,
            ContractUserTable.user == user_id,
        ))
    }


@router.get(
    '/{contract_id}/exit/', response_model=OkModel,
    openapi_extra={'errors': [bad_id, bad_args]}
)
async def exit(request: Request, contract_id: int):
    user: UserModel = request.state.user

    if not (await contract_user_get(contract_id, user.user_id)):
        raise bad_id('Contract', contract_id, id=contract_id)

    contract = await contract_get(
        ContractTable.contract_id == contract_id
    )
    if contract.creator == user.user_id:
        raise bad_args

    if contract.stage != ContractStage.DRAFT:
        raise closed_contract

    return {
        'ok': bool(await contract_user_delete(
            ContractUserTable.contract == contract_id,
            ContractUserTable.user == user.user_id,
        ))
    }


@router.delete(
    '/{contract_id}/', response_model=OkModel,
    openapi_extra={'errors': [bad_id, closed_contract]}
)
async def delete(request: Request, contract_id: int):
    user: UserModel = request.state.user

    contract = await contract_get(
        ContractTable.contract_id == contract_id,
        ContractTable.creator == user.user_id
    )
    if contract is None:
        raise bad_id('Contract', contract_id, id=contract_id)

    if contract.stage != ContractStage.DRAFT:
        raise closed_contract

    return {
        'ok': bool(await contract_delete(
            ContractTable.contract_id == contract_id,
            ContractTable.creator == user.user_id
        ))
    }
