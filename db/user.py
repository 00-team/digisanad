
from sqlalchemy import insert, select, update

from shared import sqlx

from .models import UserModel, UsersTable


async def user_get(where) -> UserModel | None:
    row = await sqlx.fetch_one(select(UsersTable).where(where))
    if row is None:
        return None

    return UserModel(**row)

# async def user_get(user_id=None, phone=None) -> UserModel | None:
#     query = select(UsersTable)
#
#     if user_id:
#         query = query.where(UsersTable.user_id == user_id)
#     elif phone:
#         query = query.where(UsersTable.phone == phone)
#     else:
#         return None
#
#     row = await sqlx.fetch_one(query)
#
#     if row is None:
#         return None
#
#     return UserModel(**row)


async def user_update(user_id: int, **values: dict):
    await sqlx.execute(
        update(UsersTable)
        .where(UsersTable.user_id == user_id)
        .values(**values)
    )


async def user_add(**values: dict) -> int:
    return await sqlx.execute(insert(UsersTable), values)


async def user_count() -> int:
    query = 'SELECT COUNT(0) from user'
    return await sqlx.fetch_one(query)[0]


async def user_get_all(limit: int, offset: int):
    return await sqlx.fetch_all(select(UsersTable).limit(limit).offset(offset))
