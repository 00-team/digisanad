import React, { FC, ReactNode, Suspense, useEffect, useState } from 'react'

import { fetch_price } from 'api'
import { CoinIcon, EthereumIcon, WalletIcon, CallenderIcon } from 'icons'

import { useAtomValue } from 'jotai'
import { PriceModel, TokenAtom, UserAtom } from 'state'

import './style/wallet.scss'

const Wallet: FC = () => {
    const user = useAtomValue(UserAtom)
    const token = useAtomValue(TokenAtom)
    const [price, setPrice] = useState<PriceModel>({
        next_update: 0,
        usd_irr: 0,
        eth_usd: 0,
    })

    useEffect(() => {
        if (!token) return

        fetch_price(token).then(res => {
            if (res) setPrice(res)
        })
    }, [token])

    // if (wallet == null) {
    //     return (
    //         <section id='wallet' className='wallet-container'>
    //             <h2 className='section-header section_title'>کیف پول</h2>
    //             <div className='wallet-wrapper'>
    //                 <Loading style={{ height: '50vh' }} />
    //             </div>
    //         </section>
    //     )
    // }

    const utc_to_irtime = (timestamp: number) => {
        let offset = new Date().getTimezoneOffset() * 60

        return new Date((timestamp - offset) * 1000).toLocaleTimeString('fa-IR')
    }

    return (
        <Suspense fallback={'fallback'}>
            <section id='wallet' className='wallet-container'>
                <h2 className='section-header section_title'>کیف پول</h2>
                <div className='wallet-wrapper'>
                    <div className='rows'>
                        <Row
                            Icon={EthereumIcon}
                            data={price.eth_usd}
                            holder='eth_usd'
                        />
                        <Row
                            Icon={EthereumIcon}
                            data={price.usd_irr}
                            holder='usd_irr'
                        />
                        <Row
                            Icon={EthereumIcon}
                            data={price.next_update}
                            holder='next updat'
                        />
                        <Row
                            Icon={EthereumIcon}
                            data={(user.w_eth_in_sys / 1e18).toLocaleString()}
                            holder='موجودی'
                        />
                        <Row
                            Icon={CoinIcon}
                            data={(user.w_eth_in_acc / 1e18).toLocaleString()}
                            holder='موجودی غیرقابل دسترسی'
                        />
                        <Row
                            Icon={CallenderIcon}
                            data={utc_to_irtime(user.w_last_update)}
                            holder='آخرین بروزرسانی'
                        />
                        <Row
                            Icon={WalletIcon}
                            data={
                                <input
                                    className='addr'
                                    value={user.w_eth_addr}
                                    onChange={() => {}}
                                />
                            }
                            holder='آدرس کیف پول اتریوم شما'
                        />
                    </div>
                </div>
            </section>
        </Suspense>
    )
}

type RowProps = {
    Icon: Icon
    holder: string
    data: ReactNode
    className?: string
}

const Row: FC<RowProps> = ({ data, holder, Icon, className = '' }) => {
    return (
        <div className={`row title ${className}`}>
            <div className='nickname-title title  row-title'>
                <div className='icon'>
                    <Icon size={25} />
                </div>
                {holder}
            </div>
            <div className='row-data '>{data}</div>
        </div>
    )
}

export { Wallet }
