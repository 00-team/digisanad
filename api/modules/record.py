

from fastapi import APIRouter, Request
from pydantic import BaseModel

from api.models import OkModel
from db.models import RecordModel, RecordTable, UserModel
from db.record import record_add, record_delete, record_get, record_update
from deps import user_required
from shared import settings, sqlx
from shared.errors import bad_id
from shared.tools import utc_now

router = APIRouter(
    prefix='/records',
    tags=['record'],
    dependencies=[user_required()]
)


class RecordResponse(BaseModel):
    record_id: int
    size: int
    mime: str
    ext: str
    name: str
    url: str
    timestamp: int
    contract: int | None = None


def record_response(data: RecordModel) -> RecordResponse:
    return RecordResponse(
        record_id=data.record_id,
        size=data.size,
        mime=data.mime,
        ext=data.ext,
        timestamp=data.timestamp,
        name=data.name,
        url=f'/records/{data.name}.{data.ext}',
        contract=data.contract
    )


@router.get('/', response_model=list[RecordResponse])
async def get_records(request: Request, page: int = 0):
    user: UserModel = request.state.user

    rows = await sqlx.fetch_all(
        f'''
        SELECT * FROM records WHERE owner = :user_id
        ORDER BY record_id DESC
        LIMIT {settings.page_size} OFFSET {page * settings.page_size}
        ''',
        {'user_id': user.user_id}
    )

    result = []

    for row in rows:
        result.append(record_response(RecordModel(**row)))

    return result


@router.get(
    '/{record_id}/', response_model=RecordResponse,
    openapi_extra={'errors': [bad_id]}
)
async def get_record(request: Request, record_id: int):
    user: UserModel = request.state.user
    record = await record_get(
        RecordTable.record_id == record_id,
        RecordTable.owner == user.user_id
    )

    if record is None:
        raise bad_id('Record', record_id, id=record_id)

    return record_response(RecordModel(**record))


@router.delete(
    '/{record_id}/', response_model=OkModel,
    openapi_extra={'errors': [bad_id]}
)
async def delete_record(request: Request, record_id: int):
    user: UserModel = request.state.user
    count = await record_delete(
        RecordTable.record_id == record_id,
        RecordTable.owner == user.user_id
    )

    if not count:
        raise bad_id('Record', record_id, id=record_id)

    return {'ok': True}
