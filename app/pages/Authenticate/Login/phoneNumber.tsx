import React, { FC } from 'react'

import { CloseFillSvg } from 'Icons/Models/CloseFill'
import { PhoneSvg } from 'Icons/Models/Phone'
import { Link } from 'react-router-dom'

const PhoneNumber: FC = () => {
    return (
        <div className='input-wrapper title'>
            <div className='placeholder'>
                <div className='icon'>
                    <PhoneSvg />
                </div>
                <div className='holder'>شماره تلفن </div>
            </div>
            <div className='input-column'>
                <input
                    autoComplete='new-password'
                    className='input title_small'
                    name='phonenumber'
                    autoFocus
                    inputMode='numeric'
                    id='phonenumber'
                    placeholder='09121111111'
                />
                <div
                    className='icon'
                    onClick={() => {
                        const input = document.querySelector(
                            'input#phonenumber'
                        ) as HTMLInputElement

                        return (input.value = '')
                    }}
                >
                    <CloseFillSvg />
                </div>
            </div>
            <Link to={'/register'} className='goto-register title_small'>
                حساب کابری ندارید؟
            </Link>
        </div>
    )
}

export default PhoneNumber
