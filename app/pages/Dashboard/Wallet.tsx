import React, { FC, useEffect } from 'react'

import { get_wallet } from 'api'
import { CoinSvg } from 'icons'

import { useAtom, useAtomValue } from 'jotai'
import { EthTokesKeys, ETH_TOKENS, TokenAtom, WalletAtom } from 'state'

import { NationalIdSvg } from 'icons/Dashboard/NationalId'

import './style/wallet.scss'

const Wallet: FC = () => {
    const [wallet, setWallet] = useAtom(WalletAtom)
    const token = useAtomValue(TokenAtom)

    useEffect(() => {
        // this should never be reached
        // but anyway
        if (!token) return

        if (wallet == null || wallet.next_update < Date.now()) {
            get_wallet(token).then(data => setWallet(data))
            return
        }
    }, [])

    if (wallet == null) {
        return (
            <section id='wallet' className='wallet-container'>
                <div className='section-header section_title'>کیف پول</div>
                <div className='wallet-wrapper'>
                    <span className='title'>درحال بارگذاری</span>
                </div>
            </section>
        )
    }

    return (
        <section id='wallet' className='wallet-container'>
            <div className='section-header section_title'>کیف پول</div>
            <div className='wallet-wrapper'>
                <div className='rows'>
                    <Row
                        Svg={CoinSvg}
                        data={wallet.eth_balance.toLocaleString()}
                        holder={'مقدار اتریوم'}
                    />
                    <Row
                        Svg={NationalIdSvg}
                        data={
                            <input
                                className='addr'
                                value={wallet.eth_addr}
                                onChange={() => {}}
                            />
                        }
                        holder={'آدرس اتریوم'}
                    />
                    {Object.entries(wallet.eth_tokens).map(
                        ([token_key, token_balance]) => {
                            let D = ETH_TOKENS[token_key as EthTokesKeys]
                            return (
                                <Row
                                    holder={D.name}
                                    Svg={D.logo}
                                    data={token_balance}
                                />
                            )
                        }
                    )}
                </div>
            </div>
        </section>
    )
}

interface RowProps {
    Svg: Icon
    holder: string
    data: React.ReactNode
    className?: string
}

const Row: FC<RowProps> = ({ data, holder, Svg, className }) => {
    return (
        <div className={`row title ${className && className}`}>
            <div className='nickname-title title  row-title'>
                <div className='icon'>
                    <Svg size={25} />
                </div>
                {holder}
            </div>
            <div className='row-data '>{data}</div>
        </div>
    )
}

export default Wallet
