import React from 'react'

export const GoBack: Icon = ({ size, ...attr }) => {
    return (
        <svg
            stroke='white'
            fill='white'
            strokeWidth='0'
            viewBox='0 0 24 24'
            height={size}
            width={size}
            {...attr}
            xmlns='http://www.w3.org/2000/svg'
        >
            <path fill='none' d='M0 0h24v24H0V0z' opacity='.87'></path>
            <path d='M17.51 3.87L15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z'></path>
        </svg>
    )
}
