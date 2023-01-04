import React, { FC } from 'react'

import { useAlert } from '@00-team/react-alert'
import loadable from '@loadable/component'
import { Route, Routes } from 'react-router-dom'

import './style/base.scss'
import './style/font/imports.scss'

const Home = loadable(() => import('./Screens/Home'))
const Login = loadable(() => import('./Screens/Login'))

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
        </Routes>
    )
}

export default App
