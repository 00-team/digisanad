

from fastapi import APIRouter, Request

from db.general import general_get
from db.models import AdminPerms as AP
from db.models import GeneralModel, UserModel
from deps import admin_required

router = APIRouter(
    prefix='/admins',
    tags=['admins'],
    dependencies=[admin_required()]
)


@router.get('/general/', response_model=GeneralModel)
async def get_general(request: Request):
    user: UserModel = request.state.user
    user.admin_assert(AP.V_GENERAL)

    return await general_get()
