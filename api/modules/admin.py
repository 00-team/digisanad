

import json

from fastapi import APIRouter, Request
from pydantic import BaseModel

from api.models import IDModel, OkModel
from db.general import general_get
from db.message import message_add
from db.models import AdminPerms as AP
from db.models import GeneralModel, MessageLevel, SchemaData, UserModel
from db.schema import schema_add
from deps import admin_required
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


@router.post('/message/', response_model=IDModel)
async def add_message(request: Request, body: MessageAddBody):
    user: UserModel = request.state.user
    user.admin_assert(AP.C_MESSAGE)

    message_id = await message_add(
        text=body.text,
        receiver=body.receiver,
        timestamp=utc_now(),
        level=body.level
    )

    return {'id': message_id}


class SchemaAddBody(BaseModel):
    title: str
    description: str = None
    data: SchemaData

    class Config:
        json_schema_extra = {'example': {
            'title': 'property contract',
            'data': {
                'stages': [
                    {
                        'title': 'the parties',
                        'uid': 'parties',
                        'fields': [
                            {
                                'uid': 'seller',
                                'title': 'Seller',
                            }
                        ]
                    }
                ]
            }
        }}


@router.post('/schema/', response_model=IDModel)
async def add_schema(request: Request, body: SchemaAddBody):
    user: UserModel = request.state.user
    user.admin_assert(AP.C_SCHEMA)

    print(json.dumps(body.data.dict(), indent=2))

    # schema_id = await schema_add(
    #     title=body.title,
    #     description=body.description,
    #     data=body.data
    # )

    return {'id': 12}
