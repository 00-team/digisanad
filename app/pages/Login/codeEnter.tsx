import React, { FC } from 'react'

import axios from 'axios'

import { useAtom } from 'jotai'
import { LoginAtom } from 'state'

import { Timer } from 'components/common/Timer'

const NUMBER_DEBUG = '09120974956'

const CodeEnter: FC = () => {
    const [Login, setLogin] = useAtom(LoginAtom)

    const SendAgain = async () => {
        const response = await axios.post('/api/auth/login/', {
            phone: Login.phone,
        })

        if (typeof response.data.timer === 'number') {
            ReactAlert.info('کد تایید مجددا برای شما پیامک شد.')
            setLogin({
                stage: 'code',
                time: response.data.timer,
                resend: !response.data.timer,
            })
        } else {
            ReactAlert.error('Error while authenticating!')
        }
    }

    return (
        <>
            <div className='input-wrapper title'>
                <div className='placeholder'>
                    <div className='icon'>
                        <SubmitCode />
                    </div>
                    <div className='holder'>کد تایید</div>
                </div>
                <div className='input-column'>
                    <input
                        autoComplete='one-time-code'
                        className='input title_small'
                        name='code'
                        inputMode='numeric'
                        autoFocus
                        id='code'
                        placeholder='12345'
                    />
                </div>
                <div className='card-options'>
                    <div className='phone-number-holder title_smaller'>
                        کد تایید به شماره {NUMBER_DEBUG} پیامک شد.
                    </div>
                    {Login.resend ? (
                        <div
                            className='title_small can-resend'
                            onClick={() => SendAgain()}
                        >
                            ارسال مجدد
                        </div>
                    ) : (
                        <div className='title_small timer-container cant-resend'>
                            <Timer start={Login.time} />
                            <div>ثانیه تا ارسال مجدد</div>
                        </div>
                    )}
                </div>
            </div>
            <div
                className='go-back-wrapper icon'
                onClick={() => setLogin({ stage: 'phone' })}
            >
                <GoBack />
            </div>
        </>
    )
}

export default CodeEnter

const SubmitCode = () => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 512 512'
        height={20}
        width={20}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M249.2 224c-14.2-40.2-55.1-72-100.2-72-57.2 0-101 46.8-101 104s45.8 104 103 104c45.1 0 84.1-31.8 98.2-72H352v64h69.1v-64H464v-64H249.2zm-97.6 66.5c-19 0-34.5-15.5-34.5-34.5s15.5-34.5 34.5-34.5 34.5 15.5 34.5 34.5-15.5 34.5-34.5 34.5z'></path>
    </svg>
)

const GoBack = () => (
    <svg
        stroke='white'
        fill='white'
        strokeWidth='0'
        viewBox='0 0 24 24'
        height={30}
        width={30}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path fill='none' d='M0 0h24v24H0V0z' opacity='.87'></path>
        <path d='M17.51 3.87L15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z'></path>
    </svg>
)
