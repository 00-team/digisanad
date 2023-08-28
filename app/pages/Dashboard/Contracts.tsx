import React, { FC, useEffect, useState } from 'react'

import axios from 'axios'
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

    const add_contract = async () => {
        const response = await axios.post(
            '/api/contracts/',
            {
                title: 'قرار داد جدید',
                data: {},
            },
            { headers: { Authorization: 'Bearer ' + token } }
        )
        navigate('/dashboard/contract/' + response.data.id)
    }

    useEffect(() => {
        fetch_contracts()
    }, [page])

    useEffect(() => console.log(state), [state])

    return (
        <section className='contract-list'>
            <div className='contracts'>
                {state.map(s => (
                    <div className='contract' key={s.contract_id}>
                        <h2 className='title'>{s.title}</h2>
                        <span>وضعیت: {CSMAP[s.stage]} </span>
                        <button
                            onClick={() =>
                                navigate('/dashboard/contract/' + s.contract_id)
                            }
                        >
                            نمایش
                        </button>
                    </div>
                ))}
            </div>

            <div className='actions'>
                <button style={{ '--color': 'green' }} onClick={add_contract}>
                    قرارداد جدید
                </button>
                <div className='pagination'>
                    <button
                        onClick={() =>
                            navigate('/dashboard/contracts/' + (page + 1))
                        }
                    >
                        صفحه بعدی
                    </button>
                    <button
                        disabled={page == 0}
                        onClick={() =>
                            navigate('/dashboard/contracts/' + (page - 1))
                        }
                    >
                        صفحه قبلی
                    </button>
                </div>
            </div>
        </section>
    )
}

export { Contracts }
