import React, {
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

import { CopySvg, PlusSvg } from 'icons'

import { SetStateAction } from 'jotai'

import { FieldConfig } from './FieldConfig'
import { property } from './property'
import {
    default_fields,
    FieldType,
    GeoField,
    IntField,
    OptionFeild,
    QuestionField,
    RecordField,
    Schema,
    StrField,
    TextField,
} from './types'
import { ParsedField, parseFields } from './utils'

import './style/contract.scss'

const MODES = ['edit', 'view', 'schema'] as const
type Mode = typeof MODES[number]

type Inserter = (arg: string | ((text: string) => string)) => void

type State = {
    schema: Schema
    page: number
    uid: string
}

const Test2: FC = () => {
    const [state, setState] = useState<State>({
        schema: property,
        page: property.pages.length - 1,
        uid: 'question_0',
    })
    const update = () => setState(s => ({ ...s }))
    const updateState = (v: Partial<State>) => setState(s => ({ ...s, ...v }))

    const insert = useRef<Inserter>()

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

    const get_unique_uid = (base: string) => {
        let n = 0
        let uid = base + '_' + n
        while (uid in state.schema.fields) {
            n++
            uid = base + '_' + n
        }
        return uid
    }

    return (
        <main className='contract-container'>
            <aside className='contract-wrapper'>
                <div className='contract-pages'>
                    <button
                        className='copy-btn cta-btn title_smaller'
                        onClick={() => {
                            navigator.clipboard.writeText(
                                JSON.stringify(state.schema, null, 4)
                            )
                        }}
                    >
                        <CopySvg size={25} />
                        کپی کردن
                    </button>
                    <button
                        className='add-btn cta-btn title_smaller'
                        onClick={() => {
                            state.schema.pages.push({ content: '' })
                            update()
                        }}
                    >
                        <PlusSvg size={25} />
                        اضافه کردن
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
                            {i}
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
            <aside className='contract-sidebar'>
                <h2 className='sidebar-title title'>تنظیمات قرارداد</h2>
                <div className='fields-wrapper'>
                    <h3 className='fields-title title_small'>
                        <PlusSvg size={25} />
                        <span>افزودن به قرارداد</span>
                    </h3>
                    <div className='fields'>
                        {Object.entries(default_fields).map(([k, v], i) => (
                            <button
                                className='field title_smaller'
                                key={i}
                                onClick={() => {
                                    if (!insert.current) return

                                    Object.keys(state.schema.fields).forEach(
                                        u => {
                                            let exists =
                                                state.schema.pages.find(p => {
                                                    return (
                                                        p.content.indexOf(
                                                            `({${u}})`
                                                        ) != -1
                                                    )
                                                })

                                            if (!exists) {
                                                console.info(
                                                    u + ' was not found'
                                                )
                                                delete state.schema.fields[u]
                                            }
                                        }
                                    )

                                    let uid = get_unique_uid(k)
                                    v.uid = uid

                                    state.schema.fields[uid] = { ...v }

                                    update()
                                    insert.current(`({${uid}})`)
                                }}
                            >
                                {v.Icon && <v.Icon size={20} />}
                                {v.display}
                            </button>
                        ))}
                    </div>
                </div>
                <div className='field-config-container'>
                    <input
                        className='uid-input'
                        type='text'
                        value={state.uid}
                        onInput={e =>
                            updateState({ uid: e.currentTarget.value })
                        }
                    />
                    {state.uid in state.schema.fields && (
                        <FieldConfig
                            field={state.schema.fields[state.uid]!}
                            update={update}
                        />
                    )}
                </div>
            </aside>
        </main>
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
                        className={C(mode == m)}
                        onClick={() => setMode(m)}
                    >
                        {m}
                    </span>
                ))}
            </div>
            {mode == 'edit' && (
                <textarea
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
                    ref={output}
                    style={{ direction: 'ltr' }}
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
                if (hn > 0 && hn < 5) {
                    node.name = 'h' + hn
                }
                line = line.substring(hn + 1)
            }

            if (!node.name) node.name = 'div'

            node.items = parseFields(line)
            tree.push(node)
        })
        // const toElement = (item: TreeNode | string, key = 0): ReactNode => {
        //     if (typeof item == 'string') return item
        //
        //     let childs: undefined | ReactNode[] = undefined
        //
        //     if (item.children.length) {
        //         childs = item.children.map(toElement)
        //     }
        //
        //     return createElement(item.name, { key, ...item.props }, childs)
        // }

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

    return <div className='viewer'>{result}</div>
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
            className='text-field'
            value={field.value}
            onInput={e => {
                field.value = e.currentTarget.value
                update()
            }}
        ></textarea>
    )
}

const GeoFC: FieldProps<GeoField> = ({ field, update }) => {
    return (
        <div
            className='geo-field'
            onMouseDown={e => {
                field.value.latitude = e.clientX - e.currentTarget.offsetLeft
                field.value.longitude = e.clientY - e.currentTarget.offsetTop
                update()
            }}
        >
            lat: {field.value.latitude}
            <br />
            lng: {field.value.longitude}
        </div>
    )
}

const StrFC: FieldProps<StrField> = ({ field, update }) => {
    return (
        <input
            placeholder={field.title}
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
            placeholder={field.title}
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
    return (
        <div className='record-field'>
            <span>
                TODO: if the span is plural append more files and such ...
            </span>
            <span>plural: {`${field.plural}`}</span>
            <input type='file' disabled />
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
            {field.description}
        </a>
    ),
    text: TextFC,
    str: StrFC,
    user: ({ field, update }) => (
        <input
            placeholder={field.title}
            value={field.value}
            onInput={e => {
                field.value = e.currentTarget.value
                update()
            }}
        />
    ),
    geo: GeoFC,
    int: IntFC,
    signature: () => <span>signature drawer ...</span>,
    record: RecordFC,
    question: QuestionFC,
    date: () => <span>date picker ...</span>,
    option: OptionFC,
}

export default Test2
