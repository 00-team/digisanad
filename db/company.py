
from sqlalchemy import delete, insert, select, update

from shared import sqlx

from .models import CompanyModel, CompanyTable


async def company_get(*where) -> CompanyModel | None:
    row = await sqlx.fetch_one(select(CompanyTable).where(*where))
    if row is None:
        return None

    return CompanyModel(**row)


async def company_update(*where, **values: dict):
    await sqlx.execute(
        update(CompanyTable).where(*where),
        values
    )


async def company_add(**values: dict) -> int:
    return await sqlx.execute(insert(CompanyTable), values)


async def contract_delete(*where) -> int:
    return await sqlx.execute(delete(CompanyTable).where(*where))
