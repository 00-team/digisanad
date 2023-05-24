import React, { FC } from 'react'

import { CloseFillSvg } from 'icons/Models/CloseFill'
import { PhoneSvg } from 'icons/Models/Phone'
import { Link } from 'react-router-dom'

import { useAtom } from 'jotai'
import { LoginAtom } from 'state'

const PhoneNumber: FC = () => {
    const [Login, setLogin] = useAtom(LoginAtom)
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
                    value={Login.phone}
                    onChange={e =>
                        setLogin({ ...Login, phone: e.target.value })
                    }
                />
                <div
                    className='icon'
                    onClick={() => setLogin({ ...Login, phone: '' })}
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
