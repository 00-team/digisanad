import React, { FC, useEffect } from 'react'

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

    // debug
    let isLogged = false
    //

    useEffect(() => {
        // TODO:
        // this will basicly checks if the user is loged in or not
        // if user is loged in redirect them to the dashboard page ...
        if (User.token || User.user_id !== 0) {
            navigate('/dashboard')
        }

        // if (localStorage.token) {
        //     ;(async () => {
        //         const response = await axios.get('/api/user/update/', {
        //             headers: {
        //                 Authorization: `user ${localStorage.token}`,
        //             },
        //         })

        //         // user
        //         console.log(response.data)
        //         // redirect to ....
        //     })()
        // }
    }, [])

    return <>{isLogged ? <Authenticate /> : <Register />}</>
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
