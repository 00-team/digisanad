import TetherLogo from 'static/token/tether.svg'

type EthTokesKeys = 'usdt'
type EthTokens = {
    [k in EthTokesKeys]: {
        name: string
        logo: string
    }
}

const ETH_TOKENS: EthTokens = {
    usdt: {
        name: 'Tether USD (USDT)',
        logo: TetherLogo,
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
