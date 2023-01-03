
from database import VerificationModel, redis

NS = 'verification'


async def verification_get(phone: str) -> VerificationModel | None:
    key = f'{NS}:{phone}'
    result = await redis.get(key)

    if result is None:
        return None

    result = result.decode().split('-')

    if len(result) != 3:
        # TODO: log error
        return None

    code, action, tries = result
    expires = await redis.ttl(key)

    return VerificationModel(
        phone=phone,
        code=code,
        action=action,
        expires=expires,
        tries=int(tries)
    )


async def verification_delete(phone: str):
    await redis.delete(f'{NS}:{phone}')


async def verification_add(phone, code, expires, action):
    # code-action-tries
    value = f'{code}-{action}-0'
    await redis.set(f'{NS}:{phone}', value, expires, nx=True)


async def verification_add_tries(row: VerificationModel):
    tries = row.tries + 1
    if tries > 2:
        await verification_delete(row.phone)
        return

    value = f'{row.code}-{row.action}-{tries}'
    await redis.set(f'{NS}:{row.phone}', value, xx=True, keepttl=True)


__all__ = [
    'verification_get',
    'verification_delete',
    'verification_add',
    'verification_add_tries',
]
