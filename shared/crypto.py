
import json

from shared import W3, settings


def get_abi(name: str) -> list:
    path = settings.base_dir / f'shared/abi/{name}.json'
    with open(path) as f:
        return json.load(f)


ETH_WEI = 1e18
ETH_GWEI = 1e9
ETH_TOKENS = {
    'usdt': {
        'name': 'Tether USD',
        'contract': W3.eth.contract(
            '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            abi=get_abi('usdt')
        )
    }
}


__all__ = [
    'ETH_WEI', 'ETH_GWEI', 'ETH_TOKENS'
]
