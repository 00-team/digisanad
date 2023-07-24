import React, { FC } from 'react'

import './style/transactions.scss'

const Transactions: FC = () => {
    return (
        <section className='transactions-container'>
            <h2 className='section-header section_title'>کیف پول</h2>
            <div className='transactions-wrapper'></div>
        </section>
    )
}

export default Transactions
