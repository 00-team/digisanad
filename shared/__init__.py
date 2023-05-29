from pathlib import Path
from string import ascii_letters, digits

from pydantic import BaseSettings
from web3 import AsyncWeb3, HTTPProvider


class Settings(BaseSettings):
    base_dir: Path = Path(__file__).parent.parent
    version: str = '0.0.1-beta'

    sql_url: str = 'sqlite:///' + str(base_dir / 'db/main.db')

    redis_pass: str
    infura_token: str

    # user_pic_dir = base_dir / 'media/users/'

    verification_expire = 2 * 60
    verification_code_len = 5

    token_len = 69
    token_abc = ascii_letters + digits + ('!@#$%^&*_+' * 2)


settings = Settings(_env_file='.secrets')

W3 = AsyncWeb3(HTTPProvider(
    'https://mainnet.infura.io/v3/' + settings.infura_token
))


# settings.user_pic_dir.mkdir(parents=True, exist_ok=True)
