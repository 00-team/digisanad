import React, { FC, useEffect, useState } from 'react'

import axios from 'axios'
import { ContractIcon, EditIcon } from 'icons'
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

    useEffect(() => {
        fetch_schemas()
    }, [page])

    return (
        <div className='admin-schema-list'>
            <div className='admin-schemas'>
                {state.map(s => (
                    <div className='admin-schema' key={s.schema_id}>
                        <h2 className='title admin-schema-title'>{s.title}</h2>
                        <div className='admin-schema-details title_smaller'>
                            <div className='admin-schema-detail'>
                                <div className='holder'>
                                    <ContractIcon />
                                    وضعیت:
                                </div>
                                <div className='data'>
                                    {s.draft ? (
                                        <span
                                            style={{
                                                color: 'var(--alert-error)',
                                            }}
                                        >
                                            در حال تکمیل
                                        </span>
                                    ) : (
                                        <span
                                            style={{
                                                color: '#008149',
                                            }}
                                        >
                                            تکمیل شده
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className='admin-schema-detail'>
                                <div className='holder'>
                                    <EditIcon size={20} />
                                    شماره قرارداد:
                                </div>
                                <div className='data'>{s.schema_id}</div>
                            </div>
                        </div>
                        <button
                            className='title_small'
                            onClick={() =>
                                navigate('/admin/schema/' + s.schema_id)
                            }
                        >
                            نمایش
                        </button>
                    </div>
                ))}
            </div>
            <div className='actions title_smaller'>
                <div className='pagination'>
                    <button
                        disabled={page == 0}
                        onClick={() => navigate('/admin/schemas/' + (page - 1))}
                    >
                        صفحه قبلی
                    </button>
                    <button
                        onClick={() => navigate('/admin/schemas/' + (page + 1))}
                    >
                        صفحه بعدی
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SchemaList
