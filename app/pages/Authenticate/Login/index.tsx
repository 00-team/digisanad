import React, { FC, useEffect } from 'react'

import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { useAtom } from 'jotai'
import { LoginAtom, UserAtom } from 'state'

import { Submit } from 'components'
import Clouds from 'components/Clouds'

import CodeEnter from './codeEnter'
import PhoneNumber from './phoneNumber'

import './style/login.scss'

const PHONE_VALIDATOR = new RegExp(/^09[0-9]{9}$/)

const Login: FC = () => {
    const [User, setUser] = useAtom(UserAtom)
    const [Login, setLogin] = useAtom(LoginAtom)

    const navigate = useNavigate()

    useEffect(() => {
        if (User.token || User.user_id !== 0) {
            navigate('/dashboard')
        }
    }, [])

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
                ReactAlert.success(`${data.nickname}، خوش امدید.`)
                setUser({
                    user_id: data.user_id,
                    token: data.token,
                    picture: data.picture,
                    nickname: data.nickname,
                    phone: Login.phone,
                })
                navigate('/dashboard')
            } else {
                ReactAlert.error('Invalid login!')
            }
        } catch (error) {
            HandleError(error)
        }
    }

    return (
        <div className='login'>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    Login.stage === 'code' ? codeSubmit() : phoneSubmit()
                }}
                className='login-card'
            >
                <div className='card-title  title_hero logo-text'>
                    Digi Sanad
                </div>
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
            <Clouds />
        </div>
    )
}

export default Login
