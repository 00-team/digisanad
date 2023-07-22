import React from 'react'

export const PlusSvg: Icon = ({ size, ...attr }) => {
    return (
        <svg
            stroke='currentColor'
            fill='none'
            strokeWidth='0'
            viewBox='0 0 24 24'
            height={size}
            width={size}
            {...attr}
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 4v16m8-8H4'
            ></path>
        </svg>
    )
}
