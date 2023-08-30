import React, { FC, useEffect, useState } from 'react'

import axios from 'axios'
import { CallenderIcon, CoinIcon, UnknownIcon } from 'icons'
import { UserPublic } from 'pages/schema/types'
import { useParams } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { TokenAtom } from 'state'

import './style/transactions.scss'

type TransactionModel = {
    transaction_id: number

    transaction_hash: string | null

    network: 'eth' | 'btc' | 'xtz'
    coin_name: string

    sender: UserPublic | 'system' | null
    receiver: UserPublic | 'system' | null
    amount: number
    fee: number
    status: 'unknown' | 'success' | 'failure'
    next_update: number

    timestamp: number
}

const Transactions: FC = () => {
    const { pid } = useParams()
    let page = parseInt(pid || '0') || 0
    const token = useAtomValue(TokenAtom)
    const [data, setData] = useState<TransactionModel[]>([])

    const fetch_transactions = async () => {
        try {
            const response = await axios.get(
                '/api/transactions/?page=' + page,
                {
                    headers: { Authorization: 'Bearer ' + token },
                }
            )

            setData(response.data)
        } catch (error) {
            HandleError(error)
        }
    }

    useEffect(() => {
        fetch_transactions()
    }, [])

    return (
        <section className='transactions-container'>
            <h2 className='section-header section_title'>تراکنش های من </h2>
            <div className='transactions-wrapper'>
                {data.map(t => (
                    <TransactionCard {...t} type={'deposit'} />
                ))}
            </div>
        </section>
    )
}

type TransactionCardProps = TransactionModel & {
    type: 'deposit' | 'withdraw'
}

const TransactionCard: FC<TransactionCardProps> = ({ type, amount }) => {
    type titleTypes = {
        [k in typeof type]: string
    }
    const titles: titleTypes = {
        deposit: 'واریز',
        withdraw: 'برداشت',
    }

    return (
        <div className={`transaction-card ${type}`}>
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
                    <div className='data'>{amount}</div>
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

export { Transactions }
