import { UniqueID } from '@00-team/utils'

import { FieldType } from './types'

function appendField(fields: FieldType[], type: FieldType['type']) {
    let title = type.toUpperCase()
    let uid = UniqueID('field', type)

    switch (type) {
        case 'int':
        case 'str':
        case 'text':
            fields.push({
                title,
                type,
                uid,
                min: 0,
                max: 0,
            })
            break

        case 'geo':
        case 'signature':
        case 'date':
        case 'user':
            fields.push({
                title,
                type,
                uid,
            })
            break
        case 'record':
            fields.push({
                title,
                type,
                uid,
                plural: false,
            })
            break
        case 'option':
            fields.push({
                title,
                type,
                uid,
                options: [],
                singleton: false,
            })
            break
        case 'question':
            fields.push({
                title,
                type,
                uid,
                questions: [],
                answers: [],
            })
            break
    }
}

export { appendField }
