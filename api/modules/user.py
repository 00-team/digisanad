
import web3
from fastapi import APIRouter, HTTPException, Request

from api.models.user import DeleteResponse, DeleteVerifyBody
from api.models.user import DeleteVerifyResponse
from db import UserModel
from db.api.user import user_delete
from shared import settings
from shared.tools import now
from utils import rate_limit, send_verification, user_required
from utils import verify_verification

PAYMENT_ERROR = HTTPException(500, 'payment error')

router = APIRouter(
    prefix='/user',
    tags=['user'],
    dependencies=[user_required()]
)


@router.get('/get/', response_model=UserModel)
async def get(request: Request):
    return request.state.user


@router.get('/test/')
async def test(request: Request):
    pass
    # user = request.state.user
    # ac = web3.Account()
    # w = web3.AsyncWeb3(web3.HTTPProvider(
    #     'https://mainnet.infura.io/v3/' + SECRETS.infura
    # ))
    #
    # w.eth.send_transaction({
    #     'from': '---',
    #     'to': '',
    #     'value': 1
    # })


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
