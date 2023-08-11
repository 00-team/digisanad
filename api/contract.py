
import json
from sqlite3 import IntegrityError

from fastapi import APIRouter, Request
from pydantic import BaseModel

from db.contract import contract_add, contract_get, contract_user_add
from db.contract import contract_user_delete, contract_user_get
from db.models import ContractModel, ContractStage, ContractTable
from db.models import ContractUserTable, UserModel, UserPublic
from db.user import user_public
from deps import user_required
from shared import settings, sqlx
from shared.errors import bad_id
from shared.models import IDModel, OkModel
from shared.tools import random_string, utc_now

router = APIRouter(
    prefix='/contracts',
    tags=['contract'],
    dependencies=[user_required()]
)


@router.get('/', response_model=list[ContractModel])
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

    result = []
    for row in rows:
        args = row._asdict()
        args['data'] = json.loads(args['data'])
        result.append(ContractModel(**args))

    return result


class CreateBody(BaseModel):
    data: dict


@router.post('/', response_model=IDModel)
async def create(request: Request, body: CreateBody):
    user: UserModel = request.state.user

    contract_id = await contract_add(
        creator=user.user_id,
        stage=ContractStage.DRAFT,
        data=body.data,
        start_date=utc_now(),
        finish_date=0,
        pepper=random_string()
    )

    await contract_user_add(contract_id, user.user_id)

    return {'id': contract_id}


@router.get(
    '/{contract_id}/parties/', response_model=list[UserPublic],
    openapi_extra={'errors': [bad_id]}
)
async def contract_parties(request: Request, contract_id: int):
    user: UserModel = request.state.user

    contract = await contract_get(ContractTable.contract_id == contract_id)
    if contract is None:
        raise bad_id('Contract', contract_id, id=contract_id)

    if contract.creator != user.user_id:
        if not (await contract_user_get(contract_id, user.user_id)):
            raise bad_id('Contract', contract_id, id=contract_id)

    rows = await sqlx.fetch_all(
        f'''
        SELECT * FROM {ContractUserTable.__tablename__}
        WHERE contract = :contract_id
        ''',
        {'contract_id': contract_id},
    )

    user_ids = set((r[2] for r in rows))
    users = await user_public(user_ids)
    users.pop(-1, None)

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

    if contract.disable_invites:
        return False

    try:
        await contract_user_add(contract_id, user_id)
        return True
    except IntegrityError:
        return False


@router.get(
    '/join/{id_pepper}/', response_model=OkModel,
    openapi_extra={'errors': [bad_id]}
)
async def join_contract(request: Request, id_pepper: str):
    user: UserModel = request.state.user

    return {'ok': await contract_join(user.user_id, id_pepper)}
