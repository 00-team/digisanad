import React from 'react'

export const ArrowUpSvg: Icon = ({ size, ...attr }) => {
    return (
        <svg
            stroke='currentColor'
            fill='currentColor'
            stroke-width='0'
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
}
