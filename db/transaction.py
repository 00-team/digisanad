
from sqlalchemy import insert, select, update

from shared import sqlx

from .models import TransactionModel as TM
from .models import TransactionTable as TT


async def transaction_get(*where) -> TM | None:
    row = await sqlx.fetch_one(select(TT).where(*where))
    if row is None:
        return None

    return TM(**row)


async def transaction_update(*where, **values: dict):
    await sqlx.execute(
        update(TT).where(*where),
        values
    )


async def transaction_add(**values: dict) -> int:
    return await sqlx.execute(insert(TT), values)
