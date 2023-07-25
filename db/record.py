
from sqlalchemy import delete, insert, select, update

from shared import sqlx

from .models import RecordModel, RecordTable


async def record_get(*where) -> RecordModel | None:
    row = await sqlx.fetch_one(select(RecordTable).where(*where))
    if row is None:
        return None

    return RecordModel(**row)


async def record_update(*where, **values: dict):
    await sqlx.execute(
        update(RecordTable).where(*where),
        values
    )


async def record_add(**values: dict) -> int:
    return await sqlx.execute(insert(RecordTable), values)


async def record_delete(*where) -> int:
    return await sqlx.execute(delete(RecordTable).where(*where))
