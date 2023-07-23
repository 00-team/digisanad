
from sqlalchemy import insert, update

from shared import sqlx

from .models import MessageTable


async def message_update(*where, **values: dict):
    await sqlx.execute(
        update(MessageTable).where(*where),
        values
    )


async def message_add(**values: dict) -> int:
    return await sqlx.execute(insert(MessageTable), values)


async def message_unseen_count(user_id: int) -> int:
    query = '''
        SELECT COUNT(0) FROM messages
        WHERE seen IS false AND receiver = :user_id
    '''
    return await sqlx.fetch_one(query, {'user_id': user_id})[0]