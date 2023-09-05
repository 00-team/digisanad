
# import json
import logging

from aiohttp.client_exceptions import ClientResponseError
# from eth_account.signers.local import LocalAccount
from web3.exceptions import TransactionNotFound
from web3.types import HexBytes

from db.general import general_get, general_update
from db.models import TransactionStatus, UserModel, UserTable
from db.transaction import transaction_add
from db.user import user_update
from shared import ETH_ACC, settings, w3
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


async def update_wallet(user: UserModel) -> UserModel:
    general = await general_get()

    if not user.w_eth_pk:
        eth_acc = w3.eth.account.create()
        user.w_eth_pk = eth_acc.key.hex()
        user.w_eth_addr = eth_acc.address
    else:
        eth_acc = w3.eth.account.from_key(user.w_eth_pk)

    if not user.w_eth_addr:
        user.w_eth_addr = eth_acc.address

    try:
        eth_balance = await w3.eth.get_balance(eth_acc.address)

        nonce = 0
        gas = 21000
        gas_price = await w3.eth.gas_price

        if eth_balance - 1e5 > gas * gas_price:
            nonce = await w3.eth.get_transaction_count(eth_acc.address)
            td = {
                'from': eth_acc.address,
                'to': ETH_ACC.address,
                'value': eth_balance - (gas * gas_price),
                'nonce': nonce,
                'gas': gas,
                'gasPrice': gas_price,
            }
            nonce += 1
            st = eth_acc.sign_transaction(td)
            tx = await w3.eth.send_raw_transaction(st.rawTransaction)

            user.w_eth_in_sys += td['value'] - settings.eth_fee
            user.w_eth_in_acc = 0

            general.eth_total += td['value']
            general.eth_available += settings.eth_fee

            await transaction_add(
                transaction_hash=tx.hex(),
                sender=user.user_id,
                receiver=-1,
                status=TransactionStatus.UNKNOWN,
                amount=td['value'],
                fee=settings.eth_fee,
                last_update=utc_now(),
                timestamp=utc_now(),
            )

            await general_update(
                eth_total=general.eth_total,
                eth_available=general.eth_available
            )
    except TimeoutError:
        logging.warn('timeout error')
    except ClientResponseError as e:
        logging.exception(e)
        logging.error(e.message)

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

    user.w_last_update = utc_now()

    await user_update(
        UserTable.user_id == user.user_id,
        w_last_update=user.w_last_update,
        w_eth_in_sys=user.w_eth_in_sys,
        w_eth_in_acc=user.w_eth_in_acc,
        w_eth_pk=user.w_eth_pk,
        w_eth_addr=user.w_eth_addr
    )

    return user


__all__ = [
    'ETH_WEI', 'ETH_GWEI',
    'update_wallet'
]
