import React, { FC, useEffect } from 'react'

import { get_wallet } from 'api'
import { CoinSvg } from 'icons'

import { useAtom, useAtomValue } from 'jotai'
import { Networks_List, TokenAtom, WalletAtom } from 'state'

import { Loading } from 'components'

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
                <h2 className='section-header section_title'>کیف پول</h2>
                <div className='wallet-wrapper'>
                    <Loading style={{ height: '50vh' }} />
                </div>
            </section>
        )
    }

    return (
        <section id='wallet' className='wallet-container'>
            <h2 className='section-header section_title'>کیف پول</h2>
            <div className='wallet-wrapper'>
                <div className='rows'>
                    {/* <Row
                        Svg={CoinSvg}
                        data={wallet.coins.in_wallet.toLocaleString()}
                        holder={'مقدار اتریوم'}
                    /> */}
                    {wallet.addrs.map((addr, index) => {
                        const coinAddr = Networks_List[addr.network]
                        return (
                            <Row
                                key={index}
                                Svg={coinAddr.logo}
                                data={
                                    <input
                                        className='addr'
                                        value={addr.addr}
                                        onChange={() => {}}
                                    />
                                }
                                holder={coinAddr.name}
                            />
                        )
                    })}
                    {wallet.coins.map((coin, index) => {
                        return (
                            <Row
                                key={index}
                                holder={coin.name}
                                Svg={CoinSvg}
                                data={coin.in_wallet}
                            />
                        )
                    })}
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
