import React, {
    createElement,
    FC,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react'

import axios from 'axios'
import { ArrowDownIcon, CheckIcon, CloseIcon } from 'icons'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Marker, Popup, useMapEvents } from 'react-leaflet'

import { useAtomValue } from 'jotai'
import { TokenAtom } from 'state'

import { DatePicker } from 'components'

import {
    FieldType,
    SchemaData,
    TextField,
    UserField,
    UserPublic,
} from './types'
import {
    GeoField,
    IntField,
    OptionFeild,
    QuestionField,
    RecordField,
    SignatureField,
    StrField,
} from './types'
import { ParsedField } from './utils'
import { parseFields } from './utils'

import './style/viewer.scss'

import pdfImg from 'static/Contract/pdf.png'

type TreeNode = {
    name: string
    items: ParsedField[]
}

type ViewerProps = {
    contract_id?: number
    schema: SchemaData
    setSchema: (data: Partial<SchemaData>) => void
    setUID: (uid: string) => void
    page: number
    users?: UserPublic[]
}

const def_users: UserPublic[] = [
    {
        user_id: 1,
        phone: '09000000001',
        first_name: 'محمد',
        last_name: 'محمدی',
    },
    {
        user_id: 2,
        phone: '09000000002',
        first_name: 'خسرو',
        last_name: 'رضایی',
    },
    {
        user_id: 3,
        phone: '09000000003',
        first_name: 'اصغر',
        last_name: 'محمدی',
    },
]

const Viewer: FC<ViewerProps> = ({
    contract_id = null,
    schema,
    page,
    setSchema,
    setUID,
    users = def_users,
}) => {
    const [result, setResult] = useState<ReactNode[]>([])

    useEffect(() => {
        let tree: TreeNode[] = []
        let title_was_parsed = false

        if (!schema.pages.length) return
        if (page < 0 || page >= schema.pages.length) return

        schema.pages[page]!.content.split('\n').forEach(line => {
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
                    <span
                        key={fdx}
                        className='field-wrapper'
                        onContextMenu={e => {
                            e.preventDefault()
                            setUID(value)
                        }}
                    >
                        <FMFC
                            // @ts-ignore
                            field={field}
                            update={() => setSchema({})}
                            users={users}
                            contract_id={contract_id}
                        />
                    </span>
                )
            }

            elements.push(createElement(node.name, { key: ndx }, childern))
        }

        setResult(elements)
    }, [schema, page, users])

    return <div className='schema-viewer title_small'>{result}</div>
}

type FMF = {
    [T in FieldType as T['type']]: FieldProps<T>
}

type FieldProps<T> = FC<{
    field: T
    update: () => void
    users: UserPublic[]
    contract_id: number | null
}>

const TextFC: FieldProps<TextField> = ({ field, update }) => {
    return (
        <textarea
            className='text-field title_smaller'
            value={field.value}
            rows={10}
            cols={50}
            onInput={e => {
                field.value = e.currentTarget.value
                update()
            }}
        ></textarea>
    )
}

type GeoMarkerProps = {
    field: GeoField
    update: () => void
}

