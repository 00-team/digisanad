

import json

from fastapi import APIRouter, Request

from db.models import SchemaModel, UserModel
from deps import user_required
from shared import settings, sqlx

router = APIRouter(
    prefix='/schemas',
    tags=['schema'],
    dependencies=[user_required()]
)


@router.get('/', response_model=list[SchemaModel])
async def get_schemas(request: Request, page: int = 0, mine: bool = False):
    user: UserModel = request.state.user
    if mine:
        creator = user.user_id
    else:
        creator = -1

    rows = await sqlx.fetch_all(
        f'''
        SELECT * FROM schemas WHERE creator = :creator AND draft = false
        ORDER BY schema_id DESC
        LIMIT {settings.page_size} OFFSET :skip
        ''',
        {
            'skip': page * settings.page_size,
            'creator': creator
        }
    )

    result = []
    for row in rows:
        args = row._asdict()
        args['data'] = json.loads(args['data'])
        result.append(SchemaModel(**args))

    return result
