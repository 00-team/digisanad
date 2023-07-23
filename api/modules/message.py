
from typing import Literal

from fastapi import APIRouter, Request

from db.message import message_get, message_unseen_count, message_update
from db.models import MessageModel, MessageTable, UserModel, UserPublic
from db.user import user_public
from deps import user_required
from shared import settings, sqlx
from shared.errors import bad_id

router = APIRouter(
    prefix='/messages',
    tags=['message'],
    dependencies=[user_required()]
)


@router.get('/unseen_count/', response_model=int)
async def unseen_count(request: Request):
    user: UserModel = request.state.user
    return (await message_unseen_count(user.user_id))


class MessageResponse(MessageModel):
    sender: UserPublic | Literal['system'] | None


@router.get('/', response_model=list[MessageResponse])
async def get_messages(request: Request, seen: bool = None, page: int = 0):
    user: UserModel = request.state.user
    seen_condition = ''
    if seen is not None:
        seen_condition = 'AND seen is '
        seen_condition += 'true' if seen else 'false'

    rows = await sqlx.fetch_all(
        f'''
        SELECT * FROM messages
        WHERE receiver == :user_id
        {seen_condition}
        ORDER BY message_id DESC
        LIMIT {settings.page_size} OFFSET {page * settings.page_size}
        ''',
        {'user_id': user.user_id}
    )

    user_ids = set()
    messages = [MessageModel(**r) for r in rows]

    for msg in messages:
        if msg.sender != -1:
            user_ids.add(msg.sender)

    users = await user_public(user_ids)

    result = []
    for msg in messages:
        r = msg.dict()
        r['sender'] = users.get(r['sender'])
        result.append(r)

    return result


@router.patch(
    '/{message_id}/', response_model=bool,
    openapi_extra={'errors': [bad_id]}
)
async def seen_message(request: Request, message_id: int):
    user: UserModel = request.state.user
    message = await message_get(
        MessageTable.message_id == message_id,
        MessageTable.receiver == user.user_id
    )
    if message is None:
        raise bad_id('Message', message_id, id=message_id)

    if message.seen:
        return False

    await message_update(
        MessageTable.message_id == message_id,
        seen=True
    )
    return True
