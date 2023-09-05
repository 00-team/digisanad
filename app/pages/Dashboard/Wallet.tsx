import React, { FC, ReactNode } from 'react'

import { CoinIcon, EthereumIcon, WalletIcon, CallenderIcon } from 'icons'

import { useAtomValue } from 'jotai'
import { UserAtom } from 'state'

import './style/wallet.scss'

const Wallet: FC = () => {
    const user = useAtomValue(UserAtom)
    // const token = useAtomValue(TokenAtom)

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
        <section id='wallet' className='wallet-container'>
            <h2 className='section-header section_title'>کیف پول</h2>
            <div className='wallet-wrapper'>
                <div className='rows'>
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
