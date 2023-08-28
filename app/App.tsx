import React, { FC } from 'react'

import { useAlert } from '@00-team/react-alert'
import loadable from '@loadable/component'
import axios from 'axios'
import { Route, Routes } from 'react-router-dom'

import {
    Contracts,
    Deposit,
    MyInfo,
    Transactions,
    Wallet,
    Withdraw,
} from 'pages/Dashboard'

// import { Login } from 'pages/Authenticate/Login'
import Footer from 'components/layout/Footer'

import './style/base.scss'
import './style/font/imports.scss'

const Home = loadable(() => import('pages/Home'))
const Login = loadable(() => import('pages/Authenticate/Login'))
const Register = loadable(() => import('pages/Authenticate/Register'))
const Dashboard = loadable(() => import('pages/Dashboard'))
const Admin = loadable(() => import('pages/Admin'))
const Schema = loadable(() => import('pages/schema'))
const SchemaList = loadable(() => import('pages/Admin/schemas'))

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
        <Routes>
            <Route
                index
                element={
                    <>
                        <Home />
                        <Footer />
                    </>
                }
            />
            <Route path='/register/' element={<Register />} />
            <Route path='/login/' element={<Login />} />

            <Route path='/dashboard/' element={<Dashboard />}>
                <Route index element={<MyInfo />} />
                <Route path='contracts' element={<Contracts />} />
                <Route path='transactions' element={<Transactions />} />
                <Route path='wallet' element={<Wallet />} />
                <Route path='deposit' element={<Deposit />} />
                <Route path='withdraw' element={<Withdraw />} />
                <Route path='*' element={<MyInfo />} />
            </Route>

            <Route path='/admin/' element={<Admin />}>
                <Route index element={<SchemaList />} />
                <Route path='schema/:schema_id' element={<Schema />} />
                <Route path='schemas/' element={<SchemaList />} />
                <Route path='schemas/:pid' element={<SchemaList />} />
                <Route path='*' element={<SchemaList />} />
            </Route>
        </Routes>
    )
}
export default App
