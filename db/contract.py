
from sqlalchemy import delete, insert, select, update

from shared import sqlx

from .models import ContractModel, ContractTable, ContractUserTable


async def contract_get(*where) -> ContractModel | None:
    row = await sqlx.fetch_one(select(ContractTable).where(*where))
    if row is None:
        return None

    return ContractModel(**row)


async def contract_update(*where, **values: dict):
    await sqlx.execute(
        update(ContractTable).where(*where),
        values
    )


async def contract_add(**values: dict) -> int:
    return await sqlx.execute(insert(ContractTable), values)


async def contract_delete(*where) -> int:
    return await sqlx.execute(delete(ContractTable).where(*where))


async def contract_user_add(contract_id: int, user_id: int) -> int:
    return await sqlx.execute(insert(ContractUserTable), {
        'user': user_id,
        'contract': contract_id
    })


async def contract_user_delete(*where) -> int:
    return await sqlx.execute(delete(ContractUserTable).where(*where))
