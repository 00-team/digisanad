
from sqlalchemy import insert, select, update

from shared import sqlx

from .models import UserModel, UserPublic, UserTable


async def user_get(*where) -> UserModel | None:
    row = await sqlx.fetch_one(select(UserTable).where(*where))
    if row is None:
        return None

    return UserModel(**row)


async def user_update(*where, **values: dict):
    await sqlx.execute(
        update(UserTable).where(*where),
        values
    )


async def user_add(**values: dict) -> int:
    return await sqlx.execute(insert(UserTable), values)


async def user_public(user_ids: list[int]) -> dict[int, UserPublic]:
    value = '(' + ','.join((str(i) for i in user_ids)) + ')'
    users = await sqlx.fetch_all(
        f'''
        SELECT user_id, phone, first_name, last_name
        FROM users WHERE user_id IN {value}
        '''
    )

    result = {-1: 'system', -2: 'contract'}

    for u in users:
        result[u[0]] = UserPublic(**u)

    return result
