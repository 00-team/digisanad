import React, { FC, useRef, ElementRef, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import './test.scss'

const Test: FC = () => {
    const output = useRef<ElementRef<'textarea'>>(null)
    const [activeStage, setActiveStage] = useState(0)
    const [schema, setSchema] = useState<SchemaData>({
        stages: [
            {
                fields: [
                    {
                        title: 'Seller',
                        type: 'user',
                        uid: 'seller',
                    },
                    {
                        title: 'Buyer',
                        type: 'user',
                        uid: 'buyer',
                    },
                ],
                title: 'the parties',
                uid: 'parties',
            },
            {
                fields: [
                    {
                        max: 6,
                        min: 1,
                        title: 'amount of dong',
                        type: 'int',
                        uid: 'dang_amount',
                    },
                ],
                title: 'Property details',
                uid: 'prop_detail',
            },
        ],
    })

    useEffect(() => {
        if (!output.current) return

        output.current.value = JSON.stringify(schema, null, 2)
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
                                    uid: 'stage_1',
                                    title: 'stage_1',
                                    fields: [],
                                })
                            }
                        >
                            <span>Append</span>
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

type GenericField = BaseField & {
    type: 'user' | 'geo' | 'record' | 'date' | 'signature'
}

type TextField = IntField & {
    type: 'text'
}

type UIDD = {
    uid: string
    display: string
}

type QuestionField = BaseField & {
    type: 'question'
    answers: UIDD[]
    questions: UIDD[]
}

type OptionFeild = BaseField & {
    type: 'option'
    singleton: boolean
    options: UIDD[]
}

type FieldType =
    | IntField
    | StrField
    | GenericField
    | OptionFeild
    | QuestionField
    | TextField

type Stage = BaseField & {
    fields: FieldType[]
}

type SchemaData = {
    stages: Stage[]
}

export default Test
