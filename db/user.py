
from sqlalchemy import select

from shared import sqlx

from .models import UserModel, UsersTable


async def user_get(user_id=None, phone=None) -> UserModel | None:
    query = select(UsersTable)

    if user_id:
        query = query.where(UsersTable.user_id == user_id)
    elif phone:
        query = query.where(UsersTable.phone == phone)
    else:
        return None

    row = await sqlx.fetch_one(query)

    if row is None:
        return None

    return UserModel(**row)
