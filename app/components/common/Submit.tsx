import React, { FC, useState } from 'react'

import './style/submit.scss'

interface SubmitProps {
    title: string
    onSubmit: () => void
}

const Submit: FC<SubmitProps> = ({ title, onSubmit }) => {
    const [Transform, setTransform] = useState({ x: 0, y: 0 })
    return (
        <button
            onClick={onSubmit}
            type='submit'
            className='see-more-btn-wrapper title_small'
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
