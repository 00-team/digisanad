
import json

from eth_account.signers.local import LocalAccount

from db.models import CoinModel, WalletModel
from shared import W3, settings
from shared.tools import utc_now


def get_abi(name: str) -> list:
    path = settings.base_dir / f'shared/abi/{name}.json'
    with open(path) as f:
        return json.load(f)


ERC20_ABI = get_abi('erc20')
ETH_WEI = 1e18
ETH_GWEI = 1e9
ETH_TOKENS = {
    'usdt': {
        'name': 'Tether USD',
        'contract': W3.eth.contract(
            '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            abi=ERC20_ABI
        ),
        'decimals': 10 ** 6  # decimals function in the contract
    },
    'shib': {
        'name': 'Shiba INU',
        'contract': W3.eth.contract(
            '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
            abi=ERC20_ABI
        ),
        'decimals': 10 ** 18
    }
}


def get_eth_acc(wallet: WalletModel = None) -> LocalAccount:
    if wallet is None:
        return W3.eth.account.create()

    for c in wallet.coin:
        if c.name == 'eth' and c.network == 'eth':
            return W3.eth.account.from_key(c.pk)

    # TODO: remove this
    if pk := getattr(wallet, 'eth_pk', None):
        return W3.eth.account.from_key(pk)

    return W3.eth.account.create()


async def update_wallet(wallet: WalletModel = None) -> WalletModel:
    eth_acc = get_eth_acc(wallet)
    eth_balance = await W3.eth.get_balance(eth_acc.address)

    # if eth_balance:
    #     W3.eth.send_transaction({
    #         'from': eth_acc.address,
    #         'to': settings.eth_main_wallet,
    #         'value': eth_balance
    #     })

    coin = [
        CoinModel(
            name='eth',
            display='Ether',
            network='eth',
            balance=eth_balance,
            pk=eth_acc.key.hex(),
            addr=eth_acc.address
        )
    ]

    for k, t in ETH_TOKENS.items():
        amount = await t['contract'].functions.balanceOf(
            eth_acc.address
        ).call()
        if amount:
            coin.append(CoinModel(
                name=k,
                display=t['name'],
                balance=amount / t['decimals'],
                network='eth',
                contract=t['contract'].address,
            ))

    if wallet is None:
        return WalletModel(
            wallet_id=0,
            user_id=0,
            last_update=utc_now(),
            coin=coin,
        )

    wallet.last_update = utc_now()
    wallet.coin = coin

    return wallet


__all__ = [
    'ETH_WEI', 'ETH_GWEI', 'ETH_TOKENS',
    'update_wallet'
]
