import React, { FC } from 'react'

import Card from './Card'
import Clouds from './Clouds'

import './style/login.scss'

const Login: FC = () => {
    return (
        <div className='login'>
            <Clouds />
            <Card />
        </div>
    )
}

export default Login
