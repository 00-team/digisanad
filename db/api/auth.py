
from db import VerificationModel
from shared.tools import now

NS = 'verification'


VERIF = {}


async def verification_delete(phone: str):
    VERIF.pop(phone, None)
    # await redis.delete(f'{NS}:{phone}')


async def verification_get(phone: str) -> VerificationModel | None:
    value = VERIF.get(phone)
    if value is None:
        return None

    if value['expires'] < now():
        await verification_delete(phone)
        return None

    return VerificationModel(
        phone=phone,
        code=value['code'],
        action=value['action'],
        expires=value['expires'] - now(),
        tries=value['tries'],
    )

    # key = f'{NS}:{phone}'
    # result = await redis.get(key)

    # if result is None:
    #     return None

    # result = result.decode().split('-')

    # if len(result) != 3:
    #     # TODO: log error
    #     return None

    # code, action, tries = result
    # expires = await redis.ttl(key)

    # return VerificationModel(
    #     phone=phone,
    #     code=code,
    #     action=action,
    #     expires=expires,
    #     tries=int(tries)
    # )


async def verification_add(phone, code, expires, action):
    VERIF[phone] = {
        'code': code,
        'expires': now() + expires,
        'action': action,
        'tries': 0
    }

    # code-action-tries
    # value = f'{code}-{action}-0'
    # await redis.set(f'{NS}:{phone}', value, expires, nx=True)


async def verification_add_tries(row: VerificationModel):
    tries = row.tries + 1
    if tries > 2:
        await verification_delete(row.phone)
        return

    value = VERIF.get(row.phone)

    if value is None or value['expires'] < now():
        await verification_delete(row.phone)
        return

    VERIF[row.phone] = {
        **value,
        'tries': tries
    }

    # value = f'{row.code}-{row.action}-{tries}'
    # await redis.set(f'{NS}:{row.phone}', value, xx=True, keepttl=True)


__all__ = [
    'verification_get',
    'verification_delete',
    'verification_add',
    'verification_add_tries',
]
