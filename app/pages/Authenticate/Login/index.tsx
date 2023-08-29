import React, { FC, useEffect } from 'react'

import { user_get_me } from 'api'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useAtom } from 'jotai'
import { LoginAtom, TokenAtom, UserAtom } from 'state'

import { Submit } from 'components'
import Clouds from 'components/Clouds'

import CodeEnter from './codeEnter'
import PhoneNumber from './phoneNumber'

import './style/login.scss'

const PHONE_VALIDATOR = new RegExp(/^09[0-9]{9}$/)

const Login: FC = () => {
    const [searchParams] = useSearchParams()
    const [user, setUser] = useAtom(UserAtom)
    const [Login, setLogin] = useAtom(LoginAtom)
    const [token, setToken] = useAtom(TokenAtom)

    const navigate = useNavigate()

    useEffect(() => {
        let next = searchParams.get('next') || '/'

        if (user.user_id) {
            navigate(next)
            return
        }

        if (token) {
            user_get_me(token).then(data => {
                if (data === null) {
                    setToken('')
                } else {
                    setUser(data)
                    navigate(next)
                }
            })
        }
    }, [])

    const phoneSubmit = async () => {
        if (PHONE_VALIDATOR.test(Login.phone)) {
            try {
                const response = await axios.post('/api/verification/', {
                    phone: Login.phone,
                    action: 'login',
                })

                if (typeof response.data.expires === 'number') {
                    ReactAlert.success('کد تایید برای شما برای پیامک شد.')
                    setLogin({
                        phone: Login.phone,
                        stage: 'code',
                        time: response.data.timer,
                        resend: !response.data.timer,
                    })
                } else {
                    ReactAlert.error('Error while authenticating!')
                }
            } catch (error) {
                HandleError(error)
            }
        } else {
            ReactAlert.error('شماره تلفن خود را به درستی وارد کنید.')
        }
    }

    const codeSubmit = async () => {
        let next = searchParams.get('next') || '/'
        const code_input = document.querySelector(
            'input#code'
        ) as HTMLInputElement

        try {
            const response = await axios.post('/api/auth/login/', {
                phone: Login.phone,
                code: code_input.value,
            })

            const data = response.data

            if (data.token) {
                setUser({
                    address: data.address,
                    birth_date: data.birth_date,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    national_id: data.national_id,
                    phone: data.phone,
                    postal_code: data.postal_code,
                    user_id: data.user_id,
                })
                setToken(data.token)
                navigate(next)
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
