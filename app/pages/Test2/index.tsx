import React, {
    createElement,
    Dispatch,
    ElementRef,
    FC,
    Fragment,
    MutableRefObject,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react'

import { C } from '@00-team/utils'

import './style.scss'

import { SetStateAction } from 'jotai'

import { property } from './property'
import { Page, Schema, default_fields } from './types'
import { parseFields } from './utils'

const MODES = ['edit', 'view'] as const
type Mode = typeof MODES[number]

type Inserter = (text: string) => void

const Test2: FC = () => {
    const [schema, setSchema] = useState<Schema>(property)
    const [activePage, setActivePage] = useState(0)
    const update = () => setSchema(s => ({ ...s }))

    const insert = useRef<Inserter>()

    useEffect(() => {
        // if (!output.current) return
        //
        // output.current.value = JSON.stringify(schema, null, 2)
        if (!schema.pages.length) {
            setActivePage(0)
            return
        }

        if (activePage >= schema.pages.length) {
            setActivePage(schema.pages.length - 1)
        } else if (activePage < 0) {
            setActivePage(0)
        }
    }, [schema, activePage])

    const get_unique_uid = (base: string) => {
        let n = 0
        let uid = base + '_' + n
        while (uid in schema.fields) {
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
                                JSON.stringify(schema, null, 4)
                            )
                        }}
                    >
                        c
                    </span>
                    <span
                        onClick={() => {
                            schema.pages.push({ content: '' })
                            update()
                        }}
                    >
                        +
                    </span>
                    {schema.pages.map((_, i) => (
                        <span
                            key={i}
                            className={C(i == activePage)}
                            onContextMenu={e => {
                                e.preventDefault()
                                if (!e.shiftKey) return

                                schema.pages.splice(i, 1)
                                update()
                            }}
                            onClick={() => setActivePage(i)}
                        >
                            {i}
                        </span>
                    ))}
                </div>
                {schema.pages[activePage] && (
                    <Editor
                        page={schema.pages[activePage]!}
                        setSchema={setSchema}
                        index={activePage}
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

                                let uid = get_unique_uid(k)
                                schema.fields[uid] = v
                                update()
                                insert.current(`({${uid}})`)
                            }}
                        >
                            {k}
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            if (!insert.current) return
                            insert.current('({user_1})')
                        }}
                    >
                        User
                    </button>
                </div>
                <div className='field-config'>gg</div>
            </div>
        </div>
    )
}

type EditorProps = {
    page: Page
    index: number
    setSchema: Dispatch<SetStateAction<Schema>>
    inserter: MutableRefObject<Inserter | undefined>
}

const Editor: FC<EditorProps> = ({ page, setSchema, inserter }) => {
    const [mode, setMode] = useState<Mode>(MODES[0])
    const update = () => setSchema(s => ({ ...s }))
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
            page.content = td.value
            update()
        }

        ed.current.onselect = () => {
            const td = ed.current
            if (!td) return

            let text = td.value.substring(td.selectionStart, td.selectionEnd)
            if (text.indexOf('({') > -1 && text.indexOf('})') > 2) {
                console.log(parseFields(text))
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
                    value={page.content}
                    onInput={e => {
                        page.content = e.currentTarget.value
                        update()
                    }}
                ></textarea>
            )}
            {mode == 'view' && <Viewer content={page.content} />}
        </div>
    )
}

type ViewerProps = {
    content: string
}

type TreeNode = {
    name: string
    props?: any
    children: (TreeNode | string)[]
}

const Viewer: FC<ViewerProps> = ({ content }) => {
    const [result, setResult] = useState<ReactNode>('')

    useEffect(() => {
        let tree: TreeNode[] = []

        content.split('\n').forEach(line => {
            let node: TreeNode = { name: '', children: [] }

            if (!line) {
                tree.push({ name: 'br', children: [] })
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

            const find = (str: string) => {
                let s = str.indexOf('({')
                let e = str.indexOf('})')
                if (s < e && s != -1) {
                    node.children.push(str.substring(0, s))

                    let uid = str.substring(s + 2, e)
                    if (uid == 'geo') {
                        node.children.push({
                            name: 'div',
                            props: { className: 'geo' },
                            children: ['map'],
                        })
                    } else {
                        node.children.push({
                            name: 'input',
                            props: { placeholder: 'user' },
                            children: [uid],
                        })
                    }

                    find(str.substring(e + 2))
                } else {
                    node.children.push(str)
                }
            }

            find(line)
            tree.push(node)
        })

        const toElement = (item: TreeNode | string, key = 0): ReactNode => {
            if (typeof item == 'string') return item

            let childs: undefined | ReactNode[] = undefined

            if (['hr', 'br', 'input', 'img'].includes(item.name)) {
                childs = undefined
            } else {
                childs = item.children.map(toElement)
            }

            return createElement(item.name, { key, ...item.props }, childs)
        }

        setResult(createElement(Fragment, undefined, tree.map(toElement)))
    }, [content])

    return <div className='viewer'>{result}</div>
}

export default Test2
