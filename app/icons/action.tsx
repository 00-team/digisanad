import React from 'react'

export const MenuIcon: Icon = ({ size = '24', ...attr }) => (
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
        <line x1='3' y1='12' x2='21' y2='12'></line>
        <line x1='3' y1='6' x2='21' y2='6'></line>
        <line x1='3' y1='18' x2='21' y2='18'></line>
    </svg>
)

export const CloseIcon: Icon = ({ size = '24', ...attr }) => (
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
        <path d='M15.854 12.854c-0-0-0-0-0-0l-4.854-4.854 4.854-4.854c0-0 0-0 0-0 0.052-0.052 0.090-0.113 0.114-0.178 0.066-0.178 0.028-0.386-0.114-0.529l-2.293-2.293c-0.143-0.143-0.351-0.181-0.529-0.114-0.065 0.024-0.126 0.062-0.178 0.114 0 0-0 0-0 0l-4.854 4.854-4.854-4.854c-0-0-0-0-0-0-0.052-0.052-0.113-0.090-0.178-0.114-0.178-0.066-0.386-0.029-0.529 0.114l-2.293 2.293c-0.143 0.143-0.181 0.351-0.114 0.529 0.024 0.065 0.062 0.126 0.114 0.178 0 0 0 0 0 0l4.854 4.854-4.854 4.854c-0 0-0 0-0 0-0.052 0.052-0.090 0.113-0.114 0.178-0.066 0.178-0.029 0.386 0.114 0.529l2.293 2.293c0.143 0.143 0.351 0.181 0.529 0.114 0.065-0.024 0.126-0.062 0.178-0.114 0-0 0-0 0-0l4.854-4.854 4.854 4.854c0 0 0 0 0 0 0.052 0.052 0.113 0.090 0.178 0.114 0.178 0.066 0.386 0.029 0.529-0.114l2.293-2.293c0.143-0.143 0.181-0.351 0.114-0.529-0.024-0.065-0.062-0.126-0.114-0.178z'></path>
    </svg>
)

export const EditIcon: Icon = ({ size = '24', ...attr }) => (
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
        <path d='M103 464H48v-55L358.14 98.09l55.77 55.78L103 464zm322.72-322L370 86.28l31.66-30.66C406.55 50.7 414.05 48 421 48a25.91 25.91 0 0118.42 7.62l17 17A25.87 25.87 0 01464 91c0 7-2.71 14.45-7.62 19.36zm-7.52-70.83z'></path>
    </svg>
)

export const SendIcon: Icon = ({ size = '24', ...attr }) => (
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
        <path d='M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z'></path>
    </svg>
)

export const PlusIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='none'
        strokeWidth='0'
        viewBox='0 0 24 24'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
        {...attr}
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 4v16m8-8H4'
        ></path>
    </svg>
)

export const MinusIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 24 24'
        height={size}
        width={size}
        xmlns='http://www.w3.org/2000/svg'
        {...attr}
    >
        <path d='M5 11h14v2H5z'></path>
    </svg>
)

export const RemoveIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...attr}
    >
        <line x1='18' y1='6' x2='6' y2='18'></line>
        <line x1='6' y1='6' x2='18' y2='18'></line>
    </svg>
)

export const InviteIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 16 16'
        height={size}
        width={size}
        {...attr}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z'></path>
    </svg>
)

export const LockIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
        height={size}
        width={size}
        {...attr}
    >
        <path
            fillRule='evenodd'
            d='M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z'
            clipRule='evenodd'
        />
    </svg>
)

export const UnLockIcon: Icon = ({ size = '24', ...attr }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
        height={size}
        width={size}
        {...attr}
    >
        <path
            fillRule='evenodd'
            d='M14.5 1A4.5 4.5 0 0010 5.5V9H3a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1.5V5.5a3 3 0 116 0v2.75a.75.75 0 001.5 0V5.5A4.5 4.5 0 0014.5 1z'
            clipRule='evenodd'
        />
    </svg>
)
