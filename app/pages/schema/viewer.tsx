import React, {
    ChangeEvent,
    createElement,
    FC,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react'

import { ArrowDownIcon, CheckIcon, CloseIcon } from 'icons'
import { MapContainer, TileLayer } from 'react-leaflet'

import { DatePicker } from 'components'

import { CustomMap } from './map'
import { FieldType, SchemaData, TextField } from './types'
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

import pdfImg from 'static/Contract/pdf.png'

type TreeNode = {
    name: string
    items: ParsedField[]
}

type ViewerProps = {
    schema: SchemaData
    setSchema: (data: Partial<SchemaData>) => void
    setUID: (uid: string) => void
    page: number
}

const Viewer: FC<ViewerProps> = ({ schema, page, setSchema, setUID }) => {
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
                        />
                    </span>
                )
            }

            elements.push(createElement(node.name, { key: ndx }, childern))
        }

        setResult(elements)
    }, [schema, page])

    return <div className='viewer title_small'>{result}</div>
}

type FMF = {
    [T in FieldType as T['type']]: FC<{ field: T; update: () => void }>
}

type FieldProps<T> = FC<{
    field: T
    update: () => void
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

const GeoFC: FieldProps<GeoField> = ({ field }) => {
    return (
        <div className='geo-container'>
            <MapContainer
                style={{ width: '100%', height: '100%' }}
                center={[35.698587185965124, 51.33724353174251]}
                zoom={14}
                scrollWheelZoom={false}
                attributionControl
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <CustomMap optional={field.optional} />
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
                                <input
                                    type='radio'
                                    name={field.uid + q.uid}
                                    title={a.display}
                                    checked={field.value[q.uid] == a.uid}
                                    onChange={e => {
                                        if (e.currentTarget.checked) {
                                            field.value[q.uid] = a.uid
                                            update()
                                        }
                                    }}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

const RecordFC: FieldProps<RecordField> = ({ field }) => {
    const [preview, setpreview] = useState<string[]>([''])

    const readURL = (input: ChangeEvent<HTMLInputElement>) => {
        if (!field.plural && preview.length >= 2)
            return ReactAlert.error('ورودی بیشتر از یک فایل مجاز نیست!')

        if (!input.target.files) return

        if (input.target.files.length <= 1) {
            if (!input.target.files[0]) return

            var reader = new FileReader()

            reader.onload = function (e) {
                return setpreview([...preview, e.target!.result!.toString()])
            }
            reader.readAsDataURL(input.target.files[0])
        } else {
            Array.from(input.target.files).map(file => {
                var reader = new FileReader()

                reader.onload = function (e) {
                    setpreview(previews => [
                        ...previews,
                        e.target!.result!.toString(),
                    ])
                }
                reader.readAsDataURL(file)

                return
            })
        }

        return
    }

    return (
        <div className='record-container'>
            <div className='record-field'>
                {preview.length <= 1 ? (
                    <div className='record-empty'>
                        <ArrowDownIcon size={40} />
                        <h4 className='title_smaller'>
                            فایل خود را اینجا بارگذاری کنید
                        </h4>
                    </div>
                ) : (
                    <div className='files-container'>
                        {preview.map((file, index) => {
                            if (!file) return

                            const acceptedTypes = ['png', 'jpg', 'jpeg', 'gif']

                            const fileType = file.split('/')[1]!.split(';')[0]

                            return (
                                <div
                                    key={index}
                                    className='img-container'
                                    onClick={() => {
                                        setpreview(previews =>
                                            previews.filter(preview => {
                                                return preview !== file
                                            })
                                        )
                                    }}
                                >
                                    <img
                                        src={
                                            acceptedTypes.includes(fileType!)
                                                ? file
                                                : pdfImg
                                        }
                                        loading={'lazy'}
                                        decoding={'async'}
                                        alt=''
                                    />
                                    <div className='remove-img'>
                                        <CloseIcon size={30} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <label htmlFor='record-input' className='add-file title_small'>
                اضافه کردن فایل
            </label>
            <input
                id='record-input'
                onChange={e => readURL(e)}
                type='file'
                multiple={field.plural}
                accept='.pdf, .jpg, .jpeg, .png, image/jpg, image/jpeg, image/png'
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
    context: CanvasRenderingContext2D
}

var n = 0

const SignatureDrawer: FieldProps<SignatureField> = () => {
    const state = useRef<SignatureState>({
        px: 0,
        py: 0,
        cx: 0,
        cy: 0,
        draw: false,
        context: {} as CanvasRenderingContext2D,
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
                    state.current.context.fillStyle = 'black'
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
                    n++
                    if (!state.current.draw || n < 5) return
                    n = 0

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
                    state.current.context.strokeStyle = 'black'
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
        <ul>
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

const field_map: FMF = {
    link: ({ field }) => (
        <a href={field.url} title={field.title}>
            {field.text}
        </a>
    ),
    text: TextFC,
    str: StrFC,
    user: ({ field, update }) => (
        <input
            placeholder={'User Field'}
            value={field.value}
            onInput={e => {
                field.value = e.currentTarget.value
                update()
            }}
        />
    ),
    geo: GeoFC,
    int: IntFC,
    signature: SignatureDrawer,
    record: RecordFC,
    question: QuestionFC,
    date: DatePicker,
    option: OptionFC,
}

export { Viewer }
