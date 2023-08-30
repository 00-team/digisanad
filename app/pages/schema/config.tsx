import React, { FC } from 'react'

import {
    CloseIcon,
    FileIcon,
    IdIcon,
    MaximumIcon,
    MinimunIcon,
    QuestionIcon,
    TypeIcon,
} from 'icons'

import { FieldType, have_minmax, SchemaData } from './types'

type ConfigProps = {
    schema: SchemaData
    field: FieldType
    user_uids: string[]
    update: () => void
}

const Config: FC<ConfigProps> = ({ field, update, user_uids }) => {
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
                        type='text'
                        value={field.uid}
                        onChange={e => {
                            let new_uid = e.currentTarget.value
                            console.log(new_uid)
                        }}
                    />
                </div>
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
                <select>
                    {user_uids.map((u, i) => (
                        <option key={i} value={u}>
                            {u}
                        </option>
                    ))}
                </select>
            </div>
            {'title' in field && (
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
            )}

            {field.type == 'record' && (
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
            )}
            {field.type == 'link' && (
                <>
                    <div className='input-wrapper'>
                        <h4 className='input-title title_smaller'>
                            توضیحات وروردی
                        </h4>
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
            )}
            {have_minmax(field) && (
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

                                    let new_value = parseInt(
                                        e.currentTarget.value
                                    )
                                    let dir =
                                        field.max < new_value ? 'up' : 'down'

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
            )}
            {field.type == 'option' && (
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
            )}

            {field.type == 'question' && (
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
                            <div
                                className='question-wrapper option-row'
                                key={qi}
                            >
                                <div className='inputs-wrapper'>
                                    <div className='input-wrapper'>
                                        <h4 className='title_smaller'>
                                            شناسه سوال
                                        </h4>
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
                                        <h4 className='title_smaller'>
                                            عنوان سوال
                                        </h4>
                                        <input
                                            value={q.display}
                                            onChange={e => {
                                                q.display =
                                                    e.currentTarget.value
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
                        <h3 className='title_small container-row-header'>
                            ستون ها
                        </h3>
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
                            <div
                                className='question-wrapper option-row'
                                key={ai}
                            >
                                <div className='inputs-wrapper'>
                                    <div className='input-wrapper'>
                                        <h4 className='title_smaller'>
                                            شناسه جواب
                                        </h4>
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
                                        <h4 className='title_smaller'>
                                            عنوان جواب
                                        </h4>
                                        <input
                                            value={a.display}
                                            onChange={e => {
                                                a.display =
                                                    e.currentTarget.value
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
            )}
        </div>
    )
}

export { Config }
