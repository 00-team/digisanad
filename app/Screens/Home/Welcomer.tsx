import React from 'react'

import './style/welcomer.scss'

const Welcomer = () => {
    return (
        <div className='welcomer'>
            {'Digi  Sanad'.split('').map((word, index) => {
                return (
                    <span
                        className={`word logo-text `}
                        key={index}
                        style={{
                            animationDelay: `${index * 50}ms`,
                        }}
                    >
                        {word}
                    </span>
                )
            })}
        </div>
    )
}

export default Welcomer
