import React, { FC } from 'react'

import { FieldType } from './types'

type FieldConfigProps = {
    field: FieldType
    update: () => void
}

const FieldConfig: FC<FieldConfigProps> = ({ field }) => {
    return (
        <div className='field-config'>
            {field.uid} - {field.title} - {field.type}
        </div>
    )
}

export { FieldConfig }
