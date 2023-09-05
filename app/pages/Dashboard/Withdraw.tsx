import React, { FC } from 'react'

import { CoinIcon, WalletIcon } from 'icons'

import { useAtomValue } from 'jotai'
import { UserAtom } from 'state'

import { Submit } from 'components'

import './style/withdraw.scss'

const Withdraw: FC = () => {
    const user = useAtomValue(UserAtom)

    // if (wallet == null) {
    //     return (
    //         <section id='wallet' className='withdraw-container'>
    //             <h2 className='section-header section_title'>برداشت موجودی </h2>
    //             <div className='withdraw-wrapper'>
    //                 <Loading style={{ height: '50vh' }} />
    //             </div>
    //         </section>
    //     )
    // }
    return (
        <section className='withdraw-container'>
            <h2 className='section-header section_title'>برداشت موجودی </h2>
            <div className='withdraw-wrapper'>
                <div className='current-container'>
                    <div className='wallet-icon'>
                        <WalletIcon size={35} />
                    </div>
                    <div className='wallet-data title'>
                        <div className='holder'>موجودی شما:</div>
                        <div className='data'>{user.w_eth_in_sys}</div>
                    </div>
                </div>
                <div className='wallet-options'>
                    <div className='wallet-option title_smaller'>
                        <h3 className=' option-title'>
                            <WalletIcon size={25} />
                            <div className='holder'>آدرس کیف پول مقصد</div>
                        </h3>
                        <input
                            className='option-input'
                            type='text'
                            maxLength={1024}
                        />
                    </div>
                    {/*<div className='wallet-option coin-options title_smaller'>
                        <h3 className=' option-title'>
                            <UnknownIcon size={25} />
                            <div className='holder'>کوین برداشتی</div>
                        </h3>
                        <Select
                            defaultOpt={{
                                value: wallet.coins[0]?.name,
                                label: wallet.coins[0]?.display || '',
                            }}
                            options={wallet.coins.map(
                                (coin): Option => ({
                                    value: coin.name,
                                    label: coin.display,
                                })
                            )}
                        />
                    </div>
                    <div className='wallet-option coin-options title_smaller'>
                        <h3 className=' option-title'>
                            <UnknownIcon size={25} />
                            <div className='holder'>شبکه</div>
                        </h3>
                        <Select
                            defaultOpt={{
                                value: wallet.coins[0]?.network,
                                label: wallet.coins[0]?.network || '',
                            }}
                            options={wallet.coins.map(
                                (coin): Option => ({
                                    value: coin.network,
                                    label: coin.network,
                                })
                            )}
                        />
                    </div>

*/}
                    <div className='wallet-option title_smaller'>
                        <h3 className=' option-title'>
                            <CoinIcon size={25} />
                            <div className='holder'>مقدار برداشتی</div>
                        </h3>
                        <input
                            className='option-input'
                            type='text'
                            maxLength={1024}
                            placeholder={`حداکثر: ${user.w_eth_in_sys}`}
                        />
                    </div>
                </div>
                <div className='submit-btn'>
                    <Submit className='title_small' title='برداشت' />
                </div>
            </div>
        </section>
    )
}

export { Withdraw }
