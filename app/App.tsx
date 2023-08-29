import React, { FC } from 'react'

import { useAlert } from '@00-team/react-alert'
import loadable from '@loadable/component'
import axios from 'axios'
import { Route, Routes } from 'react-router-dom'

import {
    Contract,
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

const ERROR_CODE_MESSAGE: { [k: number]: string } = {
    40002: 'کد وارد شده صحیح نمی باشد',
    40003: 'تغیری ایجاد نشد.',
    40005: 'نیاز به ورود مجدد',
    40007: 'نرخ بیش از حد. ۱۰ دقیقه دیگر تلاش کنید.',
    40010: 'حساب کاربری با این شماره یافت نشد. ثبت نام کنید',
    40011: 'حساب کاربری با این شماره وجود دارد. وارد شوید.',
    50001: 'خطای سرور.',
}

const App: FC = () => {
    global.ReactAlert = useAlert()
    global.HandleError = error => {
        if (!axios.isAxiosError(error)) {
            ReactAlert.error('خطای نامشخص!')
            return
        }
        if (!error.response || !error.response.data) {
            ReactAlert.error(error.message)
            return
        }

        let data = error.response.data
        let code: number = data.code
        if (code) {
            if (code in ERROR_CODE_MESSAGE) {
                ReactAlert.error(ERROR_CODE_MESSAGE[code])
            } else {
                ReactAlert.error(data.message)
            }
            return
        }

        let detail: string | any[] | undefined = data.detail
        if (detail) {
            if (Array.isArray(detail)) {
                ReactAlert.error(detail[0].msg)
            } else {
                ReactAlert.error(detail)
            }
            return
        }

        ReactAlert.error('خطا در هنگام وصل شدن به سرور')
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
                <Route path='contracts/:pid' element={<Contracts />} />
                <Route path='contract/:contract_id' element={<Contract />} />

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
