import React, { FC, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import './style.scss'

import { property } from './property'
import { Schema } from './types'

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
                            schema.pages.push({})
                            update()
                        }}
                    >
                        +
                    </span>
                    {schema.pages.map((_, i) => (
                        <span
                            className={C(i == activePage)}
                            onContextMenu={e => {
                                if (!e.shiftKey) return

                                schema.pages.splice(i, 1)
                                update()
                            }}
                        >
                            {i}
                        </span>
                    ))}
                </div>
                <div className='editor'>
                    <textarea></textarea>
                </div>
            </div>
            <div className='config'></div>
        </div>
    )
}

export default Test2
