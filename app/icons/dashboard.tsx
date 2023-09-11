import React from 'react'

export const ToolIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        height={size}
        width={size}
        {...attr}
    >
        <path
            d={`M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4
             0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 
             2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z`}
        ></path>
    </svg>
)

export const AddressIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 512 512'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
        {...attr}
    >
        <path d='M507.31 84.69L464 41.37c-6-6-14.14-9.37-22.63-9.37H288V16c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v16H56c-13.25 0-24 10.75-24 24v80c0 13.25 10.75 24 24 24h385.37c8.49 0 16.62-3.37 22.63-9.37l43.31-43.31c6.25-6.26 6.25-16.38 0-22.63zM224 496c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V384h-64v112zm232-272H288v-32h-64v32H70.63c-8.49 0-16.62 3.37-22.63 9.37L4.69 276.69c-6.25 6.25-6.25 16.38 0 22.63L48 342.63c6 6 14.14 9.37 22.63 9.37H456c13.25 0 24-10.75 24-24v-80c0-13.25-10.75-24-24-24z'></path>
    </svg>
)

export const WalletIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 512 512'
        height={size}
        width={size}
        {...attr}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M461.2 128H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h384c8.84 0 16-7.16 16-16 0-26.51-21.49-48-48-48H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h397.2c28.02 0 50.8-21.53 50.8-48V176c0-26.47-22.78-48-50.8-48zM416 336c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z'></path>
    </svg>
)

export const TransactionIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 24 24'
        height={size}
        width={size}
        {...attr}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            fill='none'
            stroke='#000'
            strokeWidth='2'
            d='M2,7 L20,7 M16,2 L21,7 L16,12 M22,17 L4,17 M8,12 L3,17 L8,22'
        ></path>
    </svg>
)

export const SenderIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 512 512'
        height={size}
        width={size}
        style={{ rotate: '180deg' }}
        xmlns='http://www.w3.org/2000/svg'
        {...attr}
    >
        <path d='M476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0027.14 52 24.65 24.65 0 0016 72.59v113.29a24 24 0 0019.52 23.57l232.93 43.07a4 4 0 010 7.86L35.53 303.45A24 24 0 0016 327v113.31A23.57 23.57 0 0026.59 460a23.94 23.94 0 0013.22 4 24.55 24.55 0 009.52-1.93L476.4 285.94l.19-.09a32 32 0 000-58.8z'></path>
    </svg>
)

export const ProfileIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 24 24'
        height={size}
        width={size}
        {...attr}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path fill='none' d='M0 0h24v24H0z'></path>
        <path d='M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z'></path>
    </svg>
)

export const PostalCodeIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 24 24'
        height={size}
        width={size}
        {...attr}
        xmlns='http://www.w3.org/2000/svg'
    >
        <g>
            <path fill='none' d='M0 0h24v24H0z'></path>
            <path d='M18.364 17.364L12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0zM12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z'></path>
        </g>
    </svg>
)

export const NotificationIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        strokeWidth='0'
        viewBox='0 0 512 512'
        height={size}
        width={size}
        {...attr}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M255.9 456c31.1 0 48.1-22 48.1-53h-96.3c0 31 17 53 48.2 53zM412 352.2c-15.4-20.3-45.7-32.2-45.7-123.1 0-93.3-41.2-130.8-79.6-139.8-3.6-.9-6.2-2.1-6.2-5.9v-2.9c0-13.4-11-24.7-24.4-24.6-13.4-.2-24.4 11.2-24.4 24.6v2.9c0 3.7-2.6 5-6.2 5.9-38.5 9.1-79.6 46.5-79.6 139.8 0 90.9-30.3 102.7-45.7 123.1-9.9 13.1-.5 31.8 15.9 31.8h280.1c16.3 0 25.7-18.8 15.8-31.8z'></path>
    </svg>
)

export const NationalIdIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 24 24'
        height={size}
        width={size}
        {...attr}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path fill='none' d='M0 0h24v24H0z'></path>
        <path d='M20 7h-5V4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 12c.83 0 1.5.67 1.5 1.5S9.83 15 9 15s-1.5-.67-1.5-1.5S8.17 12 9 12zm3 6H6v-.75c0-1 2-1.5 3-1.5s3 .5 3 1.5V18zm1-9h-2V4h2v5zm5 7.5h-4V15h4v1.5zm0-3h-4V12h4v1.5z'></path>
    </svg>
)

