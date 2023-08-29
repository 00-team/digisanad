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
