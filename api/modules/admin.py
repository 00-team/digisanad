

from fastapi import APIRouter, Request
from pydantic import BaseModel

from db.general import general_get
from db.message import message_add
from db.models import AdminPerms as AP
from db.models import GeneralModel, MessageLevel, UserModel
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


@router.post('/message/', response_model=int)
async def add_message(request: Request, body: MessageAddBody):
    user: UserModel = request.state.user
    user.admin_assert(AP.C_MESSAGE)

    return await message_add(
        text=body.text,
        receiver=body.receiver,
        timestamp=utc_now(),
        level=body.level
    )


@router.post('/schema/')
async def add_schema(request: Request, body: None):
    pass
