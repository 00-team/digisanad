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

import './style.scss'

import { SetStateAction } from 'jotai'

import { property } from './property'
import { Page, Schema } from './types'

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
                <button
                    onClick={() => {
                        if (!insert.current) return
                        insert.current('({user_1})')
                    }}
                >
                    User
                </button>
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
            const td = ed.current!
            td.value =
                td.value.substring(0, td.selectionStart) +
                text +
                td.value.substring(td.selectionEnd)

            td.focus()
            page.content = td.value
            update()
        }
    }, [ed])

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
                    onChange={e => {
                        page.content = e.currentTarget.value
                        update()
                    }}
                ></textarea>
            )}
        </div>
    )
}

export default Test2
