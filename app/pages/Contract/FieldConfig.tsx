import React, { FC } from 'react'

import {
    CloseSvg,
    IdSvg,
    MaximumSvg,
    MinimunSvg,
    QuestionSvg,
    TypeSvg,
} from 'icons'

import { FieldType, have_minmax } from './types'

type FieldConfigProps = {
    field: FieldType
    update: () => void
}

const FieldConfig: FC<FieldConfigProps> = ({ field, update }) => {
    return (
        <div className='field-config'>
            <div className='config-row title_smaller'>
                <div className='holder'>
                    <TypeSvg size={25} />
                    نوع :
                </div>
                <div className='data'>{field.type}</div>
            </div>
            <div className='config-row title_smaller'>
                <div className='holder'>
                    <IdSvg size={25} />
                    شناسه :
                </div>
                <div className='data'>{field.uid}</div>
            </div>
            <div className='config-row optional title_smaller'>
                <label className='holder' htmlFor='fc_optinal'>
                    <QuestionSvg size={25} />
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
            <div className='input-wrapper'>
                <h4 className='input-title title_smaller'>عنوان وروردی</h4>
                <input
                    type='text'
                    value={field.title}
                    className='title_smaller'
                    onInput={e => {
                        field.title = e.currentTarget.value
                        update()
                    }}
                    placeholder='عنوان وروردی'
                />
            </div>
            <div className='input-wrapper'>
                <h4 className='input-title title_smaller'>توضیحات وروردی</h4>
                <textarea
                    value={field.description || ''}
                    onInput={e => {
                        field.description = e.currentTarget.value
                        update()
                    }}
                    placeholder='توضیحات وروردی'
                    className='title_smaller'
                ></textarea>
            </div>

            {field.type == 'record' && (
                <div className='row'>
                    <input
                        id='fc_plural'
                        type='checkbox'
                        checked={field.plural}
                        onChange={e => {
                            field.plural = e.currentTarget.checked
                            update()
                        }}
                    />
                    <label htmlFor='fc_plural'>Plural</label>
                </div>
            )}
            {field.type == 'link' && (
                <input
                    type='text'
                    value={field.url}
                    onInput={e => {
                        field.url = e.currentTarget.value
                        update()
                    }}
                    placeholder='url'
                />
            )}
            {have_minmax(field) && (
                <div className='numbers-wrapper'>
                    <div className='input-number-wrapper title_smaller'>
                        <div className='holder'>
                            <MaximumSvg size={25} />
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
                            <MinimunSvg size={25} />
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
                            <QuestionSvg size={25} />
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
                            {/* <input
                                name={field.uid}
                                type={field.singleton ? 'radio' : 'checkbox'}
                            /> */}
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
                                <CloseSvg size={25} />
                            </button>
                        </div>
                    ))}
                </>
            )}

            {field.type == 'question' && (
                <div className='questions-container'>
                    <div className='questions-wrapper'>
                        <h3 className='questions-header title_small'>سطر ها</h3>
                        {field.questions.map((q, qi) => (
                            <>
                                <div
                                    key={qi}
                                    className='question-wrapper input-wrapper'
                                >
                                    <h4 className='title_smaller'>
                                        عنوان سوال
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
                                <div
                                    key={qi}
                                    className='question-wrapper input-wrapper'
                                    style={{ marginTop: '-1vh' }}
                                >
                                    <h4 className='title_smaller'>
                                        توضیحات سوال
                                    </h4>
                                    <input
                                        value={q.display}
                                        onChange={e => {
                                            q.display = e.currentTarget.value
                                            update()
                                        }}
                                    />
                                </div>
                            </>
                            // <tr key={qi}>
                            //     <td className='row'>

                            //     </td>
                            //     {field.answers.map((_, ai) => (
                            //         <td key={ai}>
                            //             <input type='radio' name={q.uid} />
                            //         </td>
                            //     ))}
                            //     <td
                            //         className='remove'
                            //         onClick={() => {
                            //             field.questions.splice(qi, 1)
                            //             update()
                            //         }}
                            //     >
                            //         X
                            //     </td>
                            // </tr>
                        ))}
                    </div>
                    <div className='answers-wrapper'></div>
                </div>
                // <table className='questions'>
                //     <thead>
                //         <tr>
                //             <th style={{ width: '70%' }}>Questions</th>
                //             {field.answers.map((a, ai) => (
                //                 <th key={ai}>
                //                     <input
                //                         value={a.uid}
                //                         onChange={e => {
                //                             a.uid = e.currentTarget.value
                //                             update()
                //                         }}
                //                     />
                //                     <input
                //                         value={a.display}
                //                         onChange={e => {
                //                             a.display = e.currentTarget.value
                //                             update()
                //                         }}
                //                     />
                //                 </th>
                //             ))}
                //             <th
                //                 className='append'
                //                 onClick={() => {
                //                     field.answers.push({
                //                         display: 'A',
                //                         uid: 'a',
                //                     })
                //                     update()
                //                 }}
                //             >
                //                 +
                //             </th>
                //         </tr>
                //     </thead>
                //     <tbody>
                //         {field.questions.map((q, qi) => (
                //             <tr key={qi}>
                //                 <td className='row'>
                //                     <input
                //                         style={{ width: '30%' }}
                //                         value={q.uid}
                //                         onChange={e => {
                //                             q.uid = e.currentTarget.value
                //                             update()
                //                         }}
                //                     />
                //                     <input
                //                         value={q.display}
                //                         onChange={e => {
                //                             q.display = e.currentTarget.value
                //                             update()
                //                         }}
                //                     />
                //                 </td>
                //                 {field.answers.map((_, ai) => (
                //                     <td key={ai}>
                //                         <input type='radio' name={q.uid} />
                //                     </td>
                //                 ))}
                //                 <td
                //                     className='remove'
                //                     onClick={() => {
                //                         field.questions.splice(qi, 1)
                //                         update()
                //                     }}
                //                 >
                //                     X
                //                 </td>
                //             </tr>
                //         ))}

                //         <tr>
                //             <td
                //                 className='append'
                //                 onClick={() => {
                //                     field.questions.push({
                //                         display: 'Q',
                //                         uid: 'q',
                //                     })
                //                     update()
                //                 }}
                //             >
                //                 +
                //             </td>
                //             {field.answers.map((_, ai) => (
                //                 <td
                //                     key={ai}
                //                     className='remove'
                //                     onClick={() => {
                //                         field.answers.splice(ai, 1)
                //                         update()
                //                     }}
                //                 >
                //                     X
                //                 </td>
                //             ))}
                //         </tr>
                //     </tbody>
                // </table>
            )}
        </div>
    )
}

export { FieldConfig }
