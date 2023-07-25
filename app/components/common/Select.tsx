import React, { CSSProperties, FC, useState } from 'react'

// style
import './style/select.scss'

// icons

export interface Option {
    label: string
    value: unknown
}

interface SelectProps {
    options: Option[]
    defaultOpt?: Option
    onChange?: (opt: Option) => void
    zIndex?: number
}

const Select: FC<SelectProps> = ({
    options,
    defaultOpt,
    onChange,
    zIndex = 0,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOpt, setSelectedOpt] = useState<Option>(
        defaultOpt || { label: 'Select a Option', value: undefined }
    )

    return (
        <div className={`OO-select title_small ${isOpen ? 'active' : ''}`}>
            <div
                className='display-option-container'
                onClick={() => setIsOpen(!isOpen)}
                style={{ zIndex: zIndex + options.length + 7 }}
            >
                <div className='display-option-text'>{selectedOpt.label}</div>
                <div className='display-option-icon'>
                    <DropDownIcon
                        className={`icon ${isOpen ? 'rotate' : ''}`}
                        size={24}
                    />
                </div>
            </div>
            {options
                .filter(o => o.value !== selectedOpt.value)
                .map((opt, index) => (
                    <span
                        key={index}
                        className='option '
                        onClick={() => {
                            onChange && onChange(opt)
                            setSelectedOpt(opt)
                            setIsOpen(false)
                        }}
                        style={SelectStyle(
                            isOpen,
                            index,
                            options.length,
                            zIndex
                        )}
                    >
                        {opt.label}
                    </span>
                ))}
        </div>
    )
}

type SS = (
    isOpen: boolean,
    index: number,
    length: number,
    zIndex: number
) => CSSProperties
const SelectStyle: SS = (isOpen, index, length, zIndex) => {
    const TD = (length - 1 - index) * 200

    if (isOpen)
        return {
            top: `calc(${(index + 1) * 100}% - 15px)`,
            opacity: 1,
            pointerEvents: 'all',
            transitionDelay: `${index * 200}ms`,
            zIndex: zIndex + length - index,
        }
    else
        return {
            transitionDelay: `${TD}ms, ${TD + 100}ms`,
            zIndex: zIndex + length - index,
        }
}

const DropDownIcon: Icon = ({ size, ...attr }) => {
    return (
        <svg
            stroke='currentColor'
            fill='currentColor'
            stroke-width='0'
            viewBox='0 0 24 24'
            height={size}
            width={size}
            {...attr}
            xmlns='http://www.w3.org/2000/svg'
        >
            <path fill='none' d='M0 0h24v24H0V0z'></path>
            <path d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'></path>
        </svg>
    )
}

export { Option as SelectOption }
export { Select }
