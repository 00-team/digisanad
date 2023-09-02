import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import axios, { AxiosResponse } from 'axios'
import {
    CheckIcon,
    ContractIcon,
    CopyIcon,
    EditIcon,
    PersonIcon,
    RemoveIcon,
} from 'icons'
import { SchemaData, UserPublic } from 'pages/schema/types'
import { Viewer } from 'pages/schema/viewer'
import { useNavigate, useParams } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { TokenAtom, UserAtom } from 'state'

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

type State = ContractModel & {
    data: SchemaData
    parties: UserPublic[]
    page: number
    need_schema: boolean
}

type SaveData = {
    data: SchemaData
    stage: keyof typeof CSMAP
    title: string
    disable_invites: boolean
}

const Contract: FC = () => {
    const { contract_id } = useParams()
    const navigate = useNavigate()
    const token = useAtomValue(TokenAtom)
    const me = useAtomValue(UserAtom)

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
    // const update = () => setState(s => ({ ...s }))
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

    const fetch_parties = async () => {
        try {
            const response = await axios.get(
                `/api/contracts/${contract_id}/parties/`,
                {
                    headers: { Authorization: 'Bearer ' + token },
                }
            )

            updateState({ parties: response.data })
        } catch (error) {
            HandleError(error)
        }
    }

    const remove_user = async (user_id: number): Promise<boolean> => {
        try {
            const response = await axios.delete(
                `/api/contracts/${contract_id}/remove/${user_id}/`,
                {
                    headers: { Authorization: 'Bearer ' + token },
                }
            )

            return response.data.ok
        } catch (error) {
            HandleError(error)
        }

        return false
    }

    const save_contract = async (data: Partial<SaveData>) => {
        try {
            const res = await axios.patch(
                `/api/contracts/${contract_id}/`,
                data,
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                }
            )
            if (res.data.ok) {
                ReactAlert.success('قرارداد با موفقیت ذخیره شد.')
                return
            }
        } catch (error) {
            HandleError(error)
        }

        ReactAlert.error('خطا درهنگام ذخیره قرارداد')
    }

    const delete_exit_contract = async () => {
        let config = { headers: { Authorization: 'Bearer ' + token } }
        let url = `/api/contracts/${contract_id}/`
        let response: AxiosResponse

        try {
            if (state.creator == me.user_id) {
                response = await axios.delete(url, config)
            } else {
                response = await axios.get(url + 'exit/', config)
            }

            if (response.data.ok) {
                navigate('/dashboard/contracts/')
                return
            }
        } catch (error) {
            HandleError(error)
        }
    }

    useEffect(() => {
        if (!contract_id) return navigate('/dashboard/contracts/')
        let cid = parseInt(contract_id)
        if (isNaN(cid)) return navigate('/dashboard/contracts/')

        fetch_contract()
        fetch_parties()
    }, [contract_id])

    if (state.contract_id == -1) return <></>

    if (state.need_schema)
        return <SelectSchema state={state} setState={setState} />

    return (
        <div className='contract-container'>
            <div className='head'>
                <h1 className='title'>{state.title}</h1>
                <div className='actions'>
                    {state.data.pages.map((_, i) => (
                        <button
                            key={i}
                            className={`${C(
                                i == state.page
                            )} pager title_smaller`}
                            onClick={() =>
                                state.page != i && updateState({ page: i })
                            }
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className='save-btn cta-btn title_smaller'
                        onClick={() => save_contract({ data: state.data })}
                    >
                        <CheckIcon />
                        ذخیره
                    </button>

                    <button
                        className='remove-btn cta-btn title_smaller'
                        onClick={() => delete_exit_contract()}
                    >
                        <RemoveIcon />
                        {state.creator == me.user_id ? 'حذف' : 'خروج'}
                    </button>
                </div>
            </div>
            <div className='inner-wrapper'>
                <div className='viewer-wrapper'>
                    <Viewer
                        contract_id={state.contract_id}
                        users={state.parties}
                        page={state.page}
                        schema={state.data}
                        setUID={() => {}}
                        setSchema={(data, save) => {
                            setState(s => {
                                let new_data = { ...s.data, ...data }
                                if (save) save_contract({ data: new_data })

                                return {
                                    ...s,
                                    data: new_data,
                                }
                            })
                        }}
                    />
                </div>

                <div className='parties'>
                    <div className='users'>
                        {state.parties.map((user, i) => (
                            <div
                                className='user'
                                key={i}
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className='user-wrapper'>
                                    <PersonIcon
                                        className={`${
                                            state.creator == me.user_id &&
                                            user.user_id != me.user_id
                                                ? ''
                                                : 'active'
                                        }`}
                                    />
                                    <span
                                        className={`fullname title_small ${
                                            state.creator == me.user_id &&
                                            user.user_id != me.user_id
                                                ? ''
                                                : 'bold'
                                        }`}
                                    >
                                        {user.first_name} {user.last_name}
                                    </span>
                                </div>
                                {state.creator == me.user_id &&
                                    user.user_id != me.user_id && (
                                        <button
                                            className='remove'
                                            onClick={() => {
                                                remove_user(user.user_id).then(
                                                    ok => {
                                                        if (ok) fetch_parties()
                                                    }
                                                )
                                            }}
                                        >
                                            <RemoveIcon />
                                        </button>
                                    )}
                            </div>
                        ))}
                    </div>
                    <div className='config'>
                        <button
                            className='toggle-invites title_smaller'
                            style={{
                                '--color': state.disable_invites
                                    ? 'red'
                                    : 'green',
                            }}
                            disabled={state.creator != me.user_id}
                            onClick={() => {
                                setState(s => {
                                    save_contract({
                                        disable_invites: !s.disable_invites,
                                    }).then(() => fetch_contract())
                                    return {
                                        ...s,
                                        disable_invites: !s.disable_invites,
                                    }
                                })
                            }}
                        >
                            دعوت:{' '}
                            <div
                                className={`options-wrapper ${C(
                                    state.disable_invites
                                )}`}
                            >
                                <div className={`enable`}>فعال</div>
                                <div className={`disable`}>غیرفعال</div>
                            </div>
                        </button>
                        <button
                            className='link-copy title_smaller'
                            onClick={() => {
                                console.log('slm')
                                const link = `${location.origin}/jc/${state.contract_id}:${state.pepper}`
                                if (!link) return

                                navigator.clipboard.writeText(link)

                                ReactAlert.show('لینک با موفقیت کپی شد')
                            }}
                        >
                            <CopyIcon />
                            <span>
                                {`${location.origin}/jc/${state.contract_id}:${state.pepper}`}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
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
                        <div className='schema-details title_smaller'>
                            <div className='schema-detail'>
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
                            <div className='schema-detail'>
                                <div className='holder'>
                                    <EditIcon size={20} />
                                    شماره قرارداد:
                                </div>
                                <div className='data'>{s.schema_id}</div>
                            </div>
                        </div>
                        <button
                            className='title_smaller'
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
            <div className='actions title_smaller'>
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

const JoinContract = () => {
    const { id_pepper } = useParams()
    const token = useAtomValue(TokenAtom)
    const navigate = useNavigate()

    const join = async (cid: string, pepper: string) => {
        try {
            const response = await axios.get(
                `/api/contracts/${cid}/join/${pepper}/`,
                {
                    headers: { Authorization: 'Bearer ' + token },
                }
            )

            if (response.data.ok) {
                navigate('/dashboard/contract/' + cid)
            } else {
                navigate('/dashboard/')
            }
        } catch {
            navigate('/dashboard/')
        }
    }

    useEffect(() => {
        if (!id_pepper || id_pepper.indexOf(':') == -1)
            return navigate('/dashboard/')

        let [cid, pepper] = id_pepper.split(':') as [string, string]
        if (!cid || !pepper || isNaN(parseInt(cid)))
            return navigate('/dashboard/')

        join(cid, pepper)
    }, [id_pepper])

    return (
        <div className='join-contract'>
            <div className='inner'>در حال ورود به قرارداد ...</div>
        </div>
    )
}

export { Contract, JoinContract }
