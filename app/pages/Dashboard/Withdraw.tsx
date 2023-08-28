import React, { FC, useEffect } from 'react'

import { get_wallet } from 'api'
import { CoinIcon, UnknownIcon, WalletIcon } from 'icons'

import { useAtom, useAtomValue } from 'jotai'
import { TokenAtom, WalletAtom } from 'state'

import { Loading, Option, Select, Submit } from 'components'

import './style/withdraw.scss'

const Withdraw: FC = () => {
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

    useEffect(() => {
        console.log(wallet)
    }, [wallet])

    if (wallet == null) {
        return (
            <section id='wallet' className='withdraw-container'>
                <h2 className='section-header section_title'>برداشت موجودی </h2>
                <div className='withdraw-wrapper'>
                    <Loading style={{ height: '50vh' }} />
                </div>
            </section>
        )
    }
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
                        <div className='data'>{wallet.coins[0]?.in_wallet}</div>
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
                    <div className='wallet-option coin-options title_smaller'>
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
                    <div className='wallet-option title_smaller'>
                        <h3 className=' option-title'>
                            <CoinIcon size={25} />
                            <div className='holder'>مقدار برداشتی</div>
                        </h3>
                        <input
                            className='option-input'
                            type='text'
                            maxLength={1024}
                            placeholder={`حداکثر: ${wallet.coins[0]?.in_wallet}`}
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

export default Withdraw
