import React from 'react'

export const MaximumSvg: Icon = ({ size, ...attr }) => {
    return (
        <svg
            stroke='currentColor'
            fill='currentColor'
            stroke-width='0'
            viewBox='0 0 256 256'
            height={size}
            width={size}
            {...attr}
            xmlns='http://www.w3.org/2000/svg'
        >
            <path d='M208.49,143.51a12,12,0,0,1-17,17L140,109V224a12,12,0,0,1-24,0V109L64.49,160.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0ZM216,28H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z'></path>
        </svg>
    )
}
