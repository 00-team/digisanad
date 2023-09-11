import React, {
    createElement,
    FC,
    Fragment,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react'

import axios from 'axios'
import {
    ArrowDownIcon,
    CheckIcon,
    CloseIcon,
    LockColoredIcon,
    WarningIcon,
    LockIcon,
    UnLockIcon,
} from 'icons'
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMapEvents,
} from 'react-leaflet'

import { useAtomValue } from 'jotai'
import { TokenAtom, UserAtom, PriceAtom } from 'state'

import { DatePicker } from './DatePicker'
import {
    FieldProps,
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

import './style/viewer.scss'

// import pdfImg from 'static/Contract/pdf.png'

type TreeNode = {
    name: string
    items: ParsedField[]
}

type ViewerProps = {
    render?: boolean
    contract_id?: number
    creator?: number
    schema: SchemaData
    setSchema: (data: Partial<SchemaData>, save: boolean) => void
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
    creator = null,
    render = false,
    schema,
    page,
    setSchema,
    setUID,
    users = def_users,
}) => {
    const user = useAtomValue(UserAtom)
    const [result, setResult] = useState<ReactNode[]>([])

    useEffect(() => {
        let tree: TreeNode[] = []
        let title_was_parsed = false

        if (!schema.pages.length) return
        if (page < 0 || page >= schema.pages.length) return

        let user_uid_to_user_id: { [k: string]: number | null } = {}

        Object.entries(schema.fields).forEach(([k, v]) => {
            if (!v.changers) v.changers = []

            if (v.type != 'user') return
            user_uid_to_user_id[k] = v.value
        })

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
                let disabled = false

                if (render || field.lock) {
                    disabled = true
                } else if (contract_id && field.type == 'user') {
                    if (user.user_id != creator) disabled = true
                } else if (contract_id && field.changers.length) {
                    disabled = true
                    for (let cdx = 0; cdx < field.changers.length; cdx++) {
                        let cuid = field.changers[cdx]!
                        let changer_user_id = user_uid_to_user_id[cuid]
                        if (!changer_user_id) continue

                        if (changer_user_id == user.user_id) {
                            disabled = false
                            break
                        }
                    }
                }

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
                            schema={schema}
                            field={field as never}
                            update={save => setSchema({}, !!save)}
                            users={users}
                            contract_id={contract_id}
                            disabled={disabled}
                        />
                        {!disabled && contract_id && (
                            <LockInput
                                cb={() => {
                                    field.lock = true
                                    setSchema({}, true)
                                }}
                            />
                        )}
                    </span>
                )
            }

            elements.push(createElement(node.name, { key: ndx }, childern))
        }

        setResult(elements)
    }, [schema, page, users, user, contract_id, creator])

    return <div className='schema-viewer title_small'>{result}</div>
}

type LockInputProps = {
    cb: () => void
}

