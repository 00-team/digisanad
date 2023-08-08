import React, { FC } from 'react'

import { FieldType, have_minmax } from './types'

type FieldConfigProps = {
    field: FieldType
    update: () => void
}

const FieldConfig: FC<FieldConfigProps> = ({ field, update }) => {
    return (
        <div className='field-config'>
            <div className='row' style={{ justifyContent: 'space-around' }}>
                <span>type: {field.type}</span>
                <span>uid: {field.uid}</span>
            </div>
            <div className='row'>
                <input
                    id='fc_optinal'
                    type='checkbox'
                    checked={field.optinal}
                    onChange={e => {
                        field.optinal = e.currentTarget.checked
                        update()
                    }}
                />
                <label htmlFor='fc_optinal'>Optinal</label>
            </div>
            <input
                type='text'
                value={field.title}
                onInput={e => {
                    field.title = e.currentTarget.value
                    update()
                }}
                placeholder='title'
            />
            <textarea
                value={field.description || ''}
                onInput={e => {
                    field.description = e.currentTarget.value
                    update()
                }}
                placeholder='description'
            ></textarea>
            {have_minmax(field) && (
                <div className='row'>
                    <input
                        type='number'
                        value={field.min || 0}
                        onInput={e => {
                            field.min = parseInt(e.currentTarget.value)
                            field.max = field.max || -1
                            if (field.min < 0) field.min = 0
                            if (field.max > 0 && field.min > field.max)
                                field.min = field.max

                            update()
                        }}
                        placeholder='min'
                        title='min'
                    />
                    <input
                        type='number'
                        value={field.max || -1}
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
                        placeholder='max'
                        title='max'
                    />
                </div>
            )}
        </div>
    )
}

export { FieldConfig }
