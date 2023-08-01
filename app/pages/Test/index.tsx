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

import { property } from './property'
import './test.scss'
import {
    SchemaData,
    have_minmax,
    field_types,
    FieldMinMax,
    FieldType,
} from './types'

const Test: FC = () => {
    const output = useRef<ElementRef<'textarea'>>(null)
    const [activeStage, setActiveStage] = useState(0)
    const [schema, setSchema] = useState<SchemaData>(property as SchemaData)

    useEffect(() => {
        if (!output.current) return

        output.current.value = JSON.stringify(schema, null, 2)
        if (!schema.stages.length) {
            setActiveStage(0)
            return
        }

        if (activeStage >= schema.stages.length) {
            setActiveStage(schema.stages.length - 1)
        } else if (activeStage < 0) {
            setActiveStage(0)
        }
    }, [schema, activeStage])

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
                                <button
                                    className='remove'
                                    onClick={() => {
                                        setSchema(s => {
                                            s.stages.splice(i, 1)
                                            return { ...s }
                                        })
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>

                    {schema.stages[activeStage] && (
                        <input
                            className='stage_title'
                            value={schema.stages[activeStage]!.title}
                            onChange={e => {
                                const v = e.currentTarget.value
                                setSchema(s => {
                                    s.stages[activeStage]!.title = v
                                    return { ...s }
                                })
                            }}
                        />
                    )}

                    {schema.stages[activeStage] && (
                        <div className='fields'>
                            {schema.stages[activeStage]!.fields.map((f, i) => (
                                <Field
                                    key={i}
                                    field={f}
                                    index={i}
                                    stage={activeStage}
                                    setSchema={setSchema}
                                />
                            ))}
                        </div>
                    )}
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
    stage: number
    setSchema: Dispatch<SetStateAction<SchemaData>>
}

const Field: FC<FieldProps> = ({ field, stage, index, setSchema }) => {
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
                        <div className='frow' key={oi}>
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
                                style={{ borderColor: '#E20338' }}
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
                                <th style={{ width: '70%' }}>Questions</th>
                                {field.answers.map((a, ai) => (
                                    <th key={ai}>
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
                                <tr key={qi}>
                                    <td className='frow'>
                                        <input
                                            style={{ width: '30%' }}
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
                                    <td
                                        className='remove'
                                        onClick={() => {
                                            field.questions.splice(qi, 1)
                                            update()
                                        }}
                                    >
                                        X
                                    </td>
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
                                {field.answers.map((_, ai) => (
                                    <td
                                        key={ai}
                                        className='remove'
                                        onClick={() => {
                                            field.answers.splice(ai, 1)
                                            update()
                                        }}
                                    >
                                        X
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </>
            )}
            <button
                style={{ borderColor: '#E20338' }}
                onClick={() => {
                    setSchema(s => {
                        s.stages[stage]!.fields.splice(index, 1)
                        return { ...s }
                    })
                }}
            >
                DELETE
            </button>
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

export default Test
