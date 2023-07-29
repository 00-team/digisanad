

from fastapi import APIRouter, Request

from db.models import SchemaData, SchemaModel, SchemaTable, UserModel
from deps import user_required

router = APIRouter(
    prefix='/schemas',
    tags=['schema'],
    dependencies=[user_required()]
)


@router.get('/', response_model=list[SchemaModel])
async def get_schemas(request: Request, page: int = 0):
    user: UserModel = request.state.user

    return []
