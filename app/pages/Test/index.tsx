import React, {
    FC,
    useRef,
    ElementRef,
    useEffect,
    useState,
    SetStateAction,
    Dispatch,
} from 'react'

import { C, UniqueID } from '@00-team/utils'

import './test.scss'

const Test: FC = () => {
    const output = useRef<ElementRef<'textarea'>>(null)
    const [activeStage, setActiveStage] = useState(0)
    const [schema, setSchema] = useState<SchemaData>({
        stages: [
            {
                title: 'the parties',
                uid: 'parties',
                fields: [
                    {
                        title: 'question',
                        type: 'question',
                        uid: 'question',
                        answers: [
                            { uid: 'Y', display: 'Yes' },
                            { uid: 'M', display: 'Maybe' },
                            { uid: 'N', display: 'No' },
                        ],
                        questions: [
                            {
                                uid: 'q1',
                                display: 'Question 1',
                            },
                            {
                                uid: 'q2',
                                display: 'Question 2',
                            },
                        ],
                    },
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
                    {
                        title: 'INT',
                        type: 'int',
                        uid: 'F_int_1',
                        min: 420,
                        max: 69,
                    },
                    {
                        title: 'OPTION',
                        type: 'option',
                        uid: 'F_option_1',
                        options: [
                            {
                                uid: 'F_option_31',
                                display: '',
                            },
                            {
                                uid: 'F_option_32',
                                display: '',
                            },
                        ],
                        singleton: false,
                    },
                    {
                        title: 'QUESTION',
                        type: 'question',
                        uid: 'F_question_1',
                        questions: [],
                        answers: [],
                    },
                ],
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

    return (
        <div className='test-container'>
            <div className='contract-builder'>
                <div className='view'>
                    <div className='stages'>
                        <div
                            onClick={() =>
                                setSchema(s => {
                                    s.stages.push({
                                        uid: UniqueID('stage_'),
                                        title: 'stage_1',
                                        fields: [],
                                    })
                                    return { ...s }
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
                                onAuxClick={() =>
                                    setSchema(s => {
                                        s.stages.splice(i, 1)
                                        return { ...s }
                                    })
                                }
                            >
                                <span>{s.title}</span>
                            </div>
                        ))}
                    </div>

                    <h2>{schema.stages[activeStage]!.title}</h2>

                    <div className='fields'>
                        {schema.stages[activeStage]!.fields.map((f, i) => (
                            <Field
                                key={i}
                                field={f}
                                index={i}
                                setSchema={setSchema}
                            />
                        ))}
                    </div>
                </div>
                <div className='builder'>
                    {field_types.map((f, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setSchema(s => {
                                    let fields = s.stages[activeStage]!.fields
                                    let uid = UniqueID('F_' + f + '_')
                                    switch (f) {
                                        case 'int':
                                        case 'str':
                                        case 'text':
                                            fields.push({
                                                title: f.toUpperCase(),
                                                type: f,
                                                uid,
                                                min: 0,
                                                max: 0,
                                            })
                                            break

                                        case 'geo':
                                        case 'record':
                                        case 'signature':
                                        case 'date':
                                        case 'user':
                                            fields.push({
                                                title: f.toUpperCase(),
                                                type: f,
                                                uid,
                                            })
                                            break
                                        case 'option':
                                            fields.push({
                                                title: f.toUpperCase(),
                                                type: f,
                                                uid,
                                                options: [],
                                                singleton: false,
                                            })
                                            break
                                        case 'question':
                                            fields.push({
                                                title: f.toUpperCase(),
                                                type: f,
                                                uid,
                                                questions: [],
                                                answers: [],
                                            })
                                            break
                                    }

                                    s.stages[activeStage]!.fields = fields
                                    return { ...s }
                                })
                            }}
                        >
                            {f} field
                        </button>
                    ))}
                </div>
            </div>
            <div className='output'>
                <textarea
                    ref={output}
                    onChange={e => setSchema(JSON.parse(e.currentTarget.value))}
                ></textarea>
                <button
                    onClick={() => {
                        if (!output.current || !output.current.parentElement)
                            return
                        const div = output.current.parentElement

                        if (document.fullscreenElement == div) {
                            document.exitFullscreen()
                        } else {
                            div.requestFullscreen()
                        }
                    }}
                >
                    F
                </button>
            </div>
        </div>
    )
}

type FieldProps = {
    field: FieldType
    index: number
    setSchema: Dispatch<SetStateAction<SchemaData>>
}

const Field: FC<FieldProps> = ({ field, index, setSchema }) => {
    const update = () => {
        setSchema(s => ({ ...s }))
    }

    return (
        <div className='field'>
            <span>type: {field.type}</span>
            <div className='frow'>
                <input
                    className='optinal'
                    type='checkbox'
                    checked={field.optinal || false}
                    onChange={e => {
                        const v = e.currentTarget.checked
                        field.optinal = v
                        update()
                    }}
                />
                <input
                    className='field_title'
                    type='text'
                    onChange={e => {
                        let v = e.currentTarget.value
                        if (v.length > 128) return
                        field.title = v
                        update()
                    }}
                    value={field.title}
                    placeholder='title'
                />
            </div>
            {have_minmax(field) && <MinMax field={field} update={update} />}
            {field.type == 'option' && (
                <>
                    <div className='frow'>
                        <input
                            type='checkbox'
                            checked={field.singleton}
                            id={field.type + index}
                            onChange={e => {
                                const v = e.currentTarget.checked
                                field.singleton = v
                                update()
                            }}
                        />
                        <label htmlFor={field.type + index}>singleton</label>
                    </div>
                    <button
                        onClick={() => {
                            field.options.push({
                                uid: UniqueID(`F_option_${index}_`),
                                display: '',
                            })
                            update()
                        }}
                    >
                        add an option
                    </button>
                    {field.options.map((o, oi) => (
                        <div className='frow'>
                            <input
                                name={field.uid}
                                type={field.singleton ? 'radio' : 'checkbox'}
                            />
                            <input
                                value={o.uid}
                                placeholder='unique id'
                                onChange={e => {
                                    const v = e.currentTarget.value
                                    o.uid = v
                                    update()
                                }}
                            />
                            <input
                                value={o.display}
                                placeholder='display'
                                onChange={e => {
                                    const v = e.currentTarget.value
                                    o.display = v
                                    update()
                                }}
                            />
                            <button
                                className='remove'
                                onClick={() => {
                                    field.options.splice(oi, 1)
                                    update()
                                }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </>
            )}
            {field.type == 'question' && (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Questions</th>
                                {field.answers.map((a, ai) => (
                                    <th
                                        key={ai}
                                        onContextMenu={e => {
                                            if (e.shiftKey) {
                                                e.preventDefault()
                                                field.answers.splice(ai, 1)
                                                update()
                                            }
                                        }}
                                    >
                                        <input
                                            value={a.uid}
                                            onChange={e => {
                                                a.uid = e.currentTarget.value
                                                update()
                                            }}
                                        />
                                        <input
                                            value={a.display}
                                            onChange={e => {
                                                a.display =
                                                    e.currentTarget.value
                                                update()
                                            }}
                                        />
                                    </th>
                                ))}
                                <th
                                    className='append'
                                    onClick={() => {
                                        field.answers.push({
                                            display: 'A',
                                            uid: 'a',
                                        })
                                        update()
                                    }}
                                >
                                    +
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {field.questions.map((q, qi) => (
                                <tr
                                    key={qi}
                                    onContextMenu={e => {
                                        if (e.shiftKey) {
                                            e.preventDefault()
                                            field.questions.splice(qi, 1)
                                            update()
                                        }
                                    }}
                                >
                                    <td className='frow'>
                                        <input
                                            value={q.uid}
                                            onChange={e => {
                                                q.uid = e.currentTarget.value
                                                update()
                                            }}
                                        />
                                        <input
                                            value={q.display}
                                            onChange={e => {
                                                q.display =
                                                    e.currentTarget.value
                                                update()
                                            }}
                                        />
                                    </td>
                                    {field.answers.map((_, ai) => (
                                        <td key={ai}>
                                            <input type='radio' name={q.uid} />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            <tr>
                                <td
                                    className='append'
                                    onClick={() => {
                                        field.questions.push({
                                            display: 'Q',
                                            uid: 'q',
                                        })
                                        update()
                                    }}
                                >
                                    +
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}
        </div>
    )
}

type MinMaxProps = {
    field: FieldMinMax
    update: () => void
}

const MinMax: FC<MinMaxProps> = ({ field, update }) => {
    return (
        <div className='minmax'>
            <input
                type='number'
                onChange={e => {
                    let v = parseInt(e.currentTarget.value)
                    if (isNaN(v) || v < 0) return
                    if (field.max && v > field.max) v = field.max

                    field.min = v
                    update()
                }}
                value={field.min || 0}
            />
            <input
                type='number'
                onChange={e => {
                    let v = parseInt(e.currentTarget.value)
                    if (isNaN(v) || v < 0) return
                    if (field.min && v < field.min) v = field.min

                    field.max = v
                    update()
                }}
                value={field.max || 0}
            />
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

type StrField = BaseField & {
    type: 'str'
    min?: number | null
    max?: number | null
}

type GenericField = BaseField & {
    type: 'user' | 'geo' | 'record' | 'date' | 'signature'
}

type TextField = BaseField & {
    type: 'text'
    min?: number | null
    max?: number | null
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

const field_types = [
    'option',
    'int',
    'str',
    'text',
    'user',
    'geo',
    'record',
    'date',
    'signature',
    'question',
] as const
let GGGG: typeof field_types[number] extends FieldType['type']
    ? FieldType['type'] extends typeof field_types[number]
        ? true
        : false
    : false = true
console.assert(GGGG)

type FieldMinMax = StrField | IntField | TextField
function have_minmax(f: FieldType): f is FieldMinMax {
    return ['str', 'int', 'text'].includes(f.type)
}

type Stage = BaseField & {
    fields: FieldType[]
}

type SchemaData = {
    stages: Stage[]
}

export default Test
