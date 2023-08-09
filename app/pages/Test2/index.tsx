import React, {
    createElement,
    Dispatch,
    ElementRef,
    FC, // Fragment,
    MutableRefObject,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react'

import { C } from '@00-team/utils'

import './style.scss'

import { SetStateAction } from 'jotai'

import { FieldConfig } from './FieldConfig'
import { property } from './property'
import {
    Schema,
    default_fields,
    TextField,
    GeoField,
    StrField,
    QuestionField,
    IntField,
} from './types'
import { FieldType } from './types'
import { ParsedField, parseFields } from './utils'

const MODES = ['edit', 'view'] as const
type Mode = typeof MODES[number]

type Inserter = (text: string) => void

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
        <div className='test2'>
            <div className='schema'>
                <div className='pages'>
                    <span
                        className='copy-btn'
                        onClick={() => {
                            navigator.clipboard.writeText(
                                JSON.stringify(state.schema, null, 4)
                            )
                        }}
                    >
                        c
                    </span>
                    <span
                        onClick={() => {
                            state.schema.pages.push({ content: '' })
                            update()
                        }}
                    >
                        +
                    </span>
                    {state.schema.pages.map((_, i) => (
                        <span
                            key={i}
                            className={C(i == state.page)}
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
                        </span>
                    ))}
                </div>
                {state.schema.pages[state.page] && (
                    <Editor
                        state={state}
                        setState={setState}
                        inserter={insert}
                    />
                )}
            </div>
            <div className='config'>
                <div className='fields'>
                    {Object.entries(default_fields).map(([k, v], i) => (
                        <button
                            key={i}
                            onClick={() => {
                                if (!insert.current) return

                                Object.keys(state.schema.fields).forEach(u => {
                                    let exists = state.schema.pages.find(p => {
                                        return (
                                            p.content.indexOf(`({${u}})`) != -1
                                        )
                                    })

                                    if (!exists) {
                                        console.info(u + ' was not found')
                                        delete state.schema.fields[u]
                                    }
                                })

                                let uid = get_unique_uid(k)
                                v.uid = uid

                                state.schema.fields[uid] = { ...v }

                                update()
                                insert.current(`({${uid}})`)
                            }}
                        >
                            {k}
                        </button>
                    ))}
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
            </div>
        </div>
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

    useEffect(() => {
        if (!ed.current) return

        inserter.current = (text: string) => {
            const td = ed.current
            if (!td) return

            let start = td.selectionStart
            let end = td.selectionEnd

            td.value =
                td.value.substring(0, start) + text + td.value.substring(end)

            td.focus()
            td.setSelectionRange(start, end)
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
                                      <FMFC
                                          key={fi}
                                          // @ts-ignore
                                          field={field}
                                          update={update}
                                      />
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

const field_map: FMF = {
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
    signature: () => <></>,
    record: () => <></>,
    question: QuestionFC,
    date: () => <></>,
    option: () => <></>,
}

export default Test2
