import React, { FC, useEffect, useState } from 'react'

import axios from 'axios'
import { SchemaData } from 'pages/schema/types'
import { useNavigate, useParams } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { TokenAtom } from 'state'

import './style/schemas.scss'

type Schema = {
    schema_id: number
    draft: boolean
    title: string
    description?: string | null
    data: SchemaData
    creator: number
}

const SchemaList: FC = () => {
    const { pid } = useParams()
    let page = parseInt(pid || '0') || 0
    const navigate = useNavigate()
    const token = useAtomValue(TokenAtom)

    const [state, setState] = useState<Schema[]>([])

    const fetch_schemas = async () => {
        const response = await axios.get('/api/admins/schemas/?page=' + page, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        setState(response.data)
    }

    const add_schema = async () => {
        const response = await axios.post(
            '/api/admins/schemas/',
            {
                title: 'new schema',
                data: {
                    pages: [],
                    fields: {},
                },
            },
            { headers: { Authorization: 'Bearer ' + token } }
        )
        navigate('/admin/schema/' + response.data.id)
    }

    useEffect(() => {
        fetch_schemas()
    }, [page])

    return (
        <div className='schema-list'>
            <div className='schemas'>
                {state.map(s => (
                    <div className='schema' key={s.schema_id}>
                        <h2 className='title'>{s.title}</h2>
                        <span>وضعیت: {s.draft ? 'در حال تکمیل' : 'تکمیل'}</span>
                        <button
                            onClick={() =>
                                navigate('/admin/schema/' + s.schema_id)
                            }
                        >
                            نمایش
                        </button>
                    </div>
                ))}
            </div>
            <div className='actions'>
                <button style={{ '--color': 'green' }} onClick={add_schema}>
                    قالب جدید
                </button>
                <div className='pagination'>
                    <button
                        onClick={() => navigate('/admin/schemas/' + (page + 1))}
                    >
                        صفحه بعدی
                    </button>
                    <button
                        disabled={page == 0}
                        onClick={() => navigate('/admin/schemas/' + (page - 1))}
                    >
                        صفحه قبلی
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SchemaList
