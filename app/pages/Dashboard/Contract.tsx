import React, { FC, useEffect, useState } from 'react'

import axios from 'axios'
import { SchemaData } from 'pages/schema/types'
import { useNavigate, useParams } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { TokenAtom } from 'state'

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
        contract_id: 0,
        pepper: '',
        creator: -1,
        parties: [],
        start_date: 0,
        finish_date: 0,
        disable_invites: true,
    })
    const update = () => setState(s => ({ ...s }))
    const updateState = (v: Partial<State>) => setState(s => ({ ...s, ...v }))

    const fetch_contract = async () => {
        try {
            const response = await axios.get(`/api/contracts/${contract_id}/`, {
                headers: { Authorization: 'Bearer ' + token },
            })
            console.log(response)

            if (response.status != 200) {
                return navigate('/dashboard/contracts/')
            }

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

    return <div></div>
}

export { Contract }
