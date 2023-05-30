
from fastapi import APIRouter, Request

from db.models import UserModel
from deps import rate_limit, user_required

router = APIRouter(
    prefix='/user',
    tags=['user'],
    dependencies=[user_required(), rate_limit('user', 60, 120)]
)


@router.get('/', response_model=UserModel)
async def get(request: Request):
    return request.state.user


@router.get('/test/')
async def test(request: Request):
    pass
    # user = request.state.user
    # ac = web3.Account()
    # w.eth.send_transaction({
    #     'from': '---',
    #     'to': '',
    #     'value': 1
    # })
