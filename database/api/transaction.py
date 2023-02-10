from database import TransactionModel, database
from database.table import transaction_table as table


async def transaction_get(user_id, authority):
    transaction = await database.fetch_one(
        table.select()
        .where(table.c.user_id == user_id, table.c.authority == authority)
    )

    if transaction is None:
        return None

    return TransactionModel(**transaction)


async def transaction_add(user_id, amount, authority) -> int:
    query = table.insert().values(
        user_id=user_id,
        amount=amount,
        authority=authority,
        ref_id=0
    )
    return await database.execute(query)


async def transaction_update(user_id, authority, ref_id):
    await database.execute(
        table.update()
        .where(table.c.user_id == user_id, table.c.authority == authority)
        .values(ref_id=ref_id)
    )


__all__ = [
    'transaction_get',
    'transaction_add',
    'transaction_update',
]
