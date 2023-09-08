import React, { FC } from 'react'

import { CloseFillIcon, PhoneIcon } from 'icons'
import { Link, useSearchParams } from 'react-router-dom'

import { useAtom } from 'jotai'
import { LoginAtom } from 'state'

const PhoneNumber: FC = () => {
    const [searchParams] = useSearchParams()
    const [Login, setLogin] = useAtom(LoginAtom)

    return (
        <div className='input-wrapper title'>
            <div className='placeholder'>
                <div className='icon'>
                    <PhoneIcon size={25} />
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
                    <CloseFillIcon size={25} />
                </div>
            </div>
            <Link
                to={
                    '/register/?next=' + searchParams.get('next') || 'dashboard'
                }
                className='goto-register title_small'
            >
                حساب کابری ندارید؟
            </Link>
        </div>
    )
}

export default PhoneNumber
