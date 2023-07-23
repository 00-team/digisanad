
from fastapi import APIRouter, Request

from db.message import message_unseen_count, message_update
from db.models import MessageModel, MessageTable, UserModel
from deps import user_required

router = APIRouter(
    prefix='/messages',
    tags=['message'],
    dependencies=[user_required()]
)


@router.get('/unseen_count/', response_model=int)
async def unseen_count(request: Request):
    user: UserModel = request.state.user

    return await message_unseen_count(user.user_id)


@router.get('/', response_model=list[MessageModel])
async def get_messages(request: Request, seen: bool = None, page: int = 0):
    user: UserModel = request.state.user
    pass
