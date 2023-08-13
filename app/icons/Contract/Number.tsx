import React from 'react'

export const NumberSvg: Icon = ({ size, ...attr }) => {
    return (
        <svg
            stroke='currentColor'
            fill='none'
            stroke-width='2'
            viewBox='0 0 24 24'
            stroke-linecap='round'
            stroke-linejoin='round'
            height={size}
            width={size}
            {...attr}
            xmlns='http://www.w3.org/2000/svg'
        >
            <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
            <path d='M8 10v-7l-2 2'></path>
            <path d='M6 16a2 2 0 1 1 4 0c0 .591 -.601 1.46 -1 2l-3 3h4'></path>
            <path d='M15 14a2 2 0 1 0 2 -2a2 2 0 1 0 -2 -2'></path>
            <path d='M6.5 10h3'></path>
        </svg>
    )
}
