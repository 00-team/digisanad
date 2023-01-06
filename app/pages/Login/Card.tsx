import React, { FC } from 'react'

import axios from 'axios'

import { useAtom, useSetAtom } from 'jotai'
import { LoginAtom, UserAtom } from 'state'

import { Submit } from 'components'

import CodeEnter from './codeEnter'
import PhoneNumber from './phoneNumber'

import './style/card.scss'

const PHONE_VALIDATOR = new RegExp(/^09[0-9]{9}$/)

const Card: FC = () => {
    const [Login, setLogin] = useAtom(LoginAtom)
    const setUser = useSetAtom(UserAtom)

    const phoneSubmit = async () => {
        const phonenumber = document.querySelector(
            'input#phonenumber'
        ) as HTMLInputElement

        if (PHONE_VALIDATOR.test(phonenumber.value)) {
            const response = await axios.post('/api/auth/login/', {
                phone: phonenumber.value,
            })

            if (typeof response.data.timer === 'number') {
                ReactAlert.success('کد تایید برای شما برای پیامک شد.')
                setLogin({
                    phone: phonenumber.value,
                    stage: 'code',
                    time: response.data.timer,
                    resend: !response.data.timer,
                })
            } else {
                ReactAlert.error('Error while authenticating!')
            }
        } else {
            ReactAlert.error('شماره تلفن خود را به درستی وارد کنید.')
        }
    }

    const codeSubmit = async () => {
        const code_input = document.querySelector(
            'input#code'
        ) as HTMLInputElement

        try {
            const response = await axios.post('/api/auth/verify/', {
                phone: Login.phone,
                code: code_input.value,
            })

            const data = response.data

            if (data.token) {
                ReactAlert.success('Successful login!')
                setUser({
                    user_id: data.user_id,
                    token: data.token,
                    picture: data.picture,
                    nickname: data.nickname,
                    phone: Login.phone,
                })
            } else {
                ReactAlert.success('Invalid login!')
            }

            // user
            console.log(response.data)
        } catch (error) {
            // handle this error
            console.log(error)
            console.log(axios.isAxiosError(error))
        }
    }

    return (
        <form
            onSubmit={e => {
                e.preventDefault()
                Login.stage === 'code' ? codeSubmit() : phoneSubmit()
            }}
            className='card'
        >
            <div className='card-title  title_hero logo-text'>Digi Sanad</div>
            <div className='card-header title'>
                <span>ورود</span>
            </div>

            <div className='card-inps '>
                {Login.stage === 'phone' ? <PhoneNumber /> : <CodeEnter />}
            </div>

            {Login.stage === 'phone' ? (
                <Submit title='تایید' className='title_smaller' />
            ) : (
                <Submit title='ورود' className='title_smaller' />
            )}
        </form>
    )
}

export default Card
