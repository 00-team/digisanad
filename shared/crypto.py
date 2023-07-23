
# import json
# import logging

# from eth_account.signers.local import LocalAccount
from web3.exceptions import TransactionNotFound
from web3.types import HexBytes

from db.general import general_get, general_update
from db.models import GeneralCoin, NetworkType, TransactionStatus
from db.models import WalletAccount, WalletCoin, WalletModel
from db.transaction import transaction_add
from shared import settings, w3
from shared.tools import utc_now

# def get_abi(name: str) -> list:
#     path = settings.base_dir / f'shared/abi/{name}.json'
#     with open(path) as f:
#         return json.load(f)


# ERC20_ABI = get_abi('erc20')
ETH_WEI = 1_000_000_000_000_000_000
ETH_GWEI = 1_000_000_000
# ETH_TOKENS = {
#     'usdt': {
#         'display': 'Tether USD',
#         'contract': w3.eth.contract(
#             '0xdAC17F958D2ee523a2206206994597C13D831ec7',
#             abi=ERC20_ABI
#         ),
#         'decimals': 10 ** 6  # decimals function in the contract
#     },
#     'shib': {
#         'display': 'Shiba INU',
#         'contract': w3.eth.contract(
#             '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
#             abi=ERC20_ABI
#         ),
#         'decimals': 10 ** 18
#     }
# }

# ETH_WALLET_COINS = {
#     f'{NetworkType.ethereum.value}_{k}': WalletCoin(
#         name=k,
#         display=v['display'],
#         network=NetworkType.ethereum,
#         in_wallet=0,
#         in_system=0,
#         contract=v['contract'].address,
#     )
#     for k, v in ETH_TOKENS.items()
# }

# ETH_GENERAL_COINS = {
#     f'{NetworkType.ethereum.value}_{k}': GeneralCoin(
#         name=k,
#         display=v['display'],
#         network=NetworkType.ethereum,
#         available=0,
#         total=0,
#     )
#     for k, v in ETH_TOKENS.items()
# }


async def transaction_status(tx: str | HexBytes) -> TransactionStatus:
    try:
        receipt = await w3.eth.get_transaction_receipt(tx)

        if receipt.status:
            return TransactionStatus.SUCCESS
        else:
            return TransactionStatus.FAILURE

    except TransactionNotFound:
        return TransactionStatus.UNKNOWN


async def update_wallet(wallet: WalletModel = None) -> WalletModel:
    eck = f'{NetworkType.ethereum.value}_eth'

    general = await general_get()
    if eck not in general.coins:
        general.coins[eck] = GeneralCoin(
            name='eth',
            display='Ether',
            network=NetworkType.ethereum,
            available=0,
            total=0
        ).dict()
        # general.coins.update(ETH_GENERAL_COINS)
        await general_update(coins=general.coins)

    if wallet is None:
        eth_acc = w3.eth.account.create()
        coins = {eck: WalletCoin(
            name='eth',
            display='Ether',
            network=NetworkType.ethereum,
            in_wallet=0,
            in_system=0,
        ).dict()}
        # coins.update(ETH_WALLET_COINS)

        accounts = {
            NetworkType.ethereum: WalletAccount(
                network=NetworkType.ethereum,
                pk=eth_acc.key.hex(),
                addr=eth_acc.address
            ).dict()
        }

        return WalletModel(
            wallet_id=0,
            user_id=0,
            last_update=utc_now(),
            coins=coins,
            accounts=accounts,
        )

    eth_coin = wallet.coins.get(eck)
    if eth_coin is None:
        eth_acc = w3.eth.account.create()
        wallet.coins[eck] = WalletCoin(
            name='eth',
            display='Ether',
            network=NetworkType.ethereum,
            in_wallet=0,
            in_system=0,
            pk=eth_acc.key.hex(),
            addr=eth_acc.address
        ).dict()
        # wallet.coins.update(ETH_WALLET_COINS)
        return wallet

    eth_acc = w3.eth.account.from_key(eth_coin.pk)
    eth_balance = await w3.eth.get_balance(eth_acc.address)

    nonce = 0
    gas = 21000
    gas_price = w3.eth.gas_price

    if eth_balance - 1e5 > gas * gas_price:
        nonce = await w3.eth.get_transaction_count(eth_acc.address)
        td = {
            'from': eth_acc.address,
            'to': settings.eth_main_wallet,
            'value': eth_balance - (gas * gas_price),
            'nonce': nonce,
            'gas': gas,
            'gasPrice': gas_price,
        }
        nonce += 1
        st = eth_acc.sign_transaction(td)
        tx = w3.eth.send_raw_transaction(st.rawTransaction)

        wallet.coins[eck].in_system += td['value'] - settings.eth_main_fee
        wallet.coins[eck].in_wallet = 0

        general.coins[eck].total += td['value']
        general.coins[eck].available += settings.eth_main_fee

        await transaction_add(
            transaction_hash=tx.hex(),
            network=NetworkType.ethereum,
            sender=wallet.user_id,
            receiver=-1,
            status=TransactionStatus.UNKNOWN,
            amount=td['value'],
            last_update=utc_now(),
            timestamp=utc_now(),
        )

        await general_update(general.general_id, coins=general.coins)

    # for k, t in ETH_TOKENS.items():
    #     c = t['contract']
    #     token_balance = await c.functions.balanceOf(eth_acc.address).call()
    #
    #     if token_balance:
    #         coin.append(CoinModel(
    #             name=k,
    #             display=t['name'],
    #             balance=amount / t['decimals'],
    #             network='eth',
    #             contract=t['contract'].address,
    #         ))
    #
    # wallet.last_update = utc_now()
    # wallet.coin = coin

    return wallet


__all__ = [
    'ETH_WEI', 'ETH_GWEI',
    'update_wallet'
]
