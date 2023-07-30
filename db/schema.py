
from sqlalchemy import insert, select, update

from shared import sqlx

from .models import SchemaModel, SchemaTable


async def schema_get(*where) -> SchemaModel | None:
    row = await sqlx.fetch_one(select(SchemaTable).where(*where))
    if row is None:
        return None

    return SchemaModel(**row)


async def schema_update(*where, **values: dict):
    await sqlx.execute(
        update(SchemaTable).where(*where),
        values
    )


async def schema_add(**values: dict) -> int:
    return await sqlx.execute(insert(SchemaTable), values)
