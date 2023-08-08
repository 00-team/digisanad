type Page = {
    content: string
}

type Schema = {
    pages: Page[]
    fields: {
        [uid: string]: FieldType
    }
}

export type BaseField = {
    uid: string
    title: string
    description?: string | null
    optinal?: boolean
}

export type GenericField = BaseField & {
    type: 'geo' | 'date' | 'signature'
}

export type UserField = BaseField & {
    type: 'user'
    value: string
}

export type IntField = BaseField & {
    type: 'int'
    min?: number | null
    max?: number | null
}

export type StrField = BaseField & {
    type: 'str'
    min?: number | null
    max?: number | null
}

export type TextField = BaseField & {
    type: 'text'
    min?: number | null
    max?: number | null
}

export type RecordField = BaseField & {
    type: 'record'
    plural: boolean
}

export type UIDD = {
    uid: string
    display: string
}

export type QuestionField = BaseField & {
    type: 'question'
    answers: UIDD[]
    questions: UIDD[]
}

export type OptionFeild = BaseField & {
    type: 'option'
    singleton: boolean
    options: UIDD[]
}

export type FieldType =
    | IntField
    | StrField
    | UserField
    | GenericField
    | OptionFeild
    | QuestionField
    | TextField
    | RecordField

type X = {
    [T in FieldType as T['type']]: T
}
const default_fields: X = {
    option: {
        type: 'option',
        uid: '',
        title: 'Option',
        options: [],
        optinal: false,
        singleton: false,
        description: '',
    },
    int: {
        type: 'int',
        uid: '',
        title: 'Number',
        description: '',
        optinal: false,
        max: null,
        min: null,
    },
    str: {
        type: 'str',
        uid: '',
        title: 'String',
        description: '',
        optinal: false,
        max: null,
        min: null,
    },
    text: {
        type: 'text',
        uid: '',
        title: 'Text',
        description: '',
        optinal: false,
        max: null,
        min: null,
    },
    geo: {
        type: 'geo',
        uid: '',
        title: 'Geo',
        description: '',
        optinal: false,
    },
    user: {
        type: 'user',
        uid: '',
        value: '',
        title: 'User',
        description: '',
        optinal: false,
    },
    record: {
        type: 'record',
        uid: '',
        title: 'Record / File',
        description: '',
        optinal: false,
        plural: false,
    },
    date: {
        type: 'date',
        uid: '',
        title: 'Date',
        description: '',
        optinal: false,
    },
    question: {
        type: 'question',
        uid: '',
        title: 'Questions',
        description: '',
        optinal: false,
        questions: [],
        answers: [],
    },
    signature: {
        type: 'signature',
        uid: '',
        title: 'Signature',
        description: '',
        optinal: false,
    },
}

const field_types = Object.keys(default_fields) as Array<
    keyof typeof default_fields
>

export type FieldMinMax = StrField | IntField | TextField
function have_minmax(f: FieldType): f is FieldMinMax {
    return ['str', 'int', 'text'].includes(f.type)
}

export { Schema, Page, field_types, default_fields, have_minmax }
