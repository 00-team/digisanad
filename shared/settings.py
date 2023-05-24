
import json
from pathlib import Path
from string import ascii_letters, digits

BASE_DIR = Path(__file__).parent.parent
DATABASE_URL = 'sqlite:///' + str(BASE_DIR / 'db/main.db')

REDIS_PASSWORD = 'k#gYGOA&o@R2Q9NFu#@MD$)aClu5PDPm2^7(&*@KZG{cPNrwCI52zrc]PJuRW60C'


with open(BASE_DIR / '.secrets') as f:
    SECRETS_DICT = json.load(f)


class SECRETS:
    class SMS:
        username = SECRETS_DICT['sms_username']
        password = SECRETS_DICT['sms_password']
        numbers = SECRETS_DICT['sms_numbers']

    merchant_id = SECRETS_DICT['merchant_id']


# DEFAULTS
DEF_VERIFICATION_EXPIRE = 2 * 60
DEF_VERIFICATION_CODE_LEN = 5


DEF_TOKEN_LEN = 69
DEF_TOKEN_ABC = ascii_letters + digits + ('!@#$%^&*()_+[]' * 2)

DEF_ADMIN_TOKEN_EXPIRE = 12 * 3600  # 12 hours
