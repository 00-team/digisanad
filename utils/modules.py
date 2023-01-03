from database.api import verification_add, verification_add_tries
from database.api import verification_delete, verification_get
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from settings import DEF_VERIFICATION_EXPIRE

from .tools import get_random_code, send_sms

VERIFY_ERROR = HTTPException(400, 'invalid verification')


async def send_verification(phone, action):
    result = await verification_get(phone)

    if not result:
        code = get_random_code()
        await verification_add(
            phone=phone,
            code=code,
            expires=DEF_VERIFICATION_EXPIRE,
            action=action
        )
        send_sms(phone, f'verification code is: {code}')
        return JSONResponse({'timer': DEF_VERIFICATION_EXPIRE})

    if result.action != action:
        print(result.action, action)
        raise VERIFY_ERROR

    return {'timer': result.expires}


async def verify_verification(phone, code, action):
    result = await verification_get(phone)

    if not result:
        raise VERIFY_ERROR

    if action != result.action:
        raise VERIFY_ERROR

    if code != result.code:
        await verification_add_tries(result)
        raise VERIFY_ERROR

    await verification_delete(phone)
