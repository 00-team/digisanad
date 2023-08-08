import React, { FC } from 'react'

import { FieldType } from './types'

type FieldConfigProps = {
    field: FieldType
    update: () => void
}

const FieldConfig: FC<FieldConfigProps> = ({ field, update }) => {
    return (
        <div className='field-config'>
            <span>type: {field.type}</span>
            <span>uid: {field.uid}</span>
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
        </div>
    )
}

export { FieldConfig }
