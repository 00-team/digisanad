import React, { FC, HTMLAttributes } from 'react'

import { CallenderIcon, CoinIcon, UnknownIcon } from 'icons'

import './style/transactions.scss'

const Transactions: FC = () => {
    return (
        <section className='transactions-container'>
            <h2 className='section-header section_title'>تراکنش های من </h2>
            <div className='transactions-wrapper'>
                <TransactionCard type='deposit' />
                <TransactionCard type='withdraw' />
                <TransactionCard type='deposit' />
                <TransactionCard type='withdraw' />
                <TransactionCard type='deposit' />
                <TransactionCard type='withdraw' />
            </div>
        </section>
    )
}

interface TransactionCardProps extends HTMLAttributes<HTMLDivElement> {
    type: 'deposit' | 'withdraw'
}

const TransactionCard: FC<TransactionCardProps> = ({ type, ...attr }) => {
    type titleTypes = {
        [k in typeof type]: string
    }
    const titles: titleTypes = {
        deposit: 'واریز',
        withdraw: 'برداشت',
    }

    return (
        <div className={`transaction-card ${type}`} {...attr}>
            <h3 className='card-title title'>{titles[type]}</h3>
            <div className='datas'>
                <div className='row title_small'>
                    <div className='holder-wrapper'>
                        <div className='icon'>
                            <CallenderIcon size={25} />
                        </div>
                        <div className='holder '>تاریخ</div>
                    </div>
                    <div className='data'>1400/9/9</div>
                </div>
                <div className='row title_small'>
                    <div className='holder-wrapper'>
                        <div className='icon'>
                            <CoinIcon size={25} />
                        </div>
                        <div className='holder '>مقدار</div>
                    </div>
                    <div className='data'>0.1254</div>
                </div>
                <div className='row title_small'>
                    <div className='holder-wrapper'>
                        <div className='icon'>
                            <UnknownIcon size={25} />
                        </div>
                        <div className='holder '>کوین</div>
                    </div>
                    <div className='data'>اتریوم</div>
                </div>
            </div>
            <div></div>
        </div>
    )
}

export default Transactions
