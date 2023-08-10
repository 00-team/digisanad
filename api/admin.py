

import json

from fastapi import APIRouter, Request
from pydantic import BaseModel, constr

from db.general import general_get
from db.message import message_add
from db.models import AdminPerms as AP
from db.models import GeneralModel, MessageLevel, SchemaModel, SchemaTable
from db.models import UserModel
from db.schema import schema_add, schema_delete, schema_get, schema_update
from deps import admin_required
from shared import settings, sqlx
from shared.errors import bad_id, no_change
from shared.models import IDModel, OkModel
from shared.tools import utc_now

router = APIRouter(
    prefix='/admins',
    tags=['admins'],
    dependencies=[admin_required()]
)


@router.get('/general/', response_model=GeneralModel)
async def get_general(request: Request):
    user: UserModel = request.state.user
    user.admin_assert(AP.V_GENERAL)

    return await general_get()


class MessageAddBody(BaseModel):
    receiver: int
    text: str
    level: MessageLevel = MessageLevel.INFO


@router.post('/messages/', response_model=IDModel)
async def add_message(request: Request, body: MessageAddBody):
    user: UserModel = request.state.user
    user.admin_assert(AP.A_MESSAGE)

    message_id = await message_add(
        text=body.text,
        receiver=body.receiver,
        timestamp=utc_now(),
        level=body.level
    )

    return {'id': message_id}


@router.get('/schemas/', response_model=list[SchemaModel])
async def get_schemas(request: Request, page: int = 0):
    user: UserModel = request.state.user
    user.admin_assert(AP.V_SCHEMA)

    rows = await sqlx.fetch_all(
        f'''
        SELECT * FROM schemas
        ORDER BY schema_id DESC
        LIMIT {settings.page_size} OFFSET :skip
        ''',
        {
            'skip': page * settings.page_size,
        }
    )

    result = []
    for row in rows:
        args = row._asdict()
        args['data'] = json.loads(args['data'])
        result.append(SchemaModel(**args))

    return result


class SchemaAddBody(BaseModel):
    title: str
    description: str = None
    data: dict

    class Config:
        json_schema_extra = {'example': {
            'title': 'property contract',
            'data': {}
        }}


@router.post('/schemas/', response_model=IDModel)
async def add_schema(request: Request, body: SchemaAddBody):
    user: UserModel = request.state.user
    user.admin_assert(AP.A_SCHEMA)

    schema_id = await schema_add(
        title=body.title,
        description=body.description,
        data=body.data,
    )

    return {'id': schema_id}


class SchemaUpdateBody(BaseModel):
    title: constr(min_length=1) = None
    description: str = None
    data: dict = None
    draft: bool = None


@router.patch(
    '/schemas/{schema_id}/', response_model=OkModel,
    openapi_extra={'errors': [no_change, bad_id]}
)
async def update_schema(
    request: Request, schema_id: int, body: SchemaUpdateBody
):
    user: UserModel = request.state.user
    user.admin_assert(AP.C_SCHEMA)

    change = False
    patch = {}

    schema = await schema_get(SchemaTable.schema_id == schema_id)
    if schema is None:
        raise bad_id('Schema', schema_id, id=schema_id)

    if body.title and body.title != schema.title:
        patch['title'] = body.title
        change = True

    if body.draft is not None and body.draft != schema.draft:
        patch['draft'] = body.draft
        change = True

    if body.data is not None:
        patch['data'] = body.data
        change = True

    if body.description is not None:
        patch['description'] = body.description or None
        change = True

    if not change:
        raise no_change

    await schema_update(
        SchemaTable.schema_id == schema_id,
        **patch
    )

    return {'ok': True}


@router.delete('/schemas/{schema_id}/', response_model=OkModel)
async def delete_schema(request: Request, schema_id: int):
    user: UserModel = request.state.user
    user.admin_assert(AP.D_SCHEMA)

    return {'ok': await schema_delete(schema_id)}
