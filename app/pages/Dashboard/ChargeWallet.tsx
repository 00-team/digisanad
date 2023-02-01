import React, { FC } from 'react'

import './style/chargewallet.scss'

const ChargeWallet: FC = () => {
    return (
        <section className='changewallet-container'>
            <div className='section-header section_title'>شارژ کیف پول</div>
            <div className='changewallet-wrapper'>
                <div className='supported-banks-wrapper title'>
                    <div className='banks-header'>
                        <span>بانک های قابل برداشت</span>
                    </div>
                    <div className='banks-slider'></div>
                </div>
            </div>
        </section>
    )
}

export default ChargeWallet