const LockInput: FC<LockInputProps> = ({ cb }) => {
    const [clicked, setclicked] = useState(false)
    return (
        <>
            <div className='lock-container'>
                <button
                    className='lock title_smaller'
                    onClick={() => setclicked(true)}
                >
                    <LockColoredIcon />
                    قفل نهایی؟
                </button>
            </div>
            {clicked && (
                <div className='lock-popup-wrapper'>
                    <div className='popup-details'>
                        <WarningIcon
                            style={{ color: 'white' }}
                            size={100}
                            className='warning-icon'
                        />
                        <div className='detail'>
                            <h4 className='section_title'>توجه!</h4>
                            <p className='title_small'>
                                با قفل کردن ورودی مورد نظر{' '}
                                <span>دیگر قادر به تغییر آن نیستید!</span>
                            </p>
                        </div>
                        <div className='cta-container title_small'>
                            <button
                                className='cancel'
                                onClick={() => setclicked(false)}
                            >
                                انصراف
                            </button>
                            <button
                                className='submit'
                                onClick={() => {
                                    cb()
                                    return setclicked(false)
                                }}
                            >
                                تایید
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

type FMF = {
    [T in FieldType as T['type']]: FieldProps<T>
}

const TextFC: FieldProps<TextField> = ({ field, update, disabled }) => {
    if (disabled) {
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
    disabled: boolean
}

export const GeoMarker: FC<GeoMarkerProps> = ({ field, update, disabled }) => {
    const map = useMapEvents({
        click(e) {
            if (disabled) return
            field.value.latitude = e.latlng.lat
            field.value.longitude = e.latlng.lng
            update()
        },
        contextmenu() {
            if (disabled || !field.optional) return

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

const GeoFC: FieldProps<GeoField> = ({ field, update, disabled }) => {
    return (
        <div className='geo-container'>
            <MapContainer
                style={{ width: '100%', height: '100%', zIndex: 1 }}
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
                <GeoMarker field={field} update={update} disabled={disabled} />
            </MapContainer>
        </div>
    )
}

const StrFC: FieldProps<StrField> = ({ field, update, disabled }) => {
    if (disabled) return <span>{field.value}</span>

    return (
        <input
            className='title_smaller'
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

const IntFC: FieldProps<IntField> = ({ field, update, disabled }) => {
    if (disabled) return <span>{field.value.toLocaleString()}</span>

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

type UIDPCT = [string, number]
type PctLockState = {
    s: string[]
    r: string[]
}

const PriceFC: FieldProps<PriceField> = ({
    field,
    update,
    disabled,
    users,
    schema,
}) => {
    const price = useAtomValue(PriceAtom)

    const [values, setValues] = useState({
        irr: (field.value / 1e9) * price.eth_usd * price.usd_irr,
        usd: (field.value / 1e9) * price.eth_usd,
        gwei: field.value,
    })

    const [pct_lock, setPctLock] = useState<PctLockState>({
        s: [],
        r: [],
    })

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

    function update_pctz(t: 'S' | 'R', change: UIDPCT) {
        let locks: string[] = []
        let list: UIDPCT[] = []
        let [u, p] = change
        let min = 0,
            max = 100,
            n = 0

        if (t == 'S') {
            list = field.senders
            locks = pct_lock.s
        } else {
            list = field.receivers
            locks = pct_lock.r
        }

        if (locks.length + 1 >= list.length) return

        list.forEach(([iu, ip]) => {
            if (locks.includes(iu)) {
                n++
                max -= ip
            }
        })

        if (p > max) p = max
        if (p < min) p = min

        let sum = 0
        let output: UIDPCT[] = list.map(([iu, ip]) => {
            if (iu == u) {
                sum += p
                return [iu, p]
            }

            if (locks.includes(iu)) {
                sum += ip
                return [iu, ip]
            }

            let np = (max - p) / (list.length - n - 1)
            sum += np
            return [iu, np]
        })

        output[output.length - 1]![1] += 100 - sum
        if (t == 'S') {
            field.senders = output
        } else {
            field.receivers = output
        }
        update()
    }

    // if (disabled) return <span>{field.value.toLocaleString()}</span>

    return (
        <div className='price-field'>
            <div className='value'>
                <div>
                    <input
                        disabled={disabled}
                        type='number'
                        placeholder={'قیمت'}
                        value={Math.round(values.gwei * 1e2) / 1e2}
                        onInput={e => {
                            let gwei = parseFloat(e.currentTarget.value)
                            let usd = (gwei / 1e9) * price.eth_usd
                            let irr = usd * price.usd_irr
                            setValues({ gwei, irr, usd })
                            field.value = gwei
                            update()
                        }}
                    />
                    <span>GWEI</span>
                </div>
                <div>
                    <input
                        disabled={disabled}
                        type='number'
                        placeholder={'قیمت'}
                        value={Math.round((values.irr / 1e4) * 1e2) / 1e2}
                        onInput={e => {
                            let irr = parseFloat(e.currentTarget.value) * 1e4
                            let usd = irr / price.usd_irr
                            let gwei = (usd / price.eth_usd) * 1e9
                            setValues({ gwei, irr, usd })
                            field.value = gwei
                            update()
                        }}
                    />
                    <span>هزار تومان</span>
                </div>
                <div>
                    <input
                        disabled={disabled}
                        type='number'
                        placeholder={'قیمت'}
                        value={Math.round(values.usd * 1e2) / 1e2}
                        onInput={e => {
                            let usd = parseFloat(e.currentTarget.value)
                            let gwei = (usd / price.eth_usd) * 1e9
                            let irr = usd * price.usd_irr
                            setValues({ gwei, irr, usd })
                            field.value = gwei
                            update()
                        }}
                    />
                    <span>دلار</span>
                </div>
            </div>
            <div className='pctz'>
                <ul>
                    <li className='title'>پرداخت کنندگان</li>
                    {field.senders.map(([uid, pct], i) => (
                        <li key={i}>
                            <span>{uid_user.get(uid)}</span>
                            <input
                                disabled={
                                    disabled ||
                                    pct_lock.s.includes(uid) ||
                                    pct_lock.s.length + 1 >=
                                        field.senders.length
                                }
                                min={0}
                                max={100}
                                type='number'
                                value={Math.round(pct * 1e2) / 1e2}
                                onChange={e => {
                                    let new_pct = parseFloat(
                                        e.currentTarget.value
                                    )
                                    update_pctz('S', [uid, new_pct])
                                }}
                            />
                            {field.senders.length > 1 && (
                                <button
                                    onClick={() => {
                                        setPctLock(s => {
                                            let ns = s.s.filter(k => k != uid)
                                            if (ns.length != s.s.length)
                                                return { s: ns, r: s.r }

                                            return { s: ns.concat(uid), r: s.r }
                                        })
                                    }}
                                >
                                    {pct_lock.s.includes(uid) ? (
                                        <LockIcon />
                                    ) : (
                                        <UnLockIcon />
                                    )}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
                <ul>
                    <li className='title'>دریافت کنندگان</li>
                    {field.receivers.map(([uid, pct], i) => (
                        <li key={i}>
                            <span>{uid_user.get(uid)}</span>
                            <input
                                disabled={
                                    disabled ||
                                    pct_lock.r.includes(uid) ||
                                    pct_lock.r.length + 1 >=
                                        field.receivers.length
                                }
                                min={0}
                                max={100}
                                type='number'
                                value={Math.round(pct * 1e2) / 1e2}
                                onChange={e => {
                                    let new_pct = parseFloat(
                                        e.currentTarget.value
                                    )
                                    update_pctz('R', [uid, new_pct])
                                }}
                            />
                            {field.receivers.length > 1 && (
                                <button
                                    onClick={() => {
                                        setPctLock(s => {
                                            let ns = s.r.filter(k => k != uid)
                                            if (ns.length != s.r.length)
                                                return { r: ns, s: s.s }

                                            return { r: ns.concat(uid), s: s.s }
                                        })
                                    }}
                                >
                                    {pct_lock.r.includes(uid) ? (
                                        <LockIcon />
                                    ) : (
                                        <UnLockIcon />
                                    )}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const QuestionFC: FieldProps<QuestionField> = ({ field, update, disabled }) => {
    if (disabled) {
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
    }

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

const RecordFC: FieldProps<RecordField> = ({
    field,
    update,
    contract_id,
    disabled,
}) => {
    const [records, setRecords] = useState<RecordField['value']>(field.value)
    const token = useAtomValue(TokenAtom)
    const local_id = useRef(0)

    useEffect(() => {
        if (!contract_id) return

        if (JSON.stringify(field.value) != JSON.stringify(records)) {
            field.value = [...records]
            update(true)
        }
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

        const IMAGE_MIMETYPE = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/gif',
            'image/webm',
        ]

        for (let fdx = 0; fdx < files.length; fdx++) {
            if (!IMAGE_MIMETYPE.includes(files[fdx]!.type)) {
                return ReactAlert.error('فورمت فایل عکس نیست!')
            }
        }

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
        return
    }

    if (disabled) {
        return (
            <div className='record-disabled'>
                {field.value.map(([, url], index) => (
                    <img className='fixed-img' src={url} key={index} />
                ))}
            </div>
        )
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
                accept='.jpg, .jpeg, .png, image/jpg, image/jpeg, image/png'
            />
        </div>
    )
}

type SignatureState = {
    px: number
    py: number
    cx: number
    cy: number
    draw: boolean
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    move_count: number
    color: string
}

const SignatureDrawer: FieldProps<SignatureField> = ({
    field,
    update,
    contract_id,
    disabled,
}) => {
    const token = useAtomValue(TokenAtom)
    const state = useRef<SignatureState>({
        px: 0,
        py: 0,
        cx: 0,
        cy: 0,
        draw: false,
        move_count: 0,
        canvas: {} as HTMLCanvasElement,
        context: {} as CanvasRenderingContext2D,
        color: '#040404',
    })

    if (disabled) {
        return <img style={{ background: 'white' }} src={field.value[1]} />
    }

    const upload_signature = async (data: Blob) => {
        if (!contract_id) {
            let url = URL.createObjectURL(data)
            field.value = [-1, url]
            return
        }

        try {
            let fd = new FormData()
            fd.set('file', data)
            fd.set('contract', contract_id.toString())

            const response = await axios.post('/api/records/', fd, {
                headers: { Authorization: 'Bearer ' + token },
            })

            let record_id: number = response.data.record_id
            let url: string = response.data.url
            if (!record_id || !url) {
                ReactAlert.error('خطا در هنگام ثبت امضا')
                return
            }

            field.value = [record_id, url]
            update(true)
        } catch (error) {
            HandleError(error)
        }
    }

    const delete_signature = async () => {
        if (!contract_id) {
            field.value = [-1, '']
            update()
            return
        }

        try {
            const response = await axios.delete(
                `/api/records/${field.value[0]}/`,
                { headers: { Authorization: 'Bearer ' + token } }
            )

            if (response.data.ok) {
                field.value = [-1, '']
                update(true)
                return
            }

            ReactAlert.error('خطا درهنگام حذف امضا')
        } catch (error) {
            HandleError(error)
        }
    }

    return (
        <div className='signature-container'>
            {field.value[0] > 0 ? (
                <img
                    style={{ background: 'white' }}
                    src={field.value[1]}
                    draggable={false}
                />
            ) : (
                <canvas
                    width={500}
                    height={450}
                    ref={e => {
                        if (!e) return

                        state.current.canvas = e
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
                    onMouseMove={e => {
                        if (!state.current.draw) return

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
            )}
            <div className='confirm-wrapper'>
                <div
                    className='remove'
                    onClick={() => {
                        if (field.value[0] > 0) {
                            delete_signature()
                        } else {
                            state.current.context.clearRect(0, 0, 500, 450)
                        }
                    }}
                >
                    <CloseIcon size={25} />
                </div>
                {field.value[0] < 1 && (
                    <div
                        className='confirm'
                        onClick={() => {
                            state.current.canvas.toBlob(
                                data => {
                                    if (!data) return

                                    upload_signature(data)
                                },
                                'image/png',
                                512
                            )
                        }}
                    >
                        <CheckIcon size={25} />
                    </div>
                )}
            </div>
        </div>
    )
}

const OptionFC: FieldProps<OptionFeild> = ({ field, update, disabled }) => {
    if (disabled) {
        return (
            <ul>
                {field.value.map(uid => {
                    let option = field.options.find(o => o.uid == uid)
                    let text = '---'
                    if (option) text = option.display

                    return <li>{text}</li>
                })}
            </ul>
        )
    }

    return (
        <ul className='option-field'>
            {field.options.map((o, i) => (
                <li key={i}>
                    <input
                        type={field.singleton ? 'radio' : 'checkbox'}
                        name={field.uid}
                        id={field.uid + '__' + o.uid}
                        checked={field.value.includes(o.uid)}
                        onChange={() => {}}
                        onInput={e => {
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
                            console.log(field.value)
                        }}
                    />
                    <label htmlFor={field.uid + o.uid}>{o.display}</label>
                </li>
            ))}
        </ul>
    )
}

const UserFC: FieldProps<UserField> = ({ field, update, users, disabled }) => {
    if (disabled) {
        let user = users.find(u => u.user_id == field.value)
        return (
            <span>
                {user ? `${user.first_name} ${user.last_name}` : 'خالی'}
            </span>
        )
    }

    return (
        <select
            onChange={e => {
                let v = e.currentTarget.value
                if (!v) field.value = null
                else field.value = parseInt(v)

                update()
            }}
            value={field.value ? field.value.toString() : ''}
        >
            <option value=''>خالی</option>
            {users.map((u, i) => (
                <option value={u.user_id} key={i}>
                    {u.first_name} {u.last_name}
                </option>
            ))}
        </select>
    )
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
    date: DatePicker,
    option: OptionFC,
}

export { Viewer }
