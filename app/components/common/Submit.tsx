import React, { FC, useState } from 'react'

import './style/submit.scss'

interface SubmitProps {
    title: string
    className?: string
}

const Submit: FC<SubmitProps> = ({ title, className }) => {
    const [Transform, setTransform] = useState({ x: 0, y: 0 })
    return (
        <button
            type='submit'
            className={`see-more-btn-wrapper ${className && className}`}
        >
            <div
                className='button-wrapper'
                onMouseEnter={e => {
                    const offset = e.currentTarget.getBoundingClientRect()
                    const relX = e.pageX - offset.left
                    const relY = e.pageY - offset.top

                    setTransform({ x: relX, y: relY })
                }}
                onMouseOut={e => {
                    const offset = e.currentTarget.getBoundingClientRect()
                    const relX = e.pageX - offset.left
                    const relY = e.pageY - offset.top

                    setTransform({ x: relX, y: relY })
                }}
            >
                <div className='text'>{title} </div>
                <div
                    className='dot'
                    style={{
                        top: `${Transform.y}px`,
                        left: `${Transform.x}px`,
                    }}
                ></div>
            </div>
        </button>
    )
}

export { Submit }
