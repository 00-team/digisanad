import React, { FC } from 'react'

import { WalletSvg } from 'icons'

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
            </div>
        </section>
    )
}

export default Withdraw
