import React, { FC, useEffect, useState } from 'react'

import axios from 'axios'
import { CallenderIcon, EditIcon, InviteIcon } from 'icons'
import { useNavigate, useParams } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { TokenAtom } from 'state'

import './style/contracts.scss'

const CSMAP = {
    draft: 'در حال تکمیل',
    action: 'در حال انجام',
    done: 'انجام شده',
} as const

type ContractModel = {
    contract_id: number
    creator: number
    title: string
    stage: keyof typeof CSMAP
    start_date: number
    finish_date: number
    pepper: string
    disable_invites: boolean
}

const Contracts: FC = () => {
    const { pid } = useParams()
    let page = parseInt(pid || '0') || 0
    const navigate = useNavigate()
    const token = useAtomValue(TokenAtom)

    const [state, setState] = useState<ContractModel[]>([])

    const fetch_contracts = async () => {
        const response = await axios.get('/api/contracts/?page=' + page, {
            headers: { Authorization: 'Bearer ' + token },
        })
        setState(response.data)
    }

    const getTime = (timestamp: number) => {
        let offset = Math.abs(new Date().getTimezoneOffset()) * 60

        return (timestamp + offset) * 1000
    }

    useEffect(() => {
        fetch_contracts()
    }, [page])

    return (
        <section className='contract-list'>
            <div className='contracts'>
                {state.length >= 1 ? (
                    state.map(s => (
                        <div
                            className='contract title_smaller'
                            key={s.contract_id}
                        >
                            <h2 className='title'>{s.title}</h2>
                            <div className='contract-details title_smaller'>
                                <div className='contract-detail'>
                                    <div className='holder'>
                                        <EditIcon size={20} />
                                        شماره قرارداد:
                                    </div>
                                    <div className='data'>{s.contract_id}</div>
                                </div>
                                <div className='contract-detail'>
                                    <div className='holder'>
                                        <CallenderIcon size={20} />
                                        تاریخ ساخت:
                                    </div>
                                    <div className='data'>
                                        {new Date(
                                            getTime(s.start_date)
                                        ).toLocaleDateString('fa-IR')}
                                    </div>
                                </div>
                                <div className='contract-detail'>
                                    <div className='holder'>
                                        <InviteIcon size={20} />
                                        قابلیت دعوت:
                                    </div>
                                    <div className='data'>
                                        {s.disable_invites ? (
                                            <span
                                                style={{
                                                    color: 'var(--alert-error)',
                                                }}
                                            >
                                                ندارد
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    color: '#008149',
                                                }}
                                            >
                                                دارد
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    navigate(
                                        '/dashboard/contract/' + s.contract_id
                                    )
                                }
                            >
                                نمایش
                            </button>
                        </div>
                    ))
                ) : (
                    <h3 className='section_title contracts-empty'>
                        قراردادی برای نمایش وجود ندارد!
                    </h3>
                )}
            </div>

            <div className='actions title_smaller'>
                <div className='pagination'>
                    <button
                        disabled={page == 0}
                        onClick={() =>
                            navigate('/dashboard/contracts/' + (page - 1))
                        }
                    >
                        صفحه قبلی
                    </button>
                    <button
                        onClick={() =>
                            navigate('/dashboard/contracts/' + (page + 1))
                        }
                    >
                        صفحه بعدی
                    </button>
                </div>
            </div>
        </section>
    )
}

export { Contracts }
