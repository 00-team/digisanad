import React, { FC } from 'react'

import { useAlert } from '@00-team/react-alert'
import loadable from '@loadable/component'
import axios from 'axios'
import { UserTemp } from 'pages/UserTemp'
import { Route, Routes } from 'react-router-dom'

// import { Login } from 'pages/Authenticate/Login'
import './style/base.scss'
import './style/font/imports.scss'

const Home = loadable(() => import('pages/Home'))
const Login = loadable(() => import('pages/Authenticate/Login'))
const Register = loadable(() => import('pages/Authenticate/Register'))
const Dashboard = loadable(() => import('pages/Dashboard'))

const App: FC = () => {
    global.ReactAlert = useAlert()
    global.HandleError = error => {
        let msg = 'Error'

        if (axios.isAxiosError(error)) {
            if (error.response) {
                msg = error.response.data.detail
                if (Array.isArray(msg)) {
                    msg = msg[0].msg
                }
            } else {
                msg = error.message
            }
        } else if (error instanceof Error) {
            msg = error.message
        }

        ReactAlert.error(msg)
    }

    return (
        <>
            <MainContent />
        </>
    )
}

const MainContent: FC = () => {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/me' element={<UserTemp />} />
            <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
    )
}

export default App
