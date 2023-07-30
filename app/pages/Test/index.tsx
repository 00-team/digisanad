import React, { FC, useRef, ElementRef, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import './test.scss'

const Test: FC = () => {
    const output = useRef<ElementRef<'textarea'>>(null)
    const [activeStage, setActiveStage] = useState(0)
    const [schema, setSchema] = useState<SchemaData>({ stages: [] })

    useEffect(() => {
        if (!output.current) return

        output.current.value = JSON.stringify(schema, null, 4)
    }, [schema])

    const appendStage = (stage: Stage) => {
        setSchema(s => {
            return { ...s, stages: [...s.stages, stage] }
        })
    }

    return (
        <div className='test-container'>
            <div className='contract-builder'>
                <div className='view'>
                    <div className='stages'>
                        <div
                            onClick={() =>
                                appendStage({
                                    uid: 'gg',
                                    title: 'cool',
                                    fields: [],
                                })
                            }
                        >
                            <span className='title'>Append</span>
                        </div>
                        {schema.stages.map((s, i) => (
                            <div
                                className={C(i === activeStage)}
                                onClick={() => setActiveStage(i)}
                                key={i}
                            >
                                <span>{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='builder'>
                    <button>add field</button>
                </div>
            </div>
            <textarea
                ref={output}
                onChange={e => setSchema(JSON.parse(e.currentTarget.value))}
            ></textarea>
        </div>
    )
}

type BaseField = {
    uid: string
    title: string
    description?: string | null
    optinal?: boolean
}

type IntField = BaseField & {
    type: 'int'
    min?: number | null
    max?: number | null
}

type StrField = IntField & {
    type: 'str'
}

type FieldType = IntField | StrField

type Stage = BaseField & {
    fields: FieldType[]
}

type SchemaData = {
    stages: Stage[]
}

export default Test
