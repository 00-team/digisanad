
from sqlalchemy import insert, select, update

from shared import sqlx

from .models import WalletModel, WalletTable


async def wallet_get(*where) -> WalletModel | None:
    row = await sqlx.fetch_one(select(WalletTable).where(*where))
    if row is None:
        return None

    return WalletModel(**row)


async def wallet_update(*where, **values: dict):
    await sqlx.execute(
        update(WalletTable).where(*where),
        values
    )


async def wallet_add(**values: dict) -> int:
    return await sqlx.execute(insert(WalletTable), values)


async def wallet_count() -> int:
    query = 'SELECT COUNT(0) from wallet'
    return await sqlx.fetch_one(query)[0]


async def wallet_get_all(limit: int, offset: int):
    return await sqlx.fetch_all(
        select(WalletTable)
        .limit(limit)
        .offset(offset)
    )
