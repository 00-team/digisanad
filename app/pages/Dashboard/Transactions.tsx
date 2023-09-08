import React, { FC, useEffect, useState } from 'react'

import { fetch_price } from 'api'
import axios from 'axios'
import { CallenderIcon, CoinIcon, UnknownIcon } from 'icons'
import { UserPublic } from 'pages/schema/types'
import { useParams } from 'react-router-dom'

import { useAtom, useAtomValue } from 'jotai'
import { PriceAtom, PriceModel, TokenAtom, UserAtom, UserModel } from 'state'

import './style/transactions.scss'

type SR = UserPublic | 'system' | 'contract' | null
type TransactionModel = {
    transaction_id: number
    transaction_hash: string | null
    sender: SR
    receiver: SR
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
    const user = useAtomValue(UserAtom)
    const [data, setData] = useState<TransactionModel[]>([])

    const [price, setPrice] = useAtom(PriceAtom)

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
        if (!token) return

        fetch_transactions()
        fetch_price(token).then(res => {
            if (res) setPrice(res)
        })
    }, [token])

    return (
        <section className='transactions-container'>
            <h2 className='section-header section_title'>تراکنش های من </h2>
            <div className='transactions-wrapper'>
                {data.map((t, i) => (
                    <TransactionCard key={i} {...t} price={price} user={user} />
                ))}
            </div>
        </section>
    )
}

type CardProps = TransactionModel & {
    price: PriceModel
    user: UserModel
}

const TransactionCard: FC<CardProps> = props => {
    const { amount, sender, receiver, price } = props

    const [state, setState] = useState({ title: '', type: '' })

    useEffect(() => {
        console.log(amount, sender, receiver, price)
        if (!sender || !receiver) return

        if (sender == 'system') {
            setState({ title: 'برداشت', type: 'withdraw' })
        } else if (receiver == 'system') {
            setState({ title: 'واریز', type: 'deposit' })
        } else {
            // from user to another user
            setState({ title: 'انتقال', type: 'move' })
        }
    }, [])

    return (
        <div className={`transaction-card ${state.type}`}>
            <h3 className='card-title title'>{state.title}</h3>
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
                        <div className='holder '>مقدار به اتر</div>
                    </div>
                    <div className='data'>
                        {(amount / 1e9).toLocaleString()}
                    </div>
                </div>
                <div className='row title_small'>
                    <div className='holder-wrapper'>
                        <div className='icon'>
                            <CoinIcon size={25} />
                        </div>
                        <div className='holder '>مقدار به ریال</div>
                    </div>
                    <div className='data'>
                        {amount
                            ? (
                                  (amount / 1e9) *
                                  price.eth_usd *
                                  price.usd_irr
                              ).toLocaleString()
                            : 0}
                    </div>
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
