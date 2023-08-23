import React, { FC } from 'react'

import { useAlert } from '@00-team/react-alert'
import loadable from '@loadable/component'
import axios from 'axios'
import { Route, Routes, useMatch } from 'react-router-dom'

// import { Login } from 'pages/Authenticate/Login'
import Footer from 'components/layout/Footer'

import './style/base.scss'
import './style/font/imports.scss'

const Home = loadable(() => import('pages/Home'))
const Login = loadable(() => import('pages/Authenticate/Login'))
const Register = loadable(() => import('pages/Authenticate/Register'))
const Dashboard = loadable(() => import('pages/Dashboard'))
const Admin = loadable(() => import('pages/Admin'))
const Contract = loadable(() => import('pages/Contract'))

const App: FC = () => {
    const isAdmin = useMatch('/admin/*')

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
            {!isAdmin && <Footer />}
        </>
    )
}

const MainContent: FC = () => {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path='/register/' element={<Register />} />
            <Route path='/login/' element={<Login />} />
            <Route path='/dashboard/' element={<Dashboard />} />

            <Route path='/admin/' element={<Admin />}>
                <Route path='schema/' element={<Contract />} />
            </Route>
        </Routes>
    )
}

export default App
