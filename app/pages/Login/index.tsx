import React, { FC, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { UserAtom } from 'state'

import LoginCard from './Authenticate/LoginCard'

import Clouds from './Clouds'
import RegisterCard from './Register/RegisterCard'

import './style/login.scss'

const Login: FC = () => {
    const User = useAtomValue(UserAtom)
    const navigate = useNavigate()

    // TODO:
    // link stages
    const [Stage, setStage] = useState<'login' | 'register'>()

    useEffect(() => {
        if (User.token || User.user_id !== 0) {
            navigate('/dashboard')
        }
    }, [])

    return (
        <>
            {Stage === 'login' && <Authenticate />}
            {Stage === 'register' && <Register />}
        </>
    )
}

const Register: FC = () => {
    return (
        <div className='register'>
            <Clouds />
            <RegisterCard />
        </div>
    )
}

const Authenticate: FC = () => {
    return (
        <div className='login'>
            <Clouds />
            <LoginCard />
        </div>
    )
}

export default Login
