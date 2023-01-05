import React, { FC } from 'react'

import { TemplateProps } from '@00-team/react-alert'

import './style/alert.scss'

const Alert: FC<TemplateProps> = ({ message, close, options }) => {
    return (
        <div className={`alert-container title_smaller ${options.type}`}>
            <div className='icon'>
                {options.type === 'success' && <AiFillCheckCircle size={24} />}
                {options.type === 'error' && <IoWarning size={24} />}
                {options.type === 'info' && <TiInfo size={24} />}
            </div>
            <span className={'holder' + options.type}>{message}</span>
            <div className='alert-close' onClick={close}>
                <ImCross size={15} />
            </div>
        </div>
    )
}
export { Alert }

interface SvgProps {
    size: number
}

const AiFillCheckCircle = ({ size }: SvgProps) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 1024 1024'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z'></path>
    </svg>
)
const ImCross = ({ size }: SvgProps) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        version='1.1'
        viewBox='0 0 16 16'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M15.854 12.854c-0-0-0-0-0-0l-4.854-4.854 4.854-4.854c0-0 0-0 0-0 0.052-0.052 0.090-0.113 0.114-0.178 0.066-0.178 0.028-0.386-0.114-0.529l-2.293-2.293c-0.143-0.143-0.351-0.181-0.529-0.114-0.065 0.024-0.126 0.062-0.178 0.114 0 0-0 0-0 0l-4.854 4.854-4.854-4.854c-0-0-0-0-0-0-0.052-0.052-0.113-0.090-0.178-0.114-0.178-0.066-0.386-0.029-0.529 0.114l-2.293 2.293c-0.143 0.143-0.181 0.351-0.114 0.529 0.024 0.065 0.062 0.126 0.114 0.178 0 0 0 0 0 0l4.854 4.854-4.854 4.854c-0 0-0 0-0 0-0.052 0.052-0.090 0.113-0.114 0.178-0.066 0.178-0.029 0.386 0.114 0.529l2.293 2.293c0.143 0.143 0.351 0.181 0.529 0.114 0.065-0.024 0.126-0.062 0.178-0.114 0-0 0-0 0-0l4.854-4.854 4.854 4.854c0 0 0 0 0 0 0.052 0.052 0.113 0.090 0.178 0.114 0.178 0.066 0.386 0.029 0.529-0.114l2.293-2.293c0.143-0.143 0.181-0.351 0.114-0.529-0.024-0.065-0.062-0.126-0.114-0.178z'></path>
    </svg>
)

const IoWarning = ({ size }: SvgProps) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 512 512'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M449.07 399.08L278.64 82.58c-12.08-22.44-44.26-22.44-56.35 0L51.87 399.08A32 32 0 0080 446.25h340.89a32 32 0 0028.18-47.17zm-198.6-1.83a20 20 0 1120-20 20 20 0 01-20 20zm21.72-201.15l-5.74 122a16 16 0 01-32 0l-5.74-121.95a21.73 21.73 0 0121.5-22.69h.21a21.74 21.74 0 0121.73 22.7z'></path>
    </svg>
)

const TiInfo = ({ size }: SvgProps) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        version='1.2'
        baseProfile='tiny'
        viewBox='0 0 24 24'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M21.17,15.4l-5.91-9.85C14.48,4.25,13.3,3.51,12,3.51S9.52,4.25,8.74,5.54L2.83,15.4c-0.44,0.73-0.66,1.49-0.66,2.21
	c0,0.57,0.14,1.13,0.42,1.62C3.23,20.35,4.47,21,6,21h12c1.53,0,2.77-0.65,3.41-1.77c0.28-0.49,0.42-1.02,0.42-1.58
	C21.84,16.91,21.62,16.14,21.17,15.4z M12,8.45c0.85,0,1.55,0.7,1.55,1.55c0,0.85-0.69,1.55-1.55,1.55c-0.85,0-1.55-0.7-1.55-1.55
	C10.45,9.14,11.14,8.45,12,8.45z M13.69,16.91c-0.03,0.04-0.8,0.92-2.07,0.92l-0.15,0c-0.51-0.03-0.93-0.25-1.18-0.63
	c-0.31-0.47-0.36-1.11-0.12-1.82l0.41-1.22c0.23-0.68,0.01-0.79-0.11-0.85l-0.14-0.02c-0.25,0-0.6,0.15-0.71,0.21
	c-0.1,0.05-0.23,0.03-0.31-0.07c-0.07-0.1-0.07-0.23,0.01-0.32c0.03-0.04,0.87-0.99,2.22-0.91c0.51,0.03,0.93,0.25,1.18,0.63
	c0.32,0.47,0.36,1.11,0.12,1.83l-0.41,1.22c-0.23,0.68-0.01,0.79,0.11,0.85l0.14,0.02c0.25,0,0.6-0.15,0.71-0.2
	c0.11-0.06,0.23-0.03,0.31,0.07C13.77,16.69,13.77,16.82,13.69,16.91z'
        ></path>
    </svg>
)
