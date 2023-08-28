import React, {
    ChangeEvent,
    createElement,
    Dispatch,
    ElementRef,
    FC,
    MutableRefObject,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react'

import { C } from '@00-team/utils'

import axios from 'axios'
import {
    ArrowDownIcon,
    CheckIcon,
    CloseIcon,
    CopyIcon,
    PlusIcon,
    SettingIcon,
    FileIcon,
} from 'icons'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useNavigate, useParams } from 'react-router-dom'

import { SetStateAction, useAtomValue } from 'jotai'
import { TokenAtom } from 'state'

import { DatePicker } from 'components'

import { Config } from './config'
import { CustomMap } from './map'
import {
    default_fields,
    FieldType,
    GeoField,
    IntField,
    OptionFeild,
    QuestionField,
    RecordField,
    SchemaData,
    SignatureField,
    StrField,
    TextField,
    default_view_props,
} from './types'
import { ParsedField, parseFields } from './utils'

import './style/contract.scss'

import pdfImg from 'static/Contract/pdf.png'

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
                <Viewer state={state} setState={setState} inserter={inserter} />
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

type TreeNode = {
    name: string
    items: ParsedField[]
}

const Viewer: FC<EditorProps> = ({ state, setState }) => {
    const [result, setResult] = useState<ReactNode>('')
    const update = () => setState(s => ({ ...s }))

    useEffect(() => {
        let tree: TreeNode[] = []
        let title_was_parsed = false

        state.schema.pages[state.page]!.content.split('\n').forEach(line => {
            let node: TreeNode = { name: '', items: [] }

            if (!line) {
                tree.push({ name: 'br', items: [] })
                return
            }

            if (line == '---') {
                tree.push({ name: 'hr', items: [] })
                return
            }

            // let i = 0
            let hn = 0

            if (line[0] == '#') {
                hn = line.indexOf(' ')
                line = line.substring(hn + 1)
                if (hn == 1 && !title_was_parsed) {
                    if (state.title != line) {
                        state.title = line
                        update()
                    }
                    title_was_parsed = true
                    node.name = 'h1'
                } else if (hn > 1 && hn < 5) {
                    node.name = 'h' + hn
                }
            }

            if (!node.name) node.name = 'div'

            node.items = parseFields(line)
            tree.push(node)
        })

        setResult(
            <>
                {tree.map((n, i) =>
                    createElement(
                        n.name,
                        { key: i },
                        n.items.length
                            ? n.items.map((f, fi) => {
                                  if (f[0] == 'text') return f[1]

                                  let uid = f[1]

                                  if (!(uid in state.schema.fields)) return null
                                  let field = state.schema.fields[uid]!
                                  let FMFC =
                                      field_map[state.schema.fields[uid]!.type]

                                  return (
                                      <span
                                          key={fi}
                                          className='field-wrapper'
                                          onContextMenu={e => {
                                              e.preventDefault()
                                              state.uid = uid
                                              update()
                                          }}
                                      >
                                          <FMFC
                                              key={fi}
                                              // @ts-ignore
                                              field={field}
                                              update={update}
                                          />
                                      </span>
                                  )
                              })
                            : undefined
                    )
                )}
            </>
        )
    }, [state])

    return <div className='viewer title_small'>{result}</div>
}

type FMF = {
    [T in FieldType as T['type']]: FC<{ field: T; update: () => void }>
}

type FieldProps<T> = FC<{
    field: T
    update: () => void
}>

const TextFC: FieldProps<TextField> = ({ field, update }) => {
    return (
        <textarea
            className='text-field title_smaller'
            value={field.value}
            rows={10}
            cols={50}
            onInput={e => {
                field.value = e.currentTarget.value
                update()
            }}
        ></textarea>
    )
}

