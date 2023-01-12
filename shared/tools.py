
from datetime import datetime
from hashlib import sha3_512
from random import choices
from secrets import choice as secret_choice

from shared.settings import DEF_TOKEN_ABC, DEF_TOKEN_LEN
from shared.settings import DEF_VERIFICATION_CODE_LEN


def now(dt: bool = False) -> int | datetime:
    _now = datetime.utcnow()

    if dt:
        return _now

    return int(_now.timestamp())


def get_random_code() -> str:
    return ''.join(choices('0123456789', k=DEF_VERIFICATION_CODE_LEN))


# def get_picture_name(user_id: int) -> str:
#     return f'{user_id}-' + ''.join(choices(DEF_USER_PIC_ABC, k=8))


def new_token() -> tuple[str, str]:
    token = ''.join(
        secret_choice(DEF_TOKEN_ABC)
        for _ in range(DEF_TOKEN_LEN)
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

    if len(code) != DEF_VERIFICATION_CODE_LEN:
        raise ValueError('invalid verification code')

    if not isallnum(code):
        raise ValueError('invalid phone number')

    return code
