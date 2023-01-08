
from fastapi import APIRouter, Form, HTTPException, Request, UploadFile
from PIL import Image, UnidentifiedImageError
from starlette.datastructures import UploadFile as StarletteUploadFile

from database import UserModel
from database.api import user_delete, user_get_by_id, user_update
from models.user import DeleteResponse, DeleteVerifyBody, DeleteVerifyResponse
from models.user import UpdateResponse
from settings import DEF_USER_PIC_DIR, DEF_USER_PIC_RES
from utils import get_picture_name, now, rate_limit, send_verification
from utils import user_required, verify_verification

router = APIRouter(
    prefix='/user',
    tags=['user'],
    dependencies=[user_required()]
)


@router.api_route(
    '/update/', methods=['POST', 'GET'],
    response_model=UpdateResponse,
    # TODO: update this rate limit
    dependencies=[rate_limit('user', 600, 200)]
)
async def update(
    request: Request,
    picture: str | UploadFile | None = Form(default=None),
    nickname: str | None = Form(default=None),
):
    user: UserModel = request.state.user
    data = {
        'user_id': user.user_id,
        'wallet': user.wallet,
        'nickname': user.nickname,
        'picture': user.picture_url(request.base_url),
    }

    if (request.method == 'GET') or (
        # check if there is no change
        (picture is None or (picture == 'delete' and user.picture is None)) and
        (nickname is None or nickname == user.nickname)
    ):
        return data

    update_values = {
        'wallet': 606_040
    }

    if nickname:
        nickname = nickname.encode('utf-8')[:50]
        update_values['nickname'] = nickname

    if isinstance(picture, StarletteUploadFile):
        try:
            img = Image.open(picture.file)
        except UnidentifiedImageError:
            raise HTTPException(400, 'picture file is invalid')

        try:
            img.thumbnail(
                (DEF_USER_PIC_RES, DEF_USER_PIC_RES),
                Image.Resampling.LANCZOS
            )

            pic_name = get_picture_name(user.user_id) + '.jpg'
            path = DEF_USER_PIC_DIR / pic_name
            img.convert('RGB').save(path, 'JPEG')
        except OSError:
            raise HTTPException(400, 'picture is not resizable')

        update_values['picture'] = pic_name

    elif picture == 'delete' and user.picture:
        update_values['picture'] = None

    if not update_values:
        return data

    await user_update(user.user_id, **update_values)
    new_user = await user_get_by_id(user.user_id)

    user.clean_picture(new_user.picture)

    return {
        **data,
        'nickname': new_user.nickname,
        'picture': new_user.picture_url(request.base_url),
    }


@router.post(
    '/delete/',
    response_model=DeleteResponse,
    dependencies=[rate_limit('user_delete', 3660, 20)]
)
async def delete(request: Request):
    # TODO: dont delete the user if they have money in there account
    # write a function for checking the user

    user: UserModel = request.state.user

    return await send_verification(user.phone, 'DELETE')


@router.post(
    '/delete_verify/',
    response_model=DeleteVerifyResponse,
    dependencies=[rate_limit('user_delete', 3660, 20)]
)
async def delete_verify(request: Request, body: DeleteVerifyBody):
    user: UserModel = request.state.user

    await verify_verification(user.phone, body.code, 'DELETE')

    await user_delete(user.user_id)

    return {
        'ok': True,
        'datetime': now()
    }
