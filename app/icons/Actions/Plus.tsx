import React, { FC } from 'react'

export const PlusSvg: FC = () => {
    return (
        <svg
            stroke='currentColor'
            fill='none'
            strokeWidth='0'
            viewBox='0 0 24 24'
            height={20}
            width={20}
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
