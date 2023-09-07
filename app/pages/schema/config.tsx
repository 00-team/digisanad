import React, { FC, useRef } from 'react'

import {
    CloseIcon,
    FileIcon,
    IdIcon,
    MaximumIcon,
    MinimunIcon,
    PersonIcon,
    PlusIcon,
    QuestionIcon,
    RemoveIcon,
    TypeIcon,
} from 'icons'

import {
    FieldMinMax,
    FieldType,
    LinkField,
    OptionFeild,
    PriceField,
    QuestionField,
    RecordField,
    SchemaData,
} from './types'

type ConfigProps = {
    schema: SchemaData
    field: FieldType
    update: () => void
}

type user_uid_titles = [string, string | undefined][]

const Config: FC<ConfigProps> = ({ field, update, schema }) => {
    let user_uids: user_uid_titles = Object.entries(schema.fields)
        .filter(([, v]) => v.type == 'user')
        .map(([k, v]) => [k, v.title])

    return (
        <div className='field-config'>
            <div className='config-row title_smaller'>
                <div className='holder'>
                    <TypeIcon size={25} />
                    نوع :
                </div>
                <div className='data'>{field.type}</div>
            </div>
            <div className='config-row title_smaller'>
                <div className='holder'>
                    <IdIcon size={25} />
                    شناسه :
                </div>

                <div className='data'>
                    <input
                        className='uid-input'
                        type='text'
                        value={field.uid}
                        onChange={() => {
                            // let new_uid = e.currentTarget.value
                        }}
                    />
                </div>
            </div>

            <div className='input-wrapper'>
                <h4 className='input-title title_smaller'>عنوان وروردی</h4>
                <input
                    type='text'
                    value={field.title || ''}
                    className='title_smaller'
                    onInput={e => {
                        field.title = e.currentTarget.value
                        update()
                    }}
                    placeholder='عنوان وروردی'
                />
            </div>

            <div className='config-row optional title_smaller'>
                <label className='holder' htmlFor='fc_optinal'>
                    <QuestionIcon size={25} />
                    اختیاری
                </label>
                <input
                    id='fc_optinal'
                    type='checkbox'
                    checked={field.optional}
                    onChange={e => {
                        field.optional = e.currentTarget.checked
                        update()
                    }}
                />
            </div>

            <div className='config-row'>
                <label className='holder'>
                    <PersonIcon size={25} />
                    تغییر دهنده:
                </label>
                {field.type == 'user' ? (
                    <span style={{ flexShrink: 0 }}>سازنده قرارداد</span>
                ) : (
                    <select
                        onChange={e => {
                            let uid = e.currentTarget.value
                            if (!uid) field.changers = []
                            else field.changers = [uid]
                            update()
                        }}
                    >
                        <option value=''>همه</option>
                        {user_uids.map(([uid, title], i) => (
                            <option key={i} value={uid}>
                                {title || uid}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {field.type in config_fields &&
                /* @ts-ignore */
                config_fields[field.type]({ field, schema, update })}
        </div>
    )
}

type FieldProps<T> = FC<{
    schema: SchemaData
    field: T
    update: (save?: true) => void
}>

type X = PriceField['senders']
function update_pct(input: X): X {
    if (!input.length) return []

    let sum = 0
    let output: X = input.map((u, _, a) => {
        let pct = Math.floor(100 / a.length)
        sum += pct
        return [u[0], pct]
    })
    output[output.length - 1]![1] += 100 - sum
    return output
}

const PriceConfig: FieldProps<PriceField> = ({ field, update, schema }) => {
    let user_fields = Object.entries(schema.fields).filter(
        uf => uf[1].type == 'user'
    )
    let uid_user: Map<string, string> = new Map(
        user_fields.map(([uid, f]) => {
            return [uid, f.title || f.uid]
        })
    )

    const senders = useRef<HTMLSelectElement>(null)
    const receivers = useRef<HTMLSelectElement>(null)

    let both = field.receivers.concat(field.senders).map(x => x[0])

    return (
        <>
            <div className='config-row price'>
                <label className='holder'>
                    <PersonIcon size={25} />
                    پرداخت کنندگان
                </label>
                <ul className='usr-pct-list'>
                    {!field.senders.length && <li className='empty'>هیچکس</li>}
                    {field.senders.map(([uid, pct], i) => (
                        <li key={i}>
                            <span className='name'>{uid_user.get(uid)}</span>
                            <span className='pct'>{pct}%</span>
                            <span
                                className='remove'
                                onClick={() => {
                                    field.senders.splice(i, 1)
                                    field.senders = update_pct(field.senders)
                                    update()
                                }}
                            >
                                <RemoveIcon />
                            </span>
                        </li>
                    ))}
                </ul>
                <div className='add-user'>
                    <select ref={senders}>
                        {user_fields
                            .filter(uf => !both.includes(uf[0]))
                            .map(([uid, field], i) => (
                                <option key={i} value={uid}>
                                    {field.title || uid}
                                </option>
                            ))}
                    </select>
                    <button
                        onClick={() => {
                            if (!senders.current) return

                            field.senders = update_pct(
                                field.senders.concat([
                                    [senders.current.value, 0],
                                ])
                            )
                            update()
                        }}
                    >
                        <PlusIcon />
                    </button>
                </div>
            </div>
            <div className='config-row price'>
                <label className='holder'>
                    <PersonIcon size={25} />
                    دریافت کنندگان
                </label>
                <ul className='usr-pct-list'>
                    {!field.receivers.length && (
                        <li className='empty'>هیچکس</li>
                    )}
                    {field.receivers.map(([uid, pct], i) => (
                        <li key={i}>
                            <span className='name'>{uid_user.get(uid)}</span>
                            <span className='pct'>{pct}%</span>
                            <span
                                className='remove'
                                onClick={() => {
                                    field.receivers.splice(i, 1)
                                    field.receivers = update_pct(
                                        field.receivers
                                    )
                                    update()
                                }}
                            >
                                <RemoveIcon />
                            </span>
                        </li>
                    ))}
                </ul>
                <div className='add-user'>
                    <select ref={receivers}>
                        {user_fields
                            .filter(uf => !both.includes(uf[0]))
                            .map(([uid, field], i) => (
                                <option key={i} value={uid}>
                                    {field.title || uid}
                                </option>
                            ))}
                    </select>
                    <button
                        onClick={() => {
                            if (!receivers.current) return

                            field.receivers = update_pct(
                                field.receivers.concat([
                                    [receivers.current.value, 0],
                                ])
                            )
                            update()
                        }}
                    >
                        <PlusIcon />
                    </button>
                </div>
            </div>
        </>
    )
}

const RecordConfig: FieldProps<RecordField> = ({ field, update }) => {
    return (
        <div className='config-row'>
            <label htmlFor='fc_plural' className='holder title_smaller'>
                <FileIcon size={25} />
                چند فایلی
            </label>
            <div className='data'>
                <input
                    id='fc_plural'
                    type='checkbox'
                    checked={field.plural}
                    onChange={e => {
                        field.plural = e.currentTarget.checked
                        update()
                    }}
                />
            </div>
        </div>
    )
}

const LinkConfig: FieldProps<LinkField> = ({ field, update }) => {
    return (
        <>
            <div className='input-wrapper'>
                <h4 className='input-title title_smaller'>توضیحات وروردی</h4>
                <textarea
                    value={field.text || ''}
                    onInput={e => {
                        field.text = e.currentTarget.value
                        update()
                    }}
                    placeholder='توضیحات وروردی'
                    className='title_smaller'
                ></textarea>
            </div>

            <input
                type='text'
                value={field.url || ''}
                onInput={e => {
                    field.url = e.currentTarget.value
                    update()
                }}
                placeholder='url'
            />
        </>
    )
}

const OptionConfig: FieldProps<OptionFeild> = ({ field, update }) => {
    return (
        <>
            <div className='config-row'>
                <div className='holder'>
                    <QuestionIcon size={25} />
                    <label htmlFor='fc_singleton'>تک گزینه ای</label>
                </div>
                <div className='data'>
                    <input
                        type='checkbox'
                        checked={field.singleton}
                        id='fc_singleton'
                        onChange={e => {
                            const v = e.currentTarget.checked
                            field.singleton = v
                            update()
                        }}
                    />
                </div>
            </div>

            <button
                className='add-option title_smaller'
                onClick={() => {
                    field.options.push({
                        uid: 'o' + field.options.length,
                        display: '',
                    })
                    update()
                }}
            >
                اضافه شرط
            </button>

            {field.options.map((o, oi) => (
                <div className='option-row' key={oi}>
                    <div className='inputs-wrapper'>
                        <div className='input-wrapper'>
                            <h4 className='input-title title_smaller'>
                                عنوان ورودی
                            </h4>
                            <input
                                value={o.uid}
                                placeholder='unique id'
                                onChange={e => {
                                    const v = e.currentTarget.value
                                    o.uid = v
                                    update()
                                }}
                            />
                        </div>
                        <div className='input-wrapper'>
                            <h4 className='input-title title_smaller'>
                                توضیحات ورودی
                            </h4>
                            <input
                                value={o.display}
                                placeholder='display'
                                onChange={e => {
                                    const v = e.currentTarget.value
                                    o.display = v
                                    update()
                                }}
                            />
                        </div>
                    </div>
                    <button
                        className='remove'
                        onClick={() => {
                            field.options.splice(oi, 1)
                            update()
                        }}
                    >
                        <CloseIcon size={25} />
                    </button>
                </div>
            ))}
        </>
    )
}

const MinMaxConfig: FieldProps<FieldMinMax> = ({ field, update }) => {
    return (
        <div className='numbers-wrapper'>
            <div className='input-number-wrapper title_smaller'>
                <div className='holder'>
                    <MaximumIcon size={25} />
                    حداکثر:
                </div>
                <div className='data'>
                    <input
                        type='number'
                        inputMode='numeric'
                        value={field.max || -1}
                        className='input-max input-number'
                        onInput={e => {
                            field.min = field.min || 0
                            field.max = field.max || -1

                            let new_value = parseInt(e.currentTarget.value)
                            let dir = field.max < new_value ? 'up' : 'down'

                            if (new_value == 0) {
                                if (dir == 'up') field.max = 1
                                else field.max = -1
                            } else {
                                field.max = new_value
                            }

                            if (field.max < field.min) {
                                if (dir == 'down') field.max = -1
                                else field.max = field.min
                            }

                            update()
                        }}
                        placeholder='حداقل ورودی'
                        title='حداقل ورودی'
                    />
                </div>
            </div>
            <div className='input-number-wrapper title_smaller'>
                <div className='holder'>
                    <MinimunIcon size={25} />
                    حداقل:
                </div>
                <div className='data'>
                    <input
                        type='number'
                        inputMode='numeric'
                        value={field.min || 0}
                        className='input-max input-number'
                        onInput={e => {
                            field.min = parseInt(e.currentTarget.value)
                            field.max = field.max || -1
                            if (field.min < 0) field.min = 0
                            if (field.max > 0 && field.min > field.max)
                                field.min = field.max

                            update()
                        }}
                        placeholder='حداقل ورودی'
                        title='حداقل ورودی'
                    />
                </div>
            </div>
        </div>
    )
}

const QuestionConfig: FieldProps<QuestionField> = ({ field, update }) => {
    return (
        <div className='questions-container'>
            <div className='questions-wrapper container-row'>
                <h3 className='questions-header title_small container-row-header'>
                    سطر ها
                </h3>
                <button
                    className='add-question add-btn title_smaller'
                    onClick={() => {
                        field.questions.push({
                            uid: 'عنوان...',
                            display: 'توضیح...',
                        })
                        update()
                    }}
                >
                    اضافه سطر
                </button>
                {field.questions.map((q, qi) => (
                    <div className='question-wrapper option-row' key={qi}>
                        <div className='inputs-wrapper'>
                            <div className='input-wrapper'>
                                <h4 className='title_smaller'>شناسه سوال</h4>
                                <input
                                    className='title_smaller'
                                    value={q.uid}
                                    onChange={e => {
                                        q.uid = e.currentTarget.value
                                        update()
                                    }}
                                />
                            </div>

                            <div className='question-wrapper input-wrapper'>
                                <h4 className='title_smaller'>عنوان سوال</h4>
                                <input
                                    value={q.display}
                                    onChange={e => {
                                        q.display = e.currentTarget.value
                                        update()
                                    }}
                                />
                            </div>
                        </div>
                        <button
                            className='remove'
                            onClick={() => {
                                field.questions.splice(qi, 1)
                                update()
                            }}
                        >
                            <CloseIcon size={25} />
                        </button>
                    </div>
                ))}
            </div>
            <div className='container-row'>
                <h3 className='title_small container-row-header'>ستون ها</h3>
                <button
                    className='add-question add-btn title_smaller'
                    onClick={() => {
                        field.answers.push({
                            uid: 'A0',
                            display: 'عنوان...',
                        })
                        update()
                    }}
                >
                    اضافه ستون
                </button>
                {field.answers.map((a, ai) => (
                    <div className='question-wrapper option-row' key={ai}>
                        <div className='inputs-wrapper'>
                            <div className='input-wrapper'>
                                <h4 className='title_smaller'>شناسه جواب</h4>
                                <input
                                    className='title_smaller'
                                    value={a.uid}
                                    onChange={e => {
                                        a.uid = e.currentTarget.value
                                        update()
                                    }}
                                />
                            </div>

                            <div className='question-wrapper input-wrapper'>
                                <h4 className='title_smaller'>عنوان جواب</h4>
                                <input
                                    value={a.display}
                                    onChange={e => {
                                        a.display = e.currentTarget.value
                                        update()
                                    }}
                                />
                            </div>
                        </div>
                        <button
                            className='remove'
                            onClick={() => {
                                field.answers.splice(ai, 1)
                                update()
                            }}
                        >
                            <CloseIcon size={25} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

type FMD = {
    [T in FieldType as T['type']]?: FieldProps<T>
}

const config_fields: FMD = {
    price: PriceConfig,
    record: RecordConfig,
    link: LinkConfig,
    option: OptionConfig,
    str: props => <MinMaxConfig {...props} />,
    int: props => <MinMaxConfig {...props} />,
    text: props => <MinMaxConfig {...props} />,
    question: QuestionConfig,
}

export { Config }
