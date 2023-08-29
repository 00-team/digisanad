import React, { FC } from 'react'

import axios from 'axios'
import { CodeIcon, GoBack } from 'icons'

import { useAtom } from 'jotai'
import { LoginAtom } from 'state'

import { Timer } from 'components/common/Timer'

const CodeEnter: FC = () => {
    const [Login, setLogin] = useAtom(LoginAtom)

    const SendAgain = async () => {
        try {
            const response = await axios.post('/api/auth/verify/', {
                phone: Login.phone,
                action: 'login',
            })

            if (typeof response.data.timer === 'number') {
                ReactAlert.info('کد تایید مجددا برای شما پیامک شد.')
                setLogin({
                    stage: 'code',
                    time: response.data.timer,
                    resend: !response.data.timer,
                })
            } else {
                ReactAlert.error('خطا! لطفا دوباره تلاش کنید.')
            }
        } catch (error) {
            HandleError(error)
        }
    }

    return (
        <>
            <div className='input-wrapper title'>
                <div className='placeholder'>
                    <div className='icon'>
                        <CodeIcon size={25} />
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
                        کد تایید به شماره {Login.phone} پیامک شد.
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
                <GoBack size={25} />
            </div>
        </>
    )
}

export default CodeEnter
