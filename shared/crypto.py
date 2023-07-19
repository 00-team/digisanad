
import json

from eth_account.signers.local import LocalAccount

from db.general import general_get, general_update
from db.models import BaseCoin, GeneralCoin, NetworkType, WalletCoin
from db.models import WalletModel
from db.transaction import transaction_add, transaction_get, transaction_update
from shared import settings, w3
from shared.tools import utc_now


def get_abi(name: str) -> list:
    path = settings.base_dir / f'shared/abi/{name}.json'
    with open(path) as f:
        return json.load(f)


ERC20_ABI = get_abi('erc20')
ETH_WEI = 1_000_000_000_000_000_000
ETH_GWEI = 1_000_000_000
ETH_TOKENS = {
    'usdt': {
        'display': 'Tether USD',
        'contract': w3.eth.contract(
            '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            abi=ERC20_ABI
        ),
        'decimals': 10 ** 6  # decimals function in the contract
    },
    'shib': {
        'display': 'Shiba INU',
        'contract': w3.eth.contract(
            '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
            abi=ERC20_ABI
        ),
        'decimals': 10 ** 18
    }
}


def get_eth_acc(wallet: WalletModel) -> LocalAccount:
    for c in wallet.coin:
        if c.name == 'eth' and c.network == NetworkType.ethereum:
            return w3.eth.account.from_key(c.pk)

    # TODO: remove this
    if pk := getattr(wallet, 'eth_pk', None):
        return w3.eth.account.from_key(pk)

    return w3.eth.account.create()


def coin_index(array: list[BaseCoin], network: NetworkType, name: str) -> int:
    for index, coin in enumerate(array):
        if coin.network == network and coin.name == name:
            return index

    return -1


async def update_wallet(wallet: WalletModel = None) -> WalletModel:
    if wallet is None:
        eth_acc = w3.eth.account.create()
        coin = [WalletCoin(
            name='eth',
            display='Ether',
            network=NetworkType.ethereum,
            in_wallet=0,
            in_system=0,
            pk=eth_acc.key.hex(),
            addr=eth_acc.address
        )] + [WalletCoin(
            name=k,
            display=v['display'],
            network=NetworkType.ethereum,
            in_wallet=0,
            in_system=0,
            contract=v['contract'].address,
        ) for k, v in ETH_TOKENS.items()]

        return WalletModel(
            wallet_id=0,
            user_id=0,
            last_update=utc_now(),
            coin=coin,
        )

    eth_acc = get_eth_acc(wallet)
    eth_balance = await w3.eth.get_balance(eth_acc.address)
    nonce = await w3.eth.get_transaction_count(eth_acc.address)

    gas = 21000
    gas_price = w3.eth.gas_price

    if eth_balance - 1e5 > gas * gas_price:
        st = eth_acc.sign_transaction({
            'from': eth_acc.address,
            'to': settings.eth_main_wallet,
            'value': eth_balance - (gas * gas_price),
            'nonce': nonce,
            'gas': gas,
            'gasPrice': gas_price,
        })
        nonce += 1
        tx = w3.eth.send_raw_transaction(st.rawTransaction)
        idx = coin_index(wallet.coin, NetworkType.ethereum, 'eth')
        if idx == -1:
            wallet.coin.append(WalletCoin(
                name='eth',
                display='Ether',
                network=NetworkType.ethereum,
                in_wallet=0,
                in_system=0,
                pk=eth_acc.key.hex(),
                addr=eth_acc.address
            ))
        else:
            coin = wallet.coin[idx]
            eth_coin

    if wallet:
        eth_idx = coin_index(wallet.coin, NetworkType.ethereum, 'eth')
        if eth_idx == -1:
            wallet.coin.append(WalletCoin(
                name='eth',
                display='Ether',
                network=NetworkType.ethereum,
                in_wallet=1,
                in_system=1,
                pk=eth_acc.key.hex(),
                addr=eth_acc.address

            ))

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

    wallet.last_update = utc_now()
    wallet.coin = coin

    return wallet


__all__ = [
    'ETH_WEI', 'ETH_GWEI', 'ETH_TOKENS',
    'update_wallet'
]
