import React, { Dispatch, SetStateAction, FC, useEffect, useState } from 'react'

import axios from 'axios'
import { SchemaData } from 'pages/schema/types'
import { useNavigate, useParams } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { TokenAtom } from 'state'

import './style/contract.scss'

const CSMAP = {
    draft: 'در حال تکمیل',
    action: 'در حال انجام',
    done: 'انجام شده',
} as const

type SchemaModel = {
    schema_id: number
    draft: boolean
    title: string
    description: string
    data: SchemaData
    creator: number
}

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

type Parties = {
    user_id: number
    phone: string
    first_name: string
    last_name: string
}[]

type State = ContractModel & {
    data: SchemaData
    parties: Parties
    page: number
    need_schema: boolean
}

const Contract: FC = () => {
    const { contract_id } = useParams()
    const navigate = useNavigate()
    const token = useAtomValue(TokenAtom)

    const [state, setState] = useState<State>({
        title: '',
        stage: 'draft',
        data: {
            pages: [],
            fields: {},
        },
        page: 0,
        contract_id: -1,
        pepper: '',
        creator: -1,
        parties: [],
        start_date: 0,
        finish_date: 0,
        disable_invites: true,
        need_schema: true,
    })
    const update = () => setState(s => ({ ...s }))
    const updateState = (v: Partial<State>) => setState(s => ({ ...s, ...v }))

    const fetch_contract = async () => {
        try {
            const response = await axios.get(`/api/contracts/${contract_id}/`, {
                headers: { Authorization: 'Bearer ' + token },
            })

            if (response.status != 200) {
                return navigate('/dashboard/contracts/')
            }

            try {
                let cdata = response.data.data
                response.data.need_schema =
                    !Object.keys(cdata).length ||
                    ('fields' in cdata && !Object.keys(cdata).length) ||
                    ('pages' in cdata && !cdata.pages.length)
            } catch {}

            updateState(response.data)
        } catch {
            navigate('/dashboard/contracts/')
        }
    }

    useEffect(() => {
        if (!contract_id) return navigate('/dashboard/contracts/')
        let cid = parseInt(contract_id)
        if (isNaN(cid)) return navigate('/dashboard/contracts/')

        fetch_contract()
    }, [contract_id])

    update
    state

    if (state.contract_id == -1) return <></>

    // if (state.need_schema)
    //     return <SelectSchema state={state} setState={setState} />
    SelectSchema

    console.log(state)

    return <div>{state.title}</div>
}

type CommonProps = {
    state: State
    setState: Dispatch<SetStateAction<State>>
}

const SelectSchema: FC<CommonProps> = ({ setState }) => {
    const token = useAtomValue(TokenAtom)
    const [page, setPage] = useState(0)
    const [max_page, setMaxPage] = useState(-1)
    const [schemas, setSchemas] = useState<SchemaModel[]>([])

    const fetch_schemas = async (page: number) => {
        try {
            const response = await axios.get(`/api/schemas/?page=${page}`, {
                headers: { Authorization: 'Bearer ' + token },
            })

            if (page && !response.data.length) {
                setPage(page - 1)
                setMaxPage(page - 1)
                return
            }

            setSchemas(response.data)
        } catch {}
    }

    useEffect(() => {
        fetch_schemas(page)
    }, [page])

    return (
        <div className='schema-list'>
            <h1 className='title'>قالب قرار خود را انتخاب کنید</h1>
            <div className='schemas'>
                {schemas.map(s => (
                    <div className='schema' key={s.schema_id}>
                        <h2 className='title'>{s.title}</h2>
                        <p>{s.description}</p>
                        <button
                            onClick={() =>
                                setState(ss => ({
                                    ...ss,
                                    data: s.data,
                                    title: s.title,
                                    need_schema: false,
                                }))
                            }
                        >
                            انتخاب
                        </button>
                    </div>
                ))}
            </div>
            <div className='actions'>
                <div className='pagination'>
                    <button
                        disabled={max_page == page}
                        onClick={() => setPage(s => s + 1)}
                    >
                        صفحه بعدی
                    </button>
                    <button
                        disabled={page == 0}
                        onClick={() => setPage(s => Math.max(0, s - 1))}
                    >
                        صفحه قبلی
                    </button>
                </div>
            </div>
        </div>
    )
}

export { Contract }
