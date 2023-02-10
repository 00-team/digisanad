
import httpx
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse

from database import UserModel
from database.api.transaction import transaction_add, transaction_get
from database.api.transaction import transaction_update
from database.api.user import user_delete
from models.user import DeleteResponse, DeleteVerifyBody, DeleteVerifyResponse
from shared.settings import SECRETS
from shared.tools import now
from utils import rate_limit, send_verification, user_required
from utils import verify_verification

PAYMENT_ERROR = HTTPException(500, 'payment error')

router = APIRouter(
    prefix='/user',
    tags=['user'],
    dependencies=[user_required()]
)

''' user update
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
'''


@router.get('/get/', response_model=UserModel)
async def get(request: Request):
    return request.state.user


@router.post(
    '/delete/',
    response_model=DeleteResponse,
    dependencies=[rate_limit('user_delete', 3660, 20)]
)
async def delete(request: Request):
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


@router.get(
    '/charge_wallet/',
    dependencies=[rate_limit('user_charge_wallet', 60, 30)]
)
async def charge_wallet(request: Request, amount: int):
    user: UserModel = request.state.user

    response = httpx.post(
        'https://api.zarinpal.com/pg/v4/payment/request.json',
        json={
            'merchant_id': SECRETS.merchant_id,
            'amount': amount,
            'description': 'test payment for charging the users wallet',
            'callback_url': request.base_url._url + 'api/user/payment_cb/'
        }
    )

    if response.status_code != 200:
        raise PAYMENT_ERROR

    data = response.json().get('data', {})
    authority = data.get('authority')

    if not authority:
        raise PAYMENT_ERROR

    await transaction_add(user.user_id, amount, authority)

    return {
        'url': f'https://www.zarinpal.com/pg/StartPay/{authority}'
    }


@router.get(
    '/payment_cb/',
    # response_class=RedirectResponse,
    # dependencies=[rate_limit('user_charge_wallet', 60, 30)]
)
async def payment_cb(request: Request, Authority: str, Status: str):
    user: UserModel = request.state.user

    Status = Status.lower()
    if Status == 'nok':
        return '/dashboard/'

    transaction = await transaction_get(user.user_id, Authority)
    if transaction is None:
        return '/dashboard/'

    response = httpx.post(
        'https://api.zarinpal.com/pg/v4/payment/verify.json',
        json={
            'merchant_id': SECRETS.merchant_id,
            'amount': transaction.amount,
            'authority': Authority
        }
    )

    if response.status_code != 200:
        return '/dashboard/'

    data = response.json()
    print(data)

    return '/dashboard/'
