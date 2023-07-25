

import mimetypes
import os
from typing import Annotated

import magic
from fastapi import APIRouter, Form, Request, UploadFile
from pydantic import BaseModel

from api.models import OkModel
from db.models import RecordModel, RecordTable, UserModel
from db.record import record_add, record_delete, record_get
from deps import user_required
from shared import settings, sqlx
from shared.errors import bad_file, bad_id
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

    return record_response(record)


@router.delete(
    '/{record_id}/', response_model=OkModel,
    openapi_extra={'errors': [bad_id]}
)
async def delete_record(request: Request, record_id: int):
    user: UserModel = request.state.user
    record = await record_get(
        RecordTable.record_id == record_id,
        RecordTable.owner == user.user_id
    )
    if record is None:
        raise bad_id('Record', record_id, id=record_id)

    record.path.unlink(True)

    await record_delete(
        RecordTable.record_id == record_id,
        RecordTable.owner == user.user_id
    )

    return {'ok': True}


@router.post(
    '/', response_model=RecordResponse,
    openapi_extra={'errors': [bad_file]}
)
async def add_record(
    request: Request,
    file: UploadFile,
    contract: Annotated[int, Form()] = None
):
    user: UserModel = request.state.user
    mime = magic.from_buffer(file.file.read(2048), mime=True)
    if mime is None:
        raise bad_file

    ext = mimetypes.guess_extension(mime)
    if ext is None or len(ext) < 2:
        raise bad_file

    file.file.seek(0)
    record = RecordModel(
        record_id=0,
        salt=os.urandom(4),
        owner=user.user_id,
        size=file.size,
        mime=mime,
        ext=ext[1:],
        timestamp=utc_now(),
        # TODO: check and validate the contract
        contract=contract
    )

    args = record.dict()
    args.pop('record_id')

    record_id = await record_add(**args)
    record.record_id = record_id

    path = settings.record_dir / (record.name + ext)
    with open(path, 'wb') as f:
        while (chunk := file.file.read(1024)):
            f.write(chunk)

    return record_response(record)
