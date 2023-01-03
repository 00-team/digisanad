
from pathlib import Path
from string import ascii_letters, digits

BASE_DIR = Path(__file__).parent
DATABASE_URL = f'sqlite:///' + str(BASE_DIR / 'database/main.db')

REDIS_PASSWORD = 'k#gYGOA&o@R2Q9NFu#@MD$)aClu5PDPm2^7(&*@KZG{cPNrwCI52zrc]PJuRW60C'


# DEFAULTS
DEF_USER_NICKNAME_SIZE = 52

DEF_USER_PIC_ABC = digits + 'abcdefABCDEF'  # hex abc
DEF_USER_PIC_DIR = BASE_DIR / 'media/users/'
DEF_USER_PIC_RES = 128

if not DEF_USER_PIC_DIR.exists():
    DEF_USER_PIC_DIR.mkdir(parents=True)

DEF_VERIFICATION_EXPIRE = 3 * 60
DEF_VERIFICATION_CODE_LEN = 5


DEF_TOKEN_LEN = 69
DEF_TOKEN_ABC = ascii_letters + digits + ('!@#$%^&*()_+[]' * 2)

DEF_ADMIN_TOKEN_EXPIRE = 12 * 3600  # 12 hours
