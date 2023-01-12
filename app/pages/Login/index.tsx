import React, { FC, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { UserAtom } from 'state'

import Card from './Authenticate/Card'
import Clouds from './Clouds'

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
        </div>
    )
}

const Authenticate: FC = () => {
    return (
        <div className='login'>
            <Clouds />
            <Card />
        </div>
    )
}

export default Login
