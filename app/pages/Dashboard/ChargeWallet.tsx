import React, { FC, useState } from 'react'

import { CoinSvg, MinusSvg, PlusSvg } from 'Icons'

import { Submit } from 'components'

import './style/chargewallet.scss'

const mellatImg = require('../../static/Dashboard/chrageWallet/mellat.png')

const ChargeWallet: FC = () => {
    const [ChargeAmount, setChargeAmount] = useState<number>(0)
    return (
        <section className='changewallet-container'>
            <div className='section-header section_title'>افزایش موجودی</div>
            <div className='changewallet-wrapper'>
                <div className='supported-banks-wrapper title'>
                    <div className='banks-header'>
                        <span>بانک های قابل برداشت</span>
                    </div>
                    <div className='banks-slider'>
                        <BankCard />
                    </div>
                </div>
                <div className='charge-amount'>
                    <div className='amount-holder title'>
                        <div className='icon'>
                            <CoinSvg />
                        </div>
                        <div className='holder'>مقدار واریزی</div>
                    </div>
                    <div className='amount-inp title_small'>
                        <div
                            className='option icon'
                            onClick={() =>
                                setChargeAmount(ChargeAmount + 10000)
                            }
                        >
                            <PlusSvg />
                        </div>
                        <input
                            inputMode={'numeric'}
                            placeholder='مقدار واریزی به تومان...'
                            value={Intl.NumberFormat().format(ChargeAmount)}
                            onChange={e => {
                                const value = e.target.value
                                if (/^\d+$/.test(value)) {
                                    setChargeAmount(parseInt(value))
                                }
                            }}
                        />
                        <div
                            className='option icon'
                            onClick={() =>
                                ChargeAmount - 10000 >= 0 &&
                                setChargeAmount(ChargeAmount - 10000)
                            }
                        >
                            <MinusSvg />
                        </div>
                    </div>
                </div>
                <div className='submit-charge'>
                    <Submit className='title_small' title='پرداخت' />
                </div>
            </div>
        </section>
    )
}

const BankCard: FC = () => {
    return (
        <div className='bank-card'>
            <img className='bank-img' src={mellatImg} />
            <div className='bank-name'>بانک ملت</div>
        </div>
    )
}

export default ChargeWallet
