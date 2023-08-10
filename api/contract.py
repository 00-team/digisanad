
from typing import Literal

from fastapi import APIRouter, Request
from pydantic import BaseModel

from db.models import ContractModel, UserModel, UserPublic
from db.user import user_public
from deps import user_required
from shared import settings, sqlx
from shared.errors import bad_id

router = APIRouter(
    prefix='/contracts',
    tags=['contract'],
    dependencies=[user_required()]
)


@router.get('/', response_model=list[ContractModel])
async def get_contracts(request: Request):
    user: UserModel = request.state.user
    await sqlx.fetch_all(f'''

    ''')
