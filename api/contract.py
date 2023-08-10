
import json
from typing import Literal

from fastapi import APIRouter, Request
from pydantic import BaseModel

from db.models import ContractModel, ContractTable, ContractUserModel
from db.models import ContractUserTable, UserModel, UserPublic
from db.user import user_public
from deps import user_required
from shared import settings, sqlx
from shared.errors import bad_id

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
