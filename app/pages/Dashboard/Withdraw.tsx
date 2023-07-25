import React, { FC } from 'react'

import { CoinSvg, WalletSvg } from 'icons'

import { Submit } from 'components'

import './style/withdraw.scss'

const Withdraw: FC = () => {
    return (
        <section className='withdraw-container'>
            <h2 className='section-header section_title'>برداشت موجودی </h2>
            <div className='withdraw-wrapper'>
                <div className='current-container'>
                    <div className='wallet-icon'>
                        <WalletSvg size={35} />
                    </div>
                    <div className='wallet-data title'>
                        <div className='holder'>موجودی شما:</div>
                        <div className='data'>0.124124</div>
                    </div>
                </div>
                <div className='wallet-options'>
                    <div className='wallet-option title_smaller'>
                        <h3 className=' option-title'>
                            <WalletSvg size={25} />
                            <div className='holder'>آدرس کیف پول مقصد</div>
                        </h3>
                        <input
                            className='option-input'
                            type='text'
                            maxLength={1024}
                        />
                    </div>
                    <div className='wallet-option title_smaller'>
                        <h3 className=' option-title'>
                            <CoinSvg size={25} />
                            <div className='holder'>مقدار برداشتی</div>
                        </h3>
                        <input
                            className='option-input'
                            type='text'
                            maxLength={1024}
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
