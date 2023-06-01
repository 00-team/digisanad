import { FC } from 'react'

import { ShibaSvg, TetherSvg } from 'icons'

type EthTokesKeys = 'usdt' | 'shib'
type EthTokens = {
    [k in EthTokesKeys]: {
        name: string
        logo: FC
    }
}

const ETH_TOKENS: EthTokens = {
    usdt: {
        name: 'تتر',
        logo: TetherSvg,
    },
    shib: {
        name: 'شیبا',
        logo: ShibaSvg,
    },
} as const

type Wallet = {
    wallet_id: number
    user_id: number
    next_update: number
    eth_addr: string
    eth_balance: number
    eth_tokens: { [k in EthTokesKeys]: number }
}

export { Wallet as WalletModel, ETH_TOKENS, EthTokesKeys }
