import React, { createElement, FC, Fragment, ReactNode } from 'react'

// import { renderToString } from 'react-dom/server'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

import { PriceModel } from 'state'

import {
    DateField,
    FieldType,
    GeoField,
    IntField,
    OptionFeild,
    PriceField,
    QuestionField,
    RecordField,
    SchemaData,
    SignatureField,
    StrField,
    TextField,
    UserField,
    UserPublic,
} from './types'
import { ParsedField, parseFields } from './utils'

// import pdfImg from 'static/Contract/pdf.png'

type TreeNode = {
    name: string
    items: ParsedField[]
}

type PRProps = {
    contract_id: number
    creator: number
    schema: SchemaData
    users: UserPublic[]
    price: PriceModel
}

// type PR = (props: PRProps) => Promise<string>
const PrintRender: FC<PRProps> = ({
    creator,
    contract_id,
    schema,
    users,
    price,
}) => {
    let tree: TreeNode[] = []
    let title_was_parsed = false

    if (!schema.pages.length) return <></>

    let user_uid_to_user_id: { [k: string]: number | null } = {}

    Object.entries(schema.fields).forEach(([k, v]) => {
        if (!v.changers) v.changers = []

        if (v.type != 'user') return
        user_uid_to_user_id[k] = v.value
    })

    schema.pages.forEach(page => {
        page.content.split('\n').forEach(line => {
            let node: TreeNode = { name: '', items: [] }

            if (!line) {
                tree.push({ name: 'br', items: [] })
                return
            }

            if (line == '---') {
                tree.push({ name: 'hr', items: [] })
                return
            }

            let hn = 0

            if (line[0] == '#') {
                hn = line.indexOf(' ')
                line = line.substring(hn + 1)
                if (hn == 1 && !title_was_parsed) {
                    title_was_parsed = true
                    node.name = 'h1'
                } else if (hn > 1 && hn < 5) {
                    node.name = 'h' + hn
                }
            }

            if (!node.name) node.name = 'div'

            node.items = parseFields(line)
            tree.push(node)
        })
    })

    let elements: ReactNode[] = []
    for (let ndx = 0; ndx < tree.length; ++ndx) {
        let node = tree[ndx]!
        if (!node.items.length) {
            elements.push(createElement(node.name, { key: ndx }))
            continue
        }

        let childern: ReactNode[] = []

        for (let fdx = 0; fdx < node.items.length; ++fdx) {
            let [ctype, value] = node.items[fdx]!
            if (ctype == 'text') {
                childern.push(value)
                continue
            }

            if (!(value in schema.fields)) {
                childern.push('({' + value + '})')
                continue
            }

            let field = schema.fields[value]!
            let FMFC = field_map[field.type]

            childern.push(
                <span key={fdx} className='field-wrapper'>
                    <FMFC
                        schema={schema}
                        field={field as never}
                        users={users}
                        contract_id={contract_id}
                        creator={creator}
                        price={price}
                    />
                </span>
            )
        }

        elements.push(createElement(node.name, { key: ndx }, childern))
    }

    return (
        <html>
            <head>
                <link rel='stylesheet' href='/static/printer.css' />
            </head>
            <body>
                <div className='schema-viewer title_small'>{elements}</div>
            </body>
        </html>
    )
}

type FieldProps<T> = FC<{
    schema: SchemaData
    field: T
    users: UserPublic[]
    contract_id: number
    creator: number
    price: PriceModel
}>

type FMF = {
    [T in FieldType as T['type']]: FieldProps<T>
}

const TextFC: FieldProps<TextField> = ({ field }) => {
    return (
        <p>
            {field.value.split('\n').map((v, i) => (
                <Fragment key={i}>
                    {v}
                    <br />
                </Fragment>
            ))}
        </p>
    )
}

const GeoFC: FieldProps<GeoField> = ({ field }) => {
    if (!field.value.latitude || !field.value.longitude) return <></>

    return (
        <div className='geo-container'>
            <MapContainer
                style={{ width: '100%', height: '100%', zIndex: 1 }}
                center={[field.value.latitude, field.value.longitude]}
                zoom={15}
                // scrollWheelZoom={false}
                // attributionControl
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Marker
                    position={[field.value.latitude, field.value.longitude]}
                />
            </MapContainer>
        </div>
    )
}

const StrFC: FieldProps<StrField> = ({ field }) => {
    return <span>{field.value}</span>
}

const IntFC: FieldProps<IntField> = ({ field }) => {
    return <span>{field.value.toLocaleString()}</span>
}

