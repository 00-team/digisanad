import React, { FC, HTMLAttributes } from 'react'

import './style/loading.scss'

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {}

const Loading: FC<LoadingProps> = ({ style }) => {
    return (
        <div className='loading-container' style={style}>
            <div className='loading-text title'>چند ثانیه ...</div>
            <div className='balls'>
                <div className='ball'></div>
                <div className='ball'></div>
                <div className='ball'></div>
                <div className='ball'></div>
                <div className='ball'></div>
                <div className='ball'></div>
                <div className='ball'></div>
            </div>
        </div>
    )
}

export { Loading }
