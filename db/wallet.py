
from sqlalchemy import insert, select, update

from shared import sqlx

from .models import WalletModel, WalletTable, model_dict


async def wallet_get(*where) -> WalletModel | None:
    row = await sqlx.fetch_one(select(WalletTable).where(*where))
    if row is None:
        return None

    return WalletModel(**row)


def update_values(values: dict) -> dict:
    accounts = values.get('accounts')
    coins = values.get('coins')

    if accounts:
        for k, v in accounts.items():
            values['accounts'][k] = model_dict(v)

    if coins:
        for k, v in coins.items():
            values['coins'][k] = model_dict(v)

    return values


async def wallet_update(*where, **values: dict):
    values = update_values(values)
    await sqlx.execute(
        update(WalletTable).where(*where),
        values
    )


async def wallet_add(**values: dict) -> int:
    values = update_values(values)
    return await sqlx.execute(insert(WalletTable), values)
