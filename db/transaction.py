
from sqlalchemy import insert, select, update

from shared import sqlx

from .models import TransactionModel, TransactionTable


async def transaction_get(*where) -> TransactionModel | None:
    row = await sqlx.fetch_one(select(TransactionTable).where(*where))
    if row is None:
        return None

    return TransactionModel(**row)


async def transaction_update(*where, **values: dict):
    await sqlx.execute(
        update(TransactionTable).where(*where),
        values
    )


async def transaction_add(**values: dict) -> int:
    return await sqlx.execute(insert(TransactionTable), values)


async def transaction_count() -> int:
    query = 'SELECT COUNT(0) from transactions'
    return await sqlx.fetch_one(query)[0]


async def transaction_get_all(limit: int, offset: int):
    return await sqlx.fetch_all(
        select(TransactionTable)
        .limit(limit)
        .offset(offset)
    )
