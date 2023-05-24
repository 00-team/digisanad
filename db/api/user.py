from db import UserModel, database
from db.table import user_table as table


async def _user_get(query):
    user_row = await database.fetch_one(query)

    if user_row is None:
        return None

    return UserModel(**user_row)


async def user_get_by_id(user_id: int, token: str = None) -> UserModel | None:
    if token is None:
        query = table.select().where(table.c.user_id == user_id)
    else:
        query = table.select().where(table.c.user_id == user_id, table.c.token == token)

    return await _user_get(query)


async def user_get_by_phone(phone: str) -> UserModel | None:
    query = table.select().where(table.c.phone == phone)
    return await _user_get(query)


async def user_update(user_id: int, **values: dict):
    await database.execute(
        table.update()
        .where(table.c.user_id == user_id)
        .values(**values)
    )


async def user_add(**values: dict) -> int:
    query = table.insert().values(**values)
    return await database.execute(query)


async def user_delete(user_id: int):
    await database.execute(
        table.delete()
        .where(table.c.user_id == user_id)
    )


async def user_count() -> int:
    query = 'SELECT COUNT(0) from user'
    result = await database.fetch_one(query)

    return result[0]


async def user_get_all(limit: int, offset: int):
    query = table.select().limit(limit).offset(offset)
    return await database.fetch_all(query)

__all__ = [
    'user_get_by_id',
    'user_get_by_phone',
    'user_update',
    'user_add',
    'user_delete',
    'user_count',
    'user_get_all',
]
