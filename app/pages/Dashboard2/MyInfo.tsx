import React from 'react'

import { CountAnim } from '@00-team/utils'

import './style/myinfo.scss'

const contractSvg = require('../../static/Dashboard/myInfo/contract.svg')
const transactionSvg = require('../../static/Dashboard/myInfo/transaction.svg')

const MyInfo = () => {
    return (
        <section className='myinfo-container'>
            <div className='section-header section_title'>
                <span>اطلاعات من</span>
            </div>

            <div className='myinfo-columns'>
                <div className='myinfo-column'>
                    <object
                        className='svg-container'
                        data={transactionSvg}
                    ></object>
                    <div className='content title_hero'>
                        <div className='holder'> تراکنش های من </div>
                        <div className='data'>
                            <CountAnim end={123} />
                        </div>
                    </div>
                </div>
                <div className='myinfo-column'>
                    <object
                        className='svg-container'
                        data={contractSvg}
                    ></object>
                    <div className='content title_hero'>
                        <div className='holder'>قرارداد های من</div>
                        <div className='data'>
                            <CountAnim end={123} />
                        </div>
                    </div>
                </div>

                <div className='myinfo-column'>
                    <object
                        className='svg-container'
                        data={transactionSvg}
                    ></object>
                    <div className='content title_hero'>
                        <div className='holder'> تراکنش های من </div>
                        <div className='data'>
                            <CountAnim end={123} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyInfo
