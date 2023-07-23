import { FC } from 'react'

import { BitcoinSvg, EthereumSvg, UnknownSvg } from 'icons'

type NetworkTypes = 'eth' | 'btc' | 'xtz'
type Networks = {
    [k in NetworkTypes]: {
        name: string
        logo: FC
    }
}

const Networks_List: Networks = {
    eth: {
        name: 'اتریوم',
        logo: EthereumSvg,
    },
    btc: {
        name: 'بیتکوین',
        logo: BitcoinSvg,
    },
    xtz: {
        name: 'تزوس',
        logo: UnknownSvg,
    },
} as const

type Wallet = {
    wallet_id: number
    user_id: number
    next_update: number

    coins: {
        name: string
        display: string
        network: NetworkTypes
        in_wallet: number
        in_system: number
        hidden: boolean
    }[]
    addrs: {
        network: NetworkTypes
        addr: string
    }[]

    // eth_addr: string
    // eth_balance: number
    // eth_tokens: { [k in EthTokesKeys]: number }
}

export { Wallet as WalletModel, Networks_List }
