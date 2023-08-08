import React, { FC } from 'react'

import { FieldType } from './types'

type FieldConfigProps = {
    field: FieldType
    update: () => void
}

const FieldConfig: FC<FieldConfigProps> = ({ field, update }) => {
    return (
        <div className='field-config'>
            <input
                type='text'
                value={field.title}
                onInput={e => {
                    field.title = e.currentTarget.value
                    update()
                }}
                placeholder='title'
            />
            {field.uid} - {field.title} - {field.type}
        </div>
    )
}

export { FieldConfig }
