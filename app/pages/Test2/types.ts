import {
    CallenderSvg,
    FileSvg,
    LinkSvg,
    MapSvg,
    NumberSvg,
    OptionSvg,
    PersonSvg,
    QuestionSvg,
    SignatureSvg,
    TextareaSvg,
    TextSvg,
} from 'icons'

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
    display: string
    Icon: Icon | null
    description?: string | null
    optinal?: boolean
}

export type GeoField = BaseField & {
    type: 'geo'
    value: {
        latitude: number
        longitude: number
    }
}

export type DateField = BaseField & {
    type: 'date'
    value: number
}

export type SignatureField = BaseField & {
    type: 'signature'
    value: string
}

export type UserField = BaseField & {
    type: 'user'
    value: string
}

export type IntField = BaseField & {
    type: 'int'
    min?: number | null
    max?: number | null
    value: number
}

export type StrField = BaseField & {
    type: 'str'
    min?: number | null
    max?: number | null
    value: string
}

export type TextField = BaseField & {
    type: 'text'
    min?: number | null
    max?: number | null
    value: string
}

export type LinkField = BaseField & {
    type: 'link'
    url: string
}

export type RecordField = BaseField & {
    type: 'record'
    plural: boolean
    value: string[]
}

export type UIDD = {
    uid: string
    display: string
}

export type QuestionField = BaseField & {
    type: 'question'
    answers: UIDD[]
    questions: UIDD[]
    value: {
        [key: string]: string
    }
}

export type OptionFeild = BaseField & {
    type: 'option'
    singleton: boolean
    options: UIDD[]
    value: string[]
}

export type FieldType =
    | IntField
    | StrField
    | UserField
    | GeoField
    | DateField
    | SignatureField
    | LinkField
    | OptionFeild
    | QuestionField
    | TextField
    | RecordField

type X = {
    [T in FieldType as T['type']]: T
}
const default_fields: X = {
    link: {
        type: 'link',
        display: 'لینک',
        Icon: LinkSvg,
        uid: '',
        title: 'Lonk',
        url: 'https://example.com',
    },
    option: {
        type: 'option',
        display: 'انتخابی',
        Icon: OptionSvg,
        uid: '',
        title: 'Option',
        options: [],
        optinal: false,
        singleton: false,
        description: '',
        value: [],
    },
    int: {
        type: 'int',
        display: 'عدد',
        Icon: NumberSvg,
        uid: '',
        title: 'Number',
        description: '',
        optinal: false,
        max: null,
        min: null,
        value: 0,
    },
    str: {
        type: 'str',
        display: 'متن',
        Icon: TextSvg,
        uid: '',
        title: 'String',
        description: '',
        optinal: false,
        max: null,
        min: null,
        value: '',
    },
    text: {
        type: 'text',
        display: 'متن چند خطی',
        Icon: TextareaSvg,
        uid: '',
        title: 'Text',
        description: '',
        optinal: false,
        max: null,
        min: null,
        value: '',
    },
    geo: {
        type: 'geo',
        Icon: MapSvg,
        display: 'نقشه',
        uid: '',
        title: 'Geo',
        description: '',
        optinal: false,
        value: {
            latitude: 0,
            longitude: 0,
        },
    },
    user: {
        type: 'user',
        display: 'کاربر',
        Icon: PersonSvg,
        uid: '',
        value: '',
        title: 'User',
        description: '',
        optinal: false,
    },
    record: {
        type: 'record',
        display: 'ضمیمه',
        Icon: FileSvg,
        uid: '',
        title: 'Record / File',
        description: '',
        optinal: false,
        plural: false,
        value: [],
    },
    date: {
        type: 'date',
        display: 'تاریخ',
        Icon: CallenderSvg,
        uid: '',
        title: 'Date',
        description: '',
        optinal: false,
        value: 0,
    },
    question: {
        type: 'question',
        display: 'سوال',
        Icon: QuestionSvg,
        uid: '',
        title: 'Questions',
        description: '',
        optinal: false,
        questions: [],
        answers: [],
        value: {},
    },
    signature: {
        type: 'signature',
        Icon: SignatureSvg,
        display: 'امضا دیجیتال',
        uid: '',
        title: 'Signature',
        description: '',
        optinal: false,
        value: '',
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
