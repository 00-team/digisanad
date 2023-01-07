import React, { FC } from 'react'

import { useAlert } from '@00-team/react-alert'
import loadable from '@loadable/component'
import { UserTemp } from 'pages/UserTemp'
import { Route, Routes } from 'react-router-dom'

import './style/base.scss'
import './style/font/imports.scss'

const Home = loadable(() => import('pages/Home'))
const Login = loadable(() => import('pages/Login'))
const Dashboard = loadable(() => import('pages/Dashboard'))

const App: FC = () => {
    global.ReactAlert = useAlert()

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
