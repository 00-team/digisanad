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

type SchemaData = {
    pages: Page[]
    fields: {
        [uid: string]: FieldType
    }
}

export type FieldViewProps = {
    display: string
    Icon: Icon
}

export type BaseField = {
    uid: string
    // title: string
    // description?: string | null
    optional?: boolean
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
    value: string[]
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

type X = {
    [T in FieldType as T['type']]: T
}
const default_fields: X = {
    link: {
        type: 'link',
        uid: '',
        text: '...',
        title: 'Lonk',
        url: 'https://example.com',
    },
    option: {
        type: 'option',
        title: '',
        uid: '',
        options: [],
        optional: false,
        singleton: false,
        value: [],
    },
    int: {
        type: 'int',
        uid: '',
        optional: false,
        max: null,
        min: null,
        value: 0,
    },
    str: {
        type: 'str',
        uid: '',
        optional: false,
        max: null,
        min: null,
        value: '',
        placeholder: 'string',
    },
    text: {
        type: 'text',
        uid: '',
        optional: false,
        max: null,
        min: null,
        value: '',
    },
    geo: {
        type: 'geo',
        uid: '',
        optional: false,
        value: {
            latitude: 0,
            longitude: 0,
        },
    },
    user: {
        type: 'user',
        uid: '',
        value: '',

        optional: false,
    },
    record: {
        type: 'record',
        uid: '',
        optional: false,
        plural: false,
        value: [],
    },
    date: {
        type: 'date',
        uid: '',

        optional: false,
        value: 0,
    },
    question: {
        type: 'question',
        uid: '',
        title: 'Qu?',
        optional: false,
        questions: [],
        answers: [],
        value: {},
    },
    signature: {
        type: 'signature',
        uid: '',
        optional: false,
        value: '',
    },
}

type FMD = {
    [T in FieldType as T['type']]: FieldViewProps
}

const default_view_props: FMD = {
    link: {
        display: 'لینک',
        Icon: LinkSvg,
    },
    option: {
        display: 'انتخابی',
        Icon: OptionSvg,
    },
    int: {
        display: 'عدد',
        Icon: NumberSvg,
    },
    str: {
        display: 'متن',
        Icon: TextSvg,
    },
    text: {
        display: 'متن چند خطی',
        Icon: TextareaSvg,
    },
    geo: {
        Icon: MapSvg,
        display: 'نقشه',
    },
    user: {
        display: 'کاربر',
        Icon: PersonSvg,
    },
    record: {
        display: 'ضمیمه',
        Icon: FileSvg,
    },
    date: {
        display: 'تاریخ',
        Icon: CallenderSvg,
    },
    question: {
        display: 'سوال',
        Icon: QuestionSvg,
    },
    signature: {
        Icon: SignatureSvg,
        display: 'امضا دیجیتال',
    },
}

const field_types = Object.keys(default_fields) as Array<
    keyof typeof default_fields
>

export type FieldMinMax = StrField | IntField | TextField
function have_minmax(f: FieldType): f is FieldMinMax {
    return ['str', 'int', 'text'].includes(f.type)
}

export {
    SchemaData,
    Page,
    field_types,
    default_fields,
    have_minmax,
    default_view_props,
}
