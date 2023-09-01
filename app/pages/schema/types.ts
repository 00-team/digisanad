import { FC } from 'react'

import {
    CallenderIcon,
    DollarIcon,
    FileIcon,
    LinkIcon,
    MapIcon,
    NumberIcon,
    OptionIcon,
    PersonIcon,
    QuestionIcon,
    SignatureIcon,
    TextareaIcon,
    TextIcon,
} from 'icons'

type UID = string

type Page = {
    content: string
}

type UserPublic = {
    user_id: number
    phone: string
    first_name: string
    last_name: string
}

type SchemaData = {
    pages: Page[]
    fields: {
        [uid: UID]: FieldType
    }
}

export type FieldViewProps = {
    display: string
    Icon: Icon
}

export type BaseField = {
    uid: UID
    // title: string
    // description?: string | null
    optional?: boolean
    changers: UID[]
    lock: boolean
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

export type PriceField = BaseField & {
    type: 'price'
    value: number
    payer: UID
}

export type SignatureField = BaseField & {
    type: 'signature'
    value: [number, string]
}

export type UserField = BaseField & {
    type: 'user'
    value: number | null
}

export type IntField = BaseField & {
    type: 'int'
    placeholder?: string
    min?: number | null
    max?: number | null
    value: number
}

export type StrField = BaseField & {
    type: 'str'
    placeholder?: string
    min?: number | null
    max?: number | null
    value: string
}

export type TextField = BaseField & {
    type: 'text'
    placeholder?: string
    min?: number | null
    max?: number | null
    value: string
}

export type LinkField = BaseField & {
    type: 'link'
    title?: string
    text: string
    url: string
}

export type RecordField = BaseField & {
    type: 'record'
    plural: boolean
    value: [number, string][]
}

export type UIDD = {
    uid: string
    display: string
}

export type QuestionField = BaseField & {
    type: 'question'
    title: string
    answers: UIDD[]
    questions: UIDD[]
    value: {
        [key: string]: string
    }
}

export type OptionFeild = BaseField & {
    type: 'option'
    title: string
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
    | PriceField

type X = {
    [T in FieldType as T['type']]: T
}
const default_fields: X = {
    price: {
        type: 'price',
        changers: [],
        uid: '',
        payer: '',
        value: 0,
        lock: false,
    },
    link: {
        type: 'link',
        changers: [],
        uid: '',
        text: '...',
        title: 'Lonk',
        url: 'https://example.com',
        lock: false,
    },
    option: {
        type: 'option',
        changers: [],
        title: '',
        uid: '',
        options: [],
        optional: false,
        singleton: false,
        value: [],
        lock: false,
    },
    int: {
        type: 'int',
        changers: [],
        uid: '',
        optional: false,
        max: null,
        min: null,
        value: 0,
        lock: false,
    },
    str: {
        type: 'str',
        changers: [],
        uid: '',
        optional: false,
        max: null,
        min: null,
        value: '',
        placeholder: 'string',
        lock: false,
    },
    text: {
        type: 'text',
        changers: [],
        uid: '',
        optional: false,
        max: null,
        min: null,
        value: '',
        lock: false,
    },
    geo: {
        type: 'geo',
        changers: [],
        uid: '',
        optional: false,
        value: {
            latitude: 0,
            longitude: 0,
        },
        lock: false,
    },
    user: {
        type: 'user',
        changers: [],
        uid: '',
        value: null,

        optional: false,
        lock: false,
    },
    record: {
        type: 'record',
        changers: [],
        uid: '',
        optional: false,
        plural: false,
        value: [],
        lock: false,
    },
    date: {
        type: 'date',
        changers: [],
        uid: '',

        optional: false,
        value: 0,
        lock: false,
    },
    question: {
        type: 'question',
        changers: [],
        uid: '',
        title: 'Qu?',
        optional: false,
        questions: [],
        answers: [],
        value: {},
        lock: false,
    },
    signature: {
        type: 'signature',
        changers: [],
        uid: '',
        optional: false,
        value: [-1, ''],
        lock: false,
    },
}

type FMD = {
    [T in FieldType as T['type']]: FieldViewProps
}

const default_view_props: FMD = {
    price: {
        display: 'قیمت',
        Icon: DollarIcon,
    },
    link: {
        display: 'لینک',
        Icon: LinkIcon,
    },
    option: {
        display: 'انتخابی',
        Icon: OptionIcon,
    },
    int: {
        display: 'عدد',
        Icon: NumberIcon,
    },
    str: {
        display: 'متن',
        Icon: TextIcon,
    },
    text: {
        display: 'متن چند خطی',
        Icon: TextareaIcon,
    },
    geo: {
        Icon: MapIcon,
        display: 'نقشه',
    },
    user: {
        display: 'کاربر',
        Icon: PersonIcon,
    },
    record: {
        display: 'ضمیمه',
        Icon: FileIcon,
    },
    date: {
        display: 'تاریخ',
        Icon: CallenderIcon,
    },
    question: {
        display: 'سوال',
        Icon: QuestionIcon,
    },
    signature: {
        Icon: SignatureIcon,
        display: 'امضا دیجیتال',
    },
}

const field_types = Object.keys(default_fields) as Array<
    keyof typeof default_fields
>

type FieldProps<T> = FC<{
    field: T
    update: (save?: true) => void
    users: UserPublic[]
    contract_id: number | null
    disabled: boolean
}>

export type FieldMinMax = StrField | IntField | TextField
function have_minmax(f: FieldType): f is FieldMinMax {
    return ['str', 'int', 'text'].includes(f.type)
}

export {
    SchemaData,
    Page,
    UserPublic,
    FieldProps,
    field_types,
    default_fields,
    have_minmax,
    default_view_props,
}
