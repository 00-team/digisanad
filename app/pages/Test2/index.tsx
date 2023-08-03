import React, { Dispatch, FC, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import './style.scss'

import { SetStateAction } from 'jotai'

import { property } from './property'
import { Page, Schema } from './types'

const MODES = ['edit', 'view'] as const
type Mode = typeof MODES[number]

const Test2: FC = () => {
    const [schema, setSchema] = useState<Schema>(property)
    const [activePage, setActivePage] = useState(0)

    const update = () => setSchema(s => ({ ...s }))

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
                        onClick={() => {
                            schema.pages.push({ content: '' })
                            update()
                        }}
                    >
                        +
                    </span>
                    {schema.pages.map((_, i) => (
                        <span
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
                    />
                )}
            </div>
            <div className='config'></div>
        </div>
    )
}

type EditorProps = {
    page: Page
    index: number
    setSchema: Dispatch<SetStateAction<Schema>>
}

const Editor: FC<EditorProps> = ({ page, setSchema }) => {
    const [mode, setMode] = useState<Mode>(MODES[0])
    const update = () => setSchema(s => ({ ...s }))

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
