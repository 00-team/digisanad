

from typing import ClassVar

from fastapi import APIRouter, Request
from pydantic import BaseModel, constr
from sqlalchemy import select

from db.general import general_get
from db.message import message_add
from db.models import AdminPerms as AP
from db.models import GeneralModel, MessageLevel, SchemaData, SchemaModel
from db.models import SchemaTable, UserModel, UserTable
from db.schema import schema_add, schema_delete, schema_get, schema_update
from db.user import user_get, user_update
from deps import admin_required
from shared import settings, sqlx
from shared.errors import bad_id, forbidden, no_change
from shared.models import IDModel, OkModel
from shared.tools import isallnum, utc_now

router = APIRouter(
    prefix='/admin',
    tags=['admin'],
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
    data: dict = {}


@router.post('/messages/', response_model=IDModel)
async def add_message(request: Request, body: MessageAddBody):
    user: UserModel = request.state.user
    user.admin_assert(AP.A_MESSAGE)

    message_id = await message_add(
        text=body.text,
        receiver=body.receiver,
        timestamp=utc_now(),
        level=body.level,
        data=body.data
    )

    return {'id': message_id}


class SchemaModelNoData(SchemaModel):
    data: ClassVar


@router.get('/schemas/', response_model=list[SchemaModelNoData])
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
        result.append(SchemaModelNoData(**row))

    return result


@router.get(
    '/schemas/{schema_id}/', response_model=SchemaModel,
    openapi_extra={'errors': [bad_id]}
)
async def get_schema(request: Request, schema_id: int):
    user: UserModel = request.state.user
    user.admin_assert(AP.V_SCHEMA)

    schema = await schema_get(SchemaTable.schema_id == schema_id)
    if schema is None:
        raise bad_id('Schema', schema_id, id=schema_id)

    # args = schema._asdict()
    # args['data'] = json.loads(args['data'])
    # result.append(SchemaModel(**args))

    return schema


class SchemaAddBody(BaseModel):
    title: str
    description: str = ''
    data: SchemaData


@router.post('/schemas/', response_model=IDModel)
async def add_schema(request: Request, body: SchemaAddBody):
    user: UserModel = request.state.user
    user.admin_assert(AP.A_SCHEMA)

    schema_id = await schema_add(
        title=body.title,
        description=body.description,
        data=body.data.dict(),
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
        patch['description'] = body.description
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


class GetUsersBody(BaseModel):
    page: int = 0
    perms: str = None
    phone: constr(max_length=11, min_length=1, strip_whitespace=True) = None


@router.post('/users/', response_model=list[UserModel])
async def get_users(request: Request, body: GetUsersBody):
    user: UserModel = request.state.user
    user.admin_assert(AP.V_USER)

    query = select(UserTable)

    if body.perms is not None:
        query = query.where(UserTable.admin == body.perms)

    if body.phone is not None:
        query = query.where(UserTable.phone.like(f'%{body.phone}%'))

    query = (
        query.order_by(UserTable.user_id.desc())
        .limit(settings.page_size)
        .offset(body.page * settings.page_size)
    )

    rows = await sqlx.fetch_all(query)

    return [UserModel(**r) for r in rows]


@router.get(
    '/users/{user_id}/', response_model=UserModel,
    openapi_extra={'errors': [bad_id]}
)
async def get_user(request: Request, user_id: int):
    user: UserModel = request.state.user
    user.admin_assert(AP.V_USER)

    target = await user_get(UserTable.user_id == user_id)
    if target is None:
        raise bad_id('User', user_id, id=user_id)

    return UserModel(**target)


@router.patch(
    '/users/{user_id}/perms/', response_model=OkModel,
    openapi_extra={'errors': [bad_id, no_change]}
)
async def update_user_perms(request: Request, user_id: int, perms: str):
    user: UserModel = request.state.user
    user.admin_assert(AP.MASTER)

    if not isallnum(perms):
        raise ValueError('invalid perms')

    target = await user_get(UserTable.user_id == user_id)
    if target is None:
        raise bad_id('User', user_id, id=user_id)

    if target.admin_check(AP.MASTER):
        raise forbidden

    perms = int(perms or '0')

    if (perms & AP.MASTER):
        raise forbidden

    if target.perms == perms:
        raise no_change

    await user_update(UserTable.user_id == user_id, admin=str(perms))

    return {'ok': True}
