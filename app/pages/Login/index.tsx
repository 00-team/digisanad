import React, { FC, useEffect } from 'react'

import { useAtomValue } from 'jotai'
import { UserAtom } from 'state'

import Card from './Card'
import Clouds from './Clouds'

import './style/login.scss'

const Login: FC = () => {
    const User = useAtomValue(UserAtom)

    useEffect(() => {
        // TODO:
        // this will basicly checks if the user is loged in or not
        // if user is loged in redirect them to the dashboard page ...
        if (User.token || User.user_id !== 0) {
            // redirect
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

    return (
        <div className='login'>
            <Clouds />
            <Card />
        </div>
    )
}

export default Login
