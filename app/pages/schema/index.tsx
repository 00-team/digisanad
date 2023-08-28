import React, {
    Dispatch,
    ElementRef,
    FC,
    MutableRefObject,
    useEffect,
    useRef,
    useState,
} from 'react'

import { C } from '@00-team/utils'

import axios from 'axios'
import { CopyIcon, PlusIcon, SettingIcon, FileIcon } from 'icons'
import { useNavigate, useParams } from 'react-router-dom'

import { SetStateAction, useAtomValue } from 'jotai'
import { TokenAtom } from 'state'

import { Config } from './config'
import {
    default_fields,
    FieldType,
    SchemaData,
    default_view_props,
} from './types'
import { parseFields } from './utils'
import { Viewer } from './viewer'

import './style/contract.scss'

const MODES = ['edit', 'view', 'schema'] as const
type Mode = typeof MODES[number]

type Inserter = (arg: string | ((text: string) => string)) => void

type State = {
    title: string
    draft: boolean
    description: string
    schema: SchemaData
    page: number
    uid: string
}

const default_schema: SchemaData = {
    pages: [],
    fields: {},
}

const Schema: FC = () => {
    const { schema_id } = useParams()
    const navigate = useNavigate()
    const token = useAtomValue(TokenAtom)

    const [state, setState] = useState<State>({
        title: '',
        description: '',
        draft: true,
        schema: default_schema,
        page: -1,
        uid: 'question_0',
    })
    const update = () => setState(s => ({ ...s }))
    const updateState = (v: Partial<State>) => setState(s => ({ ...s, ...v }))

    const insert = useRef<Inserter>()

    const fetch_schema = async () => {
        const response = await axios.get(`/api/admins/schemas/${schema_id}/`, {
            headers: { Authorization: 'Bearer ' + token },
        })

        if (response.status != 200) {
            return navigate('/admin/schemas/')
        }

        setState({
            title: response.data.title,
            description: response.data.description,
            draft: response.data.draft,
            schema: response.data.data,
            page: 0,
            uid: '',
        })
    }

    useEffect(() => {
        if (!schema_id) return navigate('/admin/schemas/')
        let sid = parseInt(schema_id)
        if (isNaN(sid)) return navigate('/admin/schemas/')

        fetch_schema()
    }, [schema_id])

    useEffect(() => {
        if (!state.schema.pages.length) {
            if (state.page != -1) updateState({ page: -1 })
            return
        }

        if (state.page >= state.schema.pages.length) {
            updateState({ page: state.schema.pages.length - 1 })
        } else if (state.page < 0) {
            updateState({ page: 0 })
        }
    }, [state])

    return (
        <main className='contract-container'>
            <Sidebar
                inserter={insert.current}
                state={state}
                setState={setState}
            />
            <aside className='contract-wrapper'>
                <div className='contract-pages'>
                    <button
                        className='copy-btn cta-btn title_smaller'
                        onClick={async () => {
                            const response = await axios.patch(
                                `/api/admins/schemas/${schema_id}/`,
                                {
                                    data: state.schema,
                                    draft: state.draft,
                                    title: state.title,
                                    description: state.description,
                                },
                                {
                                    headers: {
                                        Authorization: 'Bearer ' + token,
                                    },
                                }
                            )
                            console.log('save ok:', response.data.ok)
                        }}
                    >
                        <CopyIcon size={25} />
                        ذخیره
                    </button>
                    <button
                        className='add-btn cta-btn title_smaller'
                        onClick={() => {
                            state.draft = !state.draft
                            update()
                        }}
                    >
                        <FileIcon size={25} />
                        وضعیت: {state.draft ? 'در حال تکمیل' : 'تکمیل'}
                    </button>
                    <button
                        className='add-btn cta-btn title_smaller'
                        onClick={() => {
                            state.schema.pages.push({ content: '' })
                            update()
                        }}
                    >
                        <PlusIcon size={25} />
                        صفحه جدید
                    </button>
                    {state.schema.pages.map((_, i) => (
                        <button
                            key={i}
                            className={`${C(
                                i == state.page
                            )} pager title_smaller`}
                            onContextMenu={e => {
                                e.preventDefault()
                                if (!e.shiftKey) return

                                state.schema.pages.splice(i, 1)
                                update()
                            }}
                            onClick={() =>
                                state.page != i && updateState({ page: i })
                            }
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                {state.schema.pages[state.page] && (
                    <Editor
                        state={state}
                        setState={setState}
                        inserter={insert}
                    />
                )}
            </aside>
        </main>
    )
}

type SidebarProps = {
    inserter?: Inserter
    state: State
    setState: Dispatch<SetStateAction<State>>
}

const Sidebar: FC<SidebarProps> = ({ inserter, state, setState }) => {
    const update = () => setState(s => ({ ...s }))

    const insert_field = (field: FieldType) => {
        if (!inserter) return
        // Object.keys(
        //     state.schema.fields
        // ).forEach(u => {
        //     let exists =
        //         state.schema.pages.find(p => {
        //             return (
        //                 p.content.indexOf(
        //                     `({${u}})`
        //                 ) != -1
        //             )
        //         })
        //
        //     if (!exists) {
        //         console.info(
        //             u + ' was not found'
        //         )
        //         delete state.schema.fields[u]
        //     }
        // })

        let n = 0
        let uid = field.type + '_' + n
        while (uid in state.schema.fields) {
            n++
            uid = field.type + '_' + n
        }

        field.uid = uid

        if (field.type == 'link') {
            inserter(s => {
                field.text = s
                return `({${uid}})`
            })
        } else {
            inserter(`({${uid}})`)
        }

        state.schema.fields[uid] = { ...field }
        update()
    }

    return (
        <aside className='contract-sidebar'>
            <h2 className='sidebar-title title'>تنظیمات قرارداد</h2>
            <div className='fields-wrapper'>
                <h3 className='fields-title sidebar-section title_small'>
                    <PlusIcon size={25} />
                    <span>افزودن به قرارداد</span>
                </h3>
                <div className='fields'>
                    {Object.values(default_fields).map((field, i) => {
                        const { display, Icon } = default_view_props[field.type]
                        return (
                            <button
                                key={i}
                                className='field title_smaller'
                                onClick={() => insert_field(field)}
                            >
                                <Icon size={20} />
                                {display}
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className='field-config-container'>
                <h3 className='config-title sidebar-section title_small'>
                    <SettingIcon size={25} />
                    تنظیمات ورودی
                </h3>
                <div className='fields-wrapper'>
                    <input
                        className='uid-input title_smaller'
                        type='text'
                        value={state.uid}
                        onInput={e =>
                            setState(s => ({
                                ...s,
                                uid: e.currentTarget.value,
                            }))
                        }
                    />
                    {state.uid in state.schema.fields && (
                        <Config
                            field={state.schema.fields[state.uid]!}
                            update={update}
                        />
                    )}
                </div>
            </div>
        </aside>
    )
}

type EditorProps = {
    state: State
    setState: Dispatch<SetStateAction<State>>
    inserter: MutableRefObject<Inserter | undefined>
}

const Editor: FC<EditorProps> = ({ state, setState, inserter }) => {
    const [mode, setMode] = useState<Mode>(MODES[1])
    const update = () => setState(s => ({ ...s }))
    const ed = useRef<ElementRef<'textarea'>>(null)
    const output = useRef<ElementRef<'textarea'>>(null)

    useEffect(() => {
        if (!ed.current) return

        inserter.current = arg => {
            const td = ed.current
            if (!td) return

            let start = td.selectionStart
            let end = td.selectionEnd

            let selected = td.value.substring(start, end)
            let text = ''

            if (typeof arg == 'string') {
                text = arg
            } else {
                text = arg(selected)
            }

            td.value =
                td.value.substring(0, start) + text + td.value.substring(end)

            td.focus()
            td.setSelectionRange(start, start + text.length)
            state.schema.pages[state.page]!.content = td.value
            update()
        }

        ed.current.onselect = () => {
            const td = ed.current
            if (!td) return

            let text = td.value.substring(td.selectionStart, td.selectionEnd)
            if (text.indexOf('({') > -1 && text.indexOf('})') > 2) {
                let res = parseFields(text).find(i => i[0] == 'uid')
                if (!res) return
                setState(s => ({ ...s, uid: res![1] }))
            }
        }
    }, [ed, mode])

    useEffect(() => {
        if (!output.current) return

        let start = output.current.selectionStart
        let end = output.current.selectionEnd

        output.current.value = JSON.stringify(state, null, 2)

        output.current.setSelectionRange(start, end)
    }, [output, state, mode])

    return (
        <div className='editor'>
            <div className='modes'>
                {MODES.map(m => (
                    <span
                        key={m}
                        className={`${C(mode == m)} title_small`}
                        onClick={() => setMode(m)}
                    >
                        {m === 'edit' && 'ویرایش'}
                        {m === 'schema' && 'نقشه'}
                        {m === 'view' && 'نتیجه'}
                    </span>
                ))}
            </div>
            {mode == 'edit' && (
                <textarea
                    className='editor-container title_smaller'
                    ref={ed}
                    value={state.schema.pages[state.page]!.content}
                    onInput={e => {
                        state.schema.pages[state.page]!.content =
                            e.currentTarget.value
                        update()
                    }}
                ></textarea>
            )}
            {mode == 'view' && (
                <Viewer
                    schema={state.schema}
                    setSchema={data =>
                        setState(s => ({
                            ...s,
                            schema: { ...s.schema, ...data },
                        }))
                    }
                    setUID={uid => setState(s => ({ ...s, uid }))}
                    page={state.page}
                />
            )}
            {mode == 'schema' && (
                <textarea
                    className='output'
                    ref={output}
                    onInput={e => {
                        try {
                            setState(JSON.parse(e.currentTarget.value))
                        } catch {}
                    }}
                ></textarea>
            )}
        </div>
    )
}

export default Schema
