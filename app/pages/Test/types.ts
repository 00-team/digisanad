type BaseField = {
    uid: string
    title: string
    description?: string | null
    optinal?: boolean
}

type RecordField = BaseField & {
    type: 'record'
    plural: boolean
}

type IntField = BaseField & {
    type: 'int'
    min?: number | null
    max?: number | null
}

type StrField = BaseField & {
    type: 'str'
    min?: number | null
    max?: number | null
}

type GenericField = BaseField & {
    type: 'user' | 'geo' | 'date' | 'signature'
}

type TextField = BaseField & {
    type: 'text'
    min?: number | null
    max?: number | null
}

type UIDD = {
    uid: string
    display: string
}

type QuestionField = BaseField & {
    type: 'question'
    answers: UIDD[]
    questions: UIDD[]
}

type OptionFeild = BaseField & {
    type: 'option'
    singleton: boolean
    options: UIDD[]
}

type FieldType =
    | IntField
    | StrField
    | GenericField
    | OptionFeild
    | QuestionField
    | TextField
    | RecordField

const field_types = [
    'option',
    'int',
    'str',
    'text',
    'user',
    'geo',
    'record',
    'date',
    'signature',
    'question',
] as const
let GGGG: typeof field_types[number] extends FieldType['type']
    ? FieldType['type'] extends typeof field_types[number]
        ? true
        : false
    : false = true
console.assert(GGGG)

type FieldMinMax = StrField | IntField | TextField
function have_minmax(f: FieldType): f is FieldMinMax {
    return ['str', 'int', 'text'].includes(f.type)
}

type Stage = BaseField & {
    fields: FieldType[]
}

type SchemaData = {
    stages: Stage[]
}

export { SchemaData, field_types, have_minmax, FieldType, FieldMinMax }
