import React, { FC, useEffect } from 'react'

import { useAlert } from '@00-team/react-alert'
import loadable from '@loadable/component'
import axios from 'axios'
import { UserTemp } from 'pages/UserTemp'
import { Route, Routes } from 'react-router-dom'

import './style/base.scss'
import './style/font/imports.scss'

const Home = loadable(() => import('pages/Home'))
const Login = loadable(() => import('pages/Login'))
const Dashboard = loadable(() => import('pages/Dashboard'))

const App: FC = () => {
    const alert = useAlert()

    useEffect(() => {
        global.HandleError = error => {
            let msg = 'Error'

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    msg = error.response.data.detail
                } else {
                    msg = error.message
                }
            } else if (error instanceof Error) {
                msg = error.message
            }

            alert.error(msg)
        }

        global.ReactAlert = alert
    }, [])

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
            <Route path='/login' element={<Login />} />
            <Route path='/me' element={<UserTemp />} />
            <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
    )
}

export default App
