import React, { FC, useEffect } from 'react'

import { CoinSvg } from 'icons'

import { useAtom } from 'jotai'
import { WalletAtom } from 'state'

import { Submit } from 'components'

import './style/wallet.scss'

const Wallet: FC = () => {
    const [wallet, setWallet] = useAtom(WalletAtom)
    // const [ChargeAmount, setChargeAmount] = useState<number>(0)
    //
    useEffect(() => {
        console.log('in wallet', wallet)
        setWallet
    }, [])

    return (
        <section id='chargewallet' className='chargewallet-container'>
            <div className='section-header section_title'>افزایش موجودی</div>
            <div className='chargewallet-wrapper'>
                <div className='supported-banks-wrapper title'>
                    <div className='banks-header'>
                        <span>بانک های قابل برداشت</span>
                    </div>
                </div>
                <div className='charge-amount'>
                    <div className='amount-holder title'>
                        <div className='icon'>
                            <CoinSvg />
                        </div>
                        <div className='holder'>مقدار واریزی</div>
                    </div>
                    {/*
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
                */}
                </div>
                <div className='submit-charge'>
                    <Submit className='title_small' title='پرداخت' />
                </div>
            </div>
        </section>
    )
}

export default Wallet