const GeoFC: FieldProps<GeoField> = ({ field }) => {
    return (
        <div className='geo-container'>
            <MapContainer
                style={{ width: '100%', height: '100%' }}
                center={[35.698587185965124, 51.33724353174251]}
                zoom={14}
                scrollWheelZoom={false}
                attributionControl
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <CustomMap optional={field.optional} />
            </MapContainer>
        </div>
    )
}

const StrFC: FieldProps<StrField> = ({ field, update }) => {
    return (
        <input
            placeholder={field.placeholder}
            value={field.value}
            onInput={e => {
                field.value = e.currentTarget.value
                update()
            }}
            max={field.max || undefined}
            min={field.min || undefined}
        />
    )
}

const IntFC: FieldProps<IntField> = ({ field, update }) => {
    return (
        <input
            type='number'
            placeholder={field.placeholder}
            value={field.value}
            onInput={e => {
                field.value = parseInt(e.currentTarget.value)
                update()
            }}
            max={field.max || undefined}
            min={field.min || undefined}
        />
    )
}

const QuestionFC: FieldProps<QuestionField> = ({ field, update }) => {
    return (
        <table className='question-field'>
            <thead>
                <tr>
                    <th>{field.title}</th>
                    {field.answers.map((a, ai) => (
                        <th key={ai}>{a.display}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {field.questions.map((q, qi) => (
                    <tr key={qi}>
                        <td>{q.display}</td>
                        {field.answers.map((a, ai) => (
                            <td key={ai}>
                                <input
                                    type='radio'
                                    name={field.uid + q.uid}
                                    title={a.display}
                                    checked={field.value[q.uid] == a.uid}
                                    onChange={e => {
                                        if (e.currentTarget.checked) {
                                            field.value[q.uid] = a.uid
                                            update()
                                        }
                                    }}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

const RecordFC: FieldProps<RecordField> = ({ field }) => {
    const [preview, setpreview] = useState<string[]>([''])

    const readURL = (input: ChangeEvent<HTMLInputElement>) => {
        if (!field.plural && preview.length >= 2)
            return ReactAlert.error('ورودی بیشتر از یک فایل مجاز نیست!')

        if (!input.target.files) return

        if (input.target.files.length <= 1) {
            if (!input.target.files[0]) return

            var reader = new FileReader()

            reader.onload = function (e) {
                return setpreview([...preview, e.target!.result!.toString()])
            }
            reader.readAsDataURL(input.target.files[0])
        } else {
            Array.from(input.target.files).map(file => {
                var reader = new FileReader()

                reader.onload = function (e) {
                    setpreview(previews => [
                        ...previews,
                        e.target!.result!.toString(),
                    ])
                }
                reader.readAsDataURL(file)

                return
            })
        }

        return
    }

    return (
        <div className='record-container'>
            <div className='record-field'>
                {preview.length <= 1 ? (
                    <div className='record-empty'>
                        <ArrowDownIcon size={40} />
                        <h4 className='title_smaller'>
                            فایل خود را اینجا بارگذاری کنید
                        </h4>
                    </div>
                ) : (
                    <div className='files-container'>
                        {preview.map((file, index) => {
                            if (!file) return

                            const acceptedTypes = ['png', 'jpg', 'jpeg', 'gif']

                            const fileType = file.split('/')[1]!.split(';')[0]

                            return (
                                <div
                                    key={index}
                                    className='img-container'
                                    onClick={() => {
                                        setpreview(previews =>
                                            previews.filter(preview => {
                                                return preview !== file
                                            })
                                        )
                                    }}
                                >
                                    <img
                                        src={
                                            acceptedTypes.includes(fileType!)
                                                ? file
                                                : pdfImg
                                        }
                                        loading={'lazy'}
                                        decoding={'async'}
                                        alt=''
                                    />
                                    <div className='remove-img'>
                                        <CloseIcon size={30} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <label htmlFor='record-input' className='add-file title_small'>
                اضافه کردن فایل
            </label>
            <input
                id='record-input'
                onChange={e => readURL(e)}
                type='file'
                multiple={field.plural}
                accept='.pdf, .jpg, .jpeg, .png, image/jpg, image/jpeg, image/png'
            />
        </div>
    )
}

type SignatureState = {
    px: number
    py: number
    cx: number
    cy: number
    draw: boolean
    context: CanvasRenderingContext2D
}

var n = 0

const SignatureDrawer: FieldProps<SignatureField> = () => {
    const state = useRef<SignatureState>({
        px: 0,
        py: 0,
        cx: 0,
        cy: 0,
        draw: false,
        context: {} as CanvasRenderingContext2D,
    })

    return (
        <div className='signature-container'>
            <canvas
                width={500}
                height={450}
                ref={e => {
                    if (!e) return
                    state.current.context = e.getContext('2d')!
                }}
                className='signature-wrapper'
                onMouseDown={e => {
                    state.current.px = state.current.cx
                    state.current.py = state.current.cy

                    state.current.cx = e.nativeEvent.offsetX
                    state.current.cy = e.nativeEvent.offsetY

                    state.current.context.beginPath()
                    state.current.context.fillStyle = 'black'
                    state.current.context.fillRect(
                        state.current.cx,
                        state.current.cy,
                        2,
                        2
                    )
                    state.current.context.closePath()

                    state.current.draw = true
                }}
                onMouseUp={() => {
                    state.current.draw = false
                }}
                onMouseOut={() => {
                    state.current.draw = false
                }}
                onMouseMove={e => {
                    n++
                    if (!state.current.draw || n < 5) return
                    n = 0

                    state.current.px = state.current.cx
                    state.current.py = state.current.cy

                    state.current.cx = e.nativeEvent.offsetX
                    state.current.cy = e.nativeEvent.offsetY

                    state.current.context.beginPath()
                    state.current.context.moveTo(
                        state.current.px,
                        state.current.py
                    )
                    state.current.context.lineTo(
                        state.current.cx,
                        state.current.cy
                    )
                    state.current.context.strokeStyle = 'black'
                    state.current.context.lineWidth = 2
                    state.current.context.stroke()
                    state.current.context.closePath()
                }}
            ></canvas>
            <div className='confirm-wrapper'>
                <div
                    className='remove'
                    onClick={() => {
                        state.current.context.clearRect(0, 0, 500, 450)
                    }}
                >
                    <CloseIcon size={25} />
                </div>
                <div className='confirm'>
                    <CheckIcon size={25} />
                </div>
            </div>
        </div>
    )
}

const OptionFC: FieldProps<OptionFeild> = ({ field, update }) => {
    return (
        <ul>
            {field.options.map((o, i) => (
                <li key={i}>
                    <input
                        type={field.singleton ? 'radio' : 'checkbox'}
                        name={field.uid}
                        id={field.uid + o.uid}
                        checked={field.value.includes(o.uid)}
                        onChange={e => {
                            let checked = e.currentTarget.checked

                            if (field.singleton) {
                                if (checked) {
                                    field.value = [o.uid]
                                    update()
                                }
                            } else {
                                field.value = field.value.filter(
                                    v => v != o.uid
                                )

                                if (checked) {
                                    field.value.push(o.uid)
                                }

                                update()
                            }
                        }}
                    />
                    <label htmlFor={field.uid + o.uid}>{o.display}</label>
                </li>
            ))}
        </ul>
    )
}

const field_map: FMF = {
    link: ({ field }) => (
        <a href={field.url} title={field.title}>
            {field.text}
        </a>
    ),
    text: TextFC,
    str: StrFC,
    user: ({ field, update }) => (
        <input
            placeholder={'User Field'}
            value={field.value}
            onInput={e => {
                field.value = e.currentTarget.value
                update()
            }}
        />
    ),
    geo: GeoFC,
    int: IntFC,
    signature: SignatureDrawer,
    record: RecordFC,
    question: QuestionFC,
    date: DatePicker,
    option: OptionFC,
}

export default Schema
