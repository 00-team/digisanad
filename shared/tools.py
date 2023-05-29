
from datetime import datetime
from hashlib import sha3_512
from random import choices
from secrets import choice as secret_choice

from shared import settings


def now(dt: bool = False) -> int | datetime:
    _now = datetime.utcnow()

    if dt:
        return _now

    return int(_now.timestamp())


def get_random_code() -> str:
    return ''.join(choices('0123456789', k=settings.verification_code_len))


def new_token() -> tuple[str, str]:
    token = ''.join(
        secret_choice(settings.token_abc)
        for _ in range(settings.token_len)
    )
    return token, sha3_512(token.encode()).hexdigest()


def isallnum(text: str) -> bool:
    for c in text:
        if c not in set('0123456789'):
            return False

    return True


def code_validator(code: str):
    if not isinstance(code, str):
        raise ValueError('invalid verification code')

    if len(code) != settings.verification_code_len:
        raise ValueError('invalid verification code')

    if not isallnum(code):
        raise ValueError('invalid phone number')

    return code