export const GeoMarker: FC<GeoMarkerProps> = ({ field, update }) => {
    const map = useMapEvents({
        click(e) {
            field.value.latitude = e.latlng.lat
            field.value.longitude = e.latlng.lng
            update()
        },
        contextmenu() {
            if (!field.optional) return

            field.value.latitude = 0
            field.value.longitude = 0
            update()
        },
        locationfound(e) {
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    if (!field.value.latitude || !field.value.longitude) {
        return <></>
    }

    return (
        <Marker position={[field.value.latitude, field.value.longitude]}>
            <Popup className='title_smaller'>مکان انتخابی</Popup>
        </Marker>
    )
}

const GeoFC: FieldProps<GeoField> = ({ field, update }) => {
    return (
        <div className='geo-container'>
            <MapContainer
                style={{ width: '100%', height: '100%' }}
                center={
                    field.value.latitude
                        ? [field.value.latitude, field.value.longitude]
                        : [35.698587185965124, 51.33724353174251]
                }
                zoom={15}
                // scrollWheelZoom={false}
                attributionControl
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <GeoMarker field={field} update={update} />
            </MapContainer>
        </div>
    )
}

const StrFC: FieldProps<StrField> = ({ field, update }) => {
    return (
        <input
            placeholder={field.placeholder}
            value={field.value}
            onInput={e => {
                field.value = e.currentTarget.value
                update()
            }}
            max={field.max || undefined}
            min={field.min || undefined}
        />
    )
}

const IntFC: FieldProps<IntField> = ({ field, update }) => {
    return (
        <input
            type='number'
            placeholder={field.placeholder}
            value={field.value}
            onInput={e => {
                field.value = parseInt(e.currentTarget.value)
                update()
            }}
            max={field.max || undefined}
            min={field.min || undefined}
        />
    )
}

const QuestionFC: FieldProps<QuestionField> = ({ field, update }) => {
    return (
        <table className='question-field'>
            <thead>
                <tr>
                    <th>{field.title}</th>
                    {field.answers.map((a, ai) => (
                        <th key={ai}>{a.display}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {field.questions.map((q, qi) => (
                    <tr key={qi}>
                        <td>{q.display}</td>
                        {field.answers.map((a, ai) => (
                            <td key={ai}>
                                <div className='input-wrapper'>
                                    <input
                                        type='radio'
                                        name={field.uid + '__' + q.uid}
                                        title={a.display}
                                        checked={field.value[q.uid] == a.uid}
                                        onChange={e => {
                                            if (e.currentTarget.checked) {
                                                field.value[q.uid] = a.uid
                                                update()
                                            }
                                        }}
                                    />
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

const RecordFC: FieldProps<RecordField> = ({ field, update, contract_id }) => {
    const [records, setRecords] = useState<RecordField['value']>(field.value)
    const token = useAtomValue(TokenAtom)
    const local_id = useRef(0)

    pdfImg

    useEffect(() => {
        if (!contract_id) return

        field.value = [...records]
        update()
    }, [records, contract_id])

    type UFRT = RecordField['value'][number]
    const upload_file = async (file: File): Promise<UFRT | null> => {
        if (!contract_id) {
            let url = URL.createObjectURL(file)
            local_id.current++
            return [local_id.current, url]
        }

        try {
            let fd = new FormData()
            fd.set('file', file)
            fd.set('contract', contract_id.toString())

            const response = await axios.post('/api/records/', fd, {
                headers: { Authorization: 'Bearer ' + token },
            })
            if (!('record_id' in response.data) || !('url' in response.data))
                return null

            return [response.data.record_id, response.data.url]
        } catch (error) {
            HandleError(error)
        }

        return null
    }

    const update_records = async (files: FileList | null) => {
        if (!files || !files.length) return

        if (field.plural) {
            let results: RecordField['value'] = []

            for (let fdx = 0; fdx < files.length; fdx++) {
                let result = await upload_file(files[fdx]!)
                if (!result) {
                    ReactAlert.error('خطا درهنگام اپلود فایل')
                    return
                }
                results.push(result)
            }

            setRecords(s => s.concat(results))
        } else {
            let result = await upload_file(files[0]!)
            if (!result) {
                ReactAlert.error('خطا درهنگام اپلود فایل')
                return
            }

            setRecords([result])
        }
    }

    return (
        <div className='record-container'>
            <div className='record-field'>
                {!records.length ? (
                    <div className='record-empty'>
                        <ArrowDownIcon size={40} />
                        <h4 className='title_smaller'>
                            فایل خود را اینجا بارگذاری کنید
                        </h4>
                    </div>
                ) : (
                    <div className='files-container'>
                        {records.map((record, i) => (
                            <div
                                key={i}
                                className='img-container'
                                onClick={() => {
                                    setRecords(s =>
                                        s.filter(r => r[0] != record[0])
                                    )
                                }}
                            >
                                <img
                                    src={record[1]}
                                    loading={'lazy'}
                                    decoding={'async'}
                                />
                                <div className='remove-img'>
                                    <CloseIcon size={30} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <label htmlFor='record-input' className='add-file title_small'>
                اضافه کردن فایل
            </label>
            <input
                id='record-input'
                onChange={e => update_records(e.currentTarget.files)}
                type='file'
                multiple={field.plural}
                accept='.pdf, .jpg, .jpeg, .png, image/jpg, image/jpeg, image/png'
            />
        </div>
    )
}

const COLORS = ['black', 'red', 'blue', 'green', 'yellow'] as const

type SignatureState = {
    px: number
    py: number
    cx: number
    cy: number
    draw: boolean
    context: CanvasRenderingContext2D
    move_count: number
    color: typeof COLORS[number]
}

const SignatureDrawer: FieldProps<SignatureField> = () => {
    const state = useRef<SignatureState>({
        px: 0,
        py: 0,
        cx: 0,
        cy: 0,
        draw: false,
        move_count: 0,
        context: {} as CanvasRenderingContext2D,
        color: COLORS[0],
    })

    return (
        <div className='signature-container'>
            <canvas
                width={500}
                height={450}
                ref={e => {
                    if (!e) return
                    state.current.context = e.getContext('2d')!
                }}
                className='signature-wrapper'
                onMouseDown={e => {
                    state.current.px = state.current.cx
                    state.current.py = state.current.cy

                    state.current.cx = e.nativeEvent.offsetX
                    state.current.cy = e.nativeEvent.offsetY

                    state.current.context.beginPath()
                    state.current.context.fillStyle = state.current.color
                    state.current.context.fillRect(
                        state.current.cx,
                        state.current.cy,
                        2,
                        2
                    )
                    state.current.context.closePath()

                    state.current.draw = true
                }}
                onMouseUp={() => {
                    state.current.draw = false
                }}
                onMouseOut={() => {
                    state.current.draw = false
                }}
                onWheel={e => {
                    let idx = COLORS.indexOf(state.current.color)

                    if (e.deltaY > 0) idx++
                    else idx--

                    if (idx >= COLORS.length) idx = 0
                    else if (idx < 0) idx = COLORS.length - 1

                    state.current.color = COLORS[idx]!
                }}
                onMouseMove={e => {
                    // if (!state.current.draw) return

                    state.current.move_count++
                    if (!state.current.draw || state.current.move_count < 4)
                        return
                    state.current.move_count = 0

                    state.current.px = state.current.cx
                    state.current.py = state.current.cy

                    state.current.cx = e.nativeEvent.offsetX
                    state.current.cy = e.nativeEvent.offsetY

                    state.current.context.beginPath()
                    state.current.context.moveTo(
                        state.current.px,
                        state.current.py
                    )
                    state.current.context.lineTo(
                        state.current.cx,
                        state.current.cy
                    )
                    state.current.context.strokeStyle = state.current.color
                    state.current.context.lineWidth = 2
                    state.current.context.stroke()
                    state.current.context.closePath()
                }}
            ></canvas>
            <div className='confirm-wrapper'>
                <div
                    className='remove'
                    onClick={() => {
                        state.current.context.clearRect(0, 0, 500, 450)
                    }}
                >
                    <CloseIcon size={25} />
                </div>
                <div className='confirm'>
                    <CheckIcon size={25} />
                </div>
            </div>
        </div>
    )
}

const OptionFC: FieldProps<OptionFeild> = ({ field, update }) => {
    return (
        <ul className='option-field'>
            {field.options.map((o, i) => (
                <li key={i}>
                    <input
                        type={field.singleton ? 'radio' : 'checkbox'}
                        name={field.uid}
                        id={field.uid + o.uid}
                        checked={field.value.includes(o.uid)}
                        onChange={e => {
                            let checked = e.currentTarget.checked

                            if (field.singleton) {
                                if (checked) {
                                    field.value = [o.uid]
                                    update()
                                }
                            } else {
                                field.value = field.value.filter(
                                    v => v != o.uid
                                )

                                if (checked) {
                                    field.value.push(o.uid)
                                }

                                update()
                            }
                        }}
                    />
                    <label htmlFor={field.uid + o.uid}>{o.display}</label>
                </li>
            ))}
        </ul>
    )
}

const UserFC: FieldProps<UserField> = ({ field, update, users }) => {
    return (
        <select
            onChange={e => {
                field.value = e.currentTarget.value
                update()
            }}
            value={field.value}
        >
            {users.map((u, i) => (
                <option value={u.user_id} key={i}>
                    {u.first_name} {u.last_name}
                </option>
            ))}
        </select>
    )
}

const field_map: FMF = {
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
    date: DatePicker,
    option: OptionFC,
}

export { Viewer }
