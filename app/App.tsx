import React, { FC } from 'react'

import loadable from '@loadable/component'
import { Route, Routes } from 'react-router-dom'

import './style/base.scss'
import './style/font/imports.scss'

const Home = loadable(() => import('./Screens/Home'))

const App: FC = () => {
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
        </Routes>
    )
}

export default App
