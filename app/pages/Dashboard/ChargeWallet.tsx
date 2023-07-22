import React, { FC, useState } from 'react'

import { CoinSvg, MinusSvg, PlusSvg } from 'icons'

import { Submit } from 'components'

import './style/chargewallet.scss'

// const mellatImg = require('../../static/Dashboard/chrageWallet/mellat.png')
// const ansarImg = require('../../static/Dashboard/chrageWallet/ansar.png')
// const keshavarziImg = require('../../static/Dashboard/chrageWallet/keshavarzi.png')
// const maskanImg = require('../../static/Dashboard/chrageWallet/maskan.png')
// const meliImg = require('../../static/Dashboard/chrageWallet/meli.png')
// const refahImg = require('../../static/Dashboard/chrageWallet/refah.png')
//
// const SUPPORTED_BANKS = [
//     {
//         img: mellatImg,
//         name: 'بانک ملت',
//     },
//     {
//         img: ansarImg,
//         name: 'بانک انصار',
//     },
//     {
//         img: keshavarziImg,
//         name: 'بانک کشاورزی',
//     },
//     {
//         img: maskanImg,
//         name: 'بانک مسکن',
//     },
//     {
//         img: meliImg,
//         name: 'بانک ملی',
//     },
//     {
//         img: refahImg,
//         name: 'بانک رفاه',
//     },
// ]

const ChargeWallet: FC = () => {
    const [ChargeAmount, setChargeAmount] = useState<number>(0)
    return (
        <section id='chargewallet' className='chargewallet-container'>
            <div className='section-header section_title'>افزایش موجودی</div>
            <div className='chargewallet-wrapper'>
                <div className='supported-banks-wrapper title'>
                    <div className='banks-header'>
                        <span>بانک های قابل برداشت</span>
                    </div>
                    <BanksSlider />
                </div>
                <div className='charge-amount'>
                    <div className='amount-holder title'>
                        <div className='icon'>
                            <CoinSvg size={25} />
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
                            <PlusSvg size={25} />
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
                            <MinusSvg size={25} />
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

const BanksSlider: FC = () => {
    // const [ActiveBank, setActiveBank] = useState(1)

    // useEffect(() => {
    //     const inverval = setInterval(() => {
    //         setActiveBank(value => {
    //             if (value + 1 >= SUPPORTED_BANKS.length) {
    //                 return 1
    //             }
    //             return value + 1
    //         })
    //     }, 3000)
    //
    //     return () => clearInterval(inverval)
    // }, [])

    return (
        <div className='banks-slider'>
            {/* SUPPORTED_BANKS.map(({ name, img }, index) => {
                const returnClass = (): string => {
                    if (ActiveBank === index) return 'active'
                    if (ActiveBank - 1 === index) return 'prev'
                    if (ActiveBank + 1 === index) return 'next'
                    if (
                        ActiveBank === SUPPORTED_BANKS.length - 1 &&
                        index === 0
                    )
                        return 'next'
                    return ''
                }
                return (
                    <BankCard
                        key={index}
                        cardImg={img}
                        cardTitle={name}
                        className={returnClass()}
                    />
                )
            }) */}
        </div>
    )
}

interface BankCardProps {
    cardTitle: string
    cardImg: string
    className: string
}

const BankCard: FC<BankCardProps> = ({ cardTitle, cardImg, className }) => {
    return (
        <div className={`bank-card ${className && className}`}>
            <img className='bank-img' loading={'lazy'} src={cardImg} />
            <div className='bank-name'> {cardTitle} </div>
        </div>
    )
}
BankCard

export default ChargeWallet
