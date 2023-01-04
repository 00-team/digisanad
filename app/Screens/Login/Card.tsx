import React from 'react'

import { Submit } from 'components'

import './style/card.scss'

const Card = () => {
    return (
        <div className='card'>
            <div className='card-title  title_hero logo-text'>Digi Sanad</div>
            <div className='card-header title'>
                <span>ورود</span>
            </div>
            <div className='card-inps '>
                <div className='username input-wrapper title'>
                    <div className='placeholder'>
                        <div className='icon'>
                            <Person />
                        </div>
                        <div className='holder'>نام کاربری</div>
                    </div>
                    <input
                        autoComplete='new-password'
                        className='input title_smaller'
                        name='usesadasdrname'
                        autoFocus
                        type='text'
                    />
                </div>
                <div className='password input-wrapper title'>
                    <div className='placeholder'>
                        <div className='icon'>
                            <Password />
                        </div>
                        <div className='holder'>کلمه عبور</div>
                    </div>
                    <input
                        autoComplete='new-password'
                        className='input title_smaller'
                        name='passwdaddord'
                        type={'password'}
                    />
                </div>
            </div>
            <Submit title='ورود' />
        </div>
    )
}

export default Card

const Person = () => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        stroke-width='0'
        viewBox='0 0 512 512'
        height={20}
        width={20}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M332.64 64.58C313.18 43.57 286 32 256 32c-30.16 0-57.43 11.5-76.8 32.38-19.58 21.11-29.12 49.8-26.88 80.78C156.76 206.28 203.27 256 256 256s99.16-49.71 103.67-110.82c2.27-30.7-7.33-59.33-27.03-80.6zM432 480H80a31 31 0 01-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75 1.94 10.73-.68 21.34-7.18 29.11A31 31 0 01432 480z'></path>
    </svg>
)

const Password = () => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        stroke-width='0'
        viewBox='0 0 512 512'
        height={20}
        width={20}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M249.2 224c-14.2-40.2-55.1-72-100.2-72-57.2 0-101 46.8-101 104s45.8 104 103 104c45.1 0 84.1-31.8 98.2-72H352v64h69.1v-64H464v-64H249.2zm-97.6 66.5c-19 0-34.5-15.5-34.5-34.5s15.5-34.5 34.5-34.5 34.5 15.5 34.5 34.5-15.5 34.5-34.5 34.5z'></path>
    </svg>
)
