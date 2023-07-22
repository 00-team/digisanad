import React from 'react'

export const TransactionSvg: Icon = ({ size, ...attr }) => (
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
