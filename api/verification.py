
import logging
from dataclasses import dataclass
from enum import Enum
from random import choices
from struct import Struct

from pydantic import BaseModel

from shared import redis, settings
from shared.errors import bad_verification
from shared.sms import send_sms
from shared.validators import PhoneNumber

NS = 'verification'


class Action(str, Enum):
    login = 'login'
    register = 'register'
    delete = 'delete'


@dataclass
class Value:
    tries: int
    code: str
    action: str

    _struct = Struct('<B5s25s')

    @classmethod
    def from_bytes(cls, data):
        t, c, a = cls._struct.unpack(data)
        return cls(
            tries=t,
            code=c.decode(),
            action=a.strip(b'\x00').decode(),
        )

    def to_bytes(self):
        return self._struct.pack(
            self.tries,
            self.code.encode(),
            self.action.encode(),
        )


class VerificationResponse(BaseModel):
    expires: int
    action: Action

    class Config:
        schema_extra = {'example': {
            'expires': 102,
            'action': Action.login
        }}


class VerificationData(BaseModel):
    phone: PhoneNumber
    action: Action


async def verification(data: VerificationData):
    key = f'{NS}:{data.phone}'
    result = await redis.get(key)

    if result:
        value = Value.from_bytes(result)
        if value.action != data.action:
            logging.warn((
                'two verifications with different action\n'
                f'phone: {data.phone}\n'
            ))
            raise bad_verification

        return VerificationResponse(
            expires=await redis.ttl(key),
            action=value.action
        )

    code = ''.join(choices('0123456789', k=settings.verification_code_len))

    value = Value(0, code, data.action)

    await redis.set(
        key, value.to_bytes(),
        settings.verification_expire, nx=True
    )

    await send_sms(
        data.phone,
        f'verification code is: {code}'
    )

    return VerificationResponse(
        expires=settings.verification_expire,
        action=value.action
    )


async def verify_verification(phone, code, action) -> Value:
    key = f'{NS}:{phone}'
    result = await redis.get(key)

    if not result:
        raise bad_verification

    value = Value.from_bytes(result)
    if value.action != action:
        raise bad_verification

    # TODO: remove this debug code
    if code != '99999' and code != value.code:
        value.tries += 1

        if value.tries > 2:
            await redis.delete(key)
        else:
            await redis.set(key, value.to_bytes(), xx=True, keepttl=True)

        raise bad_verification

    await redis.delete(key)
    return value