const PriceFC: FieldProps<PriceField> = ({ field, users, schema, price }) => {
    const irr = (field.value / 1e9) * price.eth_usd * price.usd_irr

    const usd = (field.value / 1e9) * price.eth_usd
    const gwei = field.value

    let user_fields = Object.entries(schema.fields).filter(
        uf => uf[1].type == 'user'
    ) as [string, UserField][]
    let uid_user: Map<string, string> = new Map(
        user_fields.map(([uid, f]) => {
            let display = f.title || f.uid

            if (f.value) {
                let user = users.find(u => u.user_id == f.value)
                if (user) display = user.first_name + ' ' + user.last_name
            }
            return [uid, display]
        })
    )

    return (
        <div className='price-field'>
            <div className='value'>
                <span>{Math.round(gwei * 1e2) / 1e2} GWEI</span>
                <span>{Math.round((irr / 1e4) * 1e2) / 1e2} هزار تومان</span>
                <span>{Math.round(usd * 1e2) / 1e2} دلار</span>
            </div>
            <div className='pctz'>
                <ul>
                    <li className='title'>پرداخت کنندگان</li>
                    {field.senders.map(([uid, pct], i) => (
                        <li key={i}>
                            <span>
                                {uid_user.get(uid)}:{' '}
                                {Math.round(pct * 1e2) / 1e2}%
                            </span>
                        </li>
                    ))}
                </ul>
                <ul>
                    <li className='title'>دریافت کنندگان</li>
                    {field.receivers.map(([uid, pct], i) => (
                        <li key={i}>
                            <span>
                                {uid_user.get(uid)}:{' '}
                                {Math.round(pct * 1e2) / 1e2}%
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const QuestionFC: FieldProps<QuestionField> = ({ field }) => {
    return (
        <ul className='question-field-disabled'>
            {field.questions.map((q, index) => {
                let answer = field.answers.find(
                    a => a.uid == field.value[q.uid]
                )
                let answer_text = 'نامشخص'
                if (answer) answer_text = answer.display

                return (
                    <li key={index}>
                        {q.display}: {answer_text}
                    </li>
                )
            })}
        </ul>
    )

    // return (
    //     <table className='question-field'>
    //         <thead>
    //             <tr>
    //                 <th>{field.title}</th>
    //                 {field.answers.map((a, ai) => (
    //                     <th key={ai}>{a.display}</th>
    //                 ))}
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {field.questions.map((q, qi) => (
    //                 <tr key={qi}>
    //                     <td>{q.display}</td>
    //                     {field.answers.map((a, ai) => (
    //                         <td key={ai}>
    //                             <div className='input-wrapper'>
    //                                 <input
    //                                     type='radio'
    //                                     name={field.uid + '__' + q.uid}
    //                                     title={a.display}
    //                                     checked={field.value[q.uid] == a.uid}
    //                                     onChange={e => {
    //                                         if (e.currentTarget.checked) {
    //                                             field.value[q.uid] = a.uid
    //                                             update()
    //                                         }
    //                                     }}
    //                                 />
    //                             </div>
    //                         </td>
    //                     ))}
    //                 </tr>
    //             ))}
    //         </tbody>
    //     </table>
    // )
}

const RecordFC: FieldProps<RecordField> = ({ field }) => {
    return (
        <div className='record-disabled'>
            {field.value.map(([, url], index) => (
                <img className='fixed-img' src={url} key={index} />
            ))}
        </div>
    )
}

const SignatureDrawer: FieldProps<SignatureField> = ({ field }) => {
    return <img style={{ background: 'white' }} src={field.value[1]} />
}

const OptionFC: FieldProps<OptionFeild> = ({ field }) => {
    return (
        <ul>
            {field.value.map((uid, i) => {
                let option = field.options.find(o => o.uid == uid)
                let text = '---'
                if (option) text = option.display

                return <li key={i}>{text}</li>
            })}
        </ul>
    )
}

const UserFC: FieldProps<UserField> = ({ field, users }) => {
    let user = users.find(u => u.user_id == field.value)
    return <span>{user ? `${user.first_name} ${user.last_name}` : 'خالی'}</span>
}

const DateFC: FieldProps<DateField> = ({ field }) => {
    return <span>date: {field.value}</span>
}

const field_map: FMF = {
    price: PriceFC,
    link: ({ field }) => (
        <a href={field.url} title={field.title}>
            {field.text}
        </a>
    ),
    text: TextFC,
    str: StrFC,
    user: UserFC,
    geo: GeoFC,
    int: IntFC,
    signature: SignatureDrawer,
    record: RecordFC,
    question: QuestionFC,
    date: DateFC,
    option: OptionFC,
}

export { PrintRender }
