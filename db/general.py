
from sqlalchemy import insert, select, update

from shared import sqlx

from .models import GeneralModel, GeneralTable, model_dict


async def general_get() -> GeneralModel:
    row = await sqlx.fetch_one(
        select(GeneralTable)
        .where(GeneralTable.general_id == 0)
    )

    if row is None:
        await sqlx.execute(insert(GeneralTable), {'general_id': 0})
        return GeneralModel(general_id=0, coins={})

    return GeneralModel(**row)


async def general_update(**values: dict):
    coins = values.get('coins')

    if coins:
        for k, v in coins:
            values['coins'][k] = model_dict(v)

    await sqlx.execute(
        update(GeneralTable).where(GeneralTable.general_id == 0),
        values
    )