export const GlobeIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='black'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 496 512'
        height={size}
        width={size}
        {...attr}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm82.29 357.6c-3.9 3.88-7.99 7.95-11.31 11.28-2.99 3-5.1 6.7-6.17 10.71-1.51 5.66-2.73 11.38-4.77 16.87l-17.39 46.85c-13.76 3-28 4.69-42.65 4.69v-27.38c1.69-12.62-7.64-36.26-22.63-51.25-6-6-9.37-14.14-9.37-22.63v-32.01c0-11.64-6.27-22.34-16.46-27.97-14.37-7.95-34.81-19.06-48.81-26.11-11.48-5.78-22.1-13.14-31.65-21.75l-.8-.72a114.792 114.792 0 0 1-18.06-20.74c-9.38-13.77-24.66-36.42-34.59-51.14 20.47-45.5 57.36-82.04 103.2-101.89l24.01 12.01C203.48 89.74 216 82.01 216 70.11v-11.3c7.99-1.29 16.12-2.11 24.39-2.42l28.3 28.3c6.25 6.25 6.25 16.38 0 22.63L264 112l-10.34 10.34c-3.12 3.12-3.12 8.19 0 11.31l4.69 4.69c3.12 3.12 3.12 8.19 0 11.31l-8 8a8.008 8.008 0 0 1-5.66 2.34h-8.99c-2.08 0-4.08.81-5.58 2.27l-9.92 9.65a8.008 8.008 0 0 0-1.58 9.31l15.59 31.19c2.66 5.32-1.21 11.58-7.15 11.58h-5.64c-1.93 0-3.79-.7-5.24-1.96l-9.28-8.06a16.017 16.017 0 0 0-15.55-3.1l-31.17 10.39a11.95 11.95 0 0 0-8.17 11.34c0 4.53 2.56 8.66 6.61 10.69l11.08 5.54c9.41 4.71 19.79 7.16 30.31 7.16s22.59 27.29 32 32h66.75c8.49 0 16.62 3.37 22.63 9.37l13.69 13.69a30.503 30.503 0 0 1 8.93 21.57 46.536 46.536 0 0 1-13.72 32.98zM417 274.25c-5.79-1.45-10.84-5-14.15-9.97l-17.98-26.97a23.97 23.97 0 0 1 0-26.62l19.59-29.38c2.32-3.47 5.5-6.29 9.24-8.15l12.98-6.49C440.2 193.59 448 223.87 448 256c0 8.67-.74 17.16-1.82 25.54L417 274.25z'></path>
    </svg>
)

export const ContractIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='black'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 24 24'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
        {...attr}
    >
        <g>
            <path fill='none' d='M0 0h24v24H0z'></path>
            <path d='M20 2a3 3 0 0 1 3 3v2h-2v12a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3v-2h16v2a1 1 0 0 0 .883.993L18 20a1 1 0 0 0 .993-.883L19 19v-4H3V5a3 3 0 0 1 3-3h14z'></path>
        </g>
    </svg>
)

export const PrintIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 16 16'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
        {...attr}
    >
        <path d='M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z'></path>
        <path d='M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z'></path>
    </svg>
)

export const CoinIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 512 512'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
        {...attr}
    >
        <path d='M0 405.3V448c0 35.3 86 64 192 64s192-28.7 192-64v-42.7C342.7 434.4 267.2 448 192 448S41.3 434.4 0 405.3zM320 128c106 0 192-28.7 192-64S426 0 320 0 128 28.7 128 64s86 64 192 64zM0 300.4V352c0 35.3 86 64 192 64s192-28.7 192-64v-51.6c-41.3 34-116.9 51.6-192 51.6S41.3 334.4 0 300.4zm416 11c57.3-11.1 96-31.7 96-55.4v-42.7c-23.2 16.4-57.3 27.6-96 34.5v63.6zM192 160C86 160 0 195.8 0 240s86 80 192 80 192-35.8 192-80-86-80-192-80zm219.3 56.3c60-10.8 100.7-32 100.7-56.3v-42.7c-35.5 25.1-96.5 38.6-160.7 41.8 29.5 14.3 51.2 33.5 60 57.2z'></path>
    </svg>
)

export const CodeIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 512 512'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
        {...attr}
    >
        <path d='M249.2 224c-14.2-40.2-55.1-72-100.2-72-57.2 0-101 46.8-101 104s45.8 104 103 104c45.1 0 84.1-31.8 98.2-72H352v64h69.1v-64H464v-64H249.2zm-97.6 66.5c-19 0-34.5-15.5-34.5-34.5s15.5-34.5 34.5-34.5 34.5 15.5 34.5 34.5-15.5 34.5-34.5 34.5z'></path>
    </svg>
)

export const CallenderIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 512 512'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
        {...attr}
    >
        <path d='M480 128a64 64 0 00-64-64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00112 48v16H96a64 64 0 00-64 64v12a4 4 0 004 4h440a4 4 0 004-4zM32 416a64 64 0 0064 64h320a64 64 0 0064-64V179a3 3 0 00-3-3H35a3 3 0 00-3 3zm344-208a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24zm-80-80a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24zm-80-80a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24zm-80-80a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24z'></path>
    </svg>
)

export const ArrowUpIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        version='1.1'
        viewBox='0 0 16 16'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
        {...attr}
    >
        <path d='M8 0.5l-7.5 7.5h4.5v8h6v-8h4.5z'></path>
    </svg>
)

export const ArrowDownIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        version='1.1'
        viewBox='0 0 16 16'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
        style={{ rotate: '180deg' }}
        {...attr}
    >
        <path d='M8 0.5l-7.5 7.5h4.5v8h6v-8h4.5z'></path>
    </svg>
)
