
from sqlalchemy import insert, select, update

from shared import sqlx

from .models import GeneralModel, GeneralTable


async def general_get() -> GeneralModel:
    row = await sqlx.fetch_one(select(GeneralTable).limit(1))
    if row is None:
        gid = await sqlx.execute(insert(GeneralTable))
        return GeneralModel(general_id=gid, coin=[])

    return GeneralModel(**row)


async def general_update(gid: int, **values: dict):
    await sqlx.execute(
        update(GeneralTable).where(GeneralTable.general_id == gid),
        values
    )
