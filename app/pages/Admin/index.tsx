import React, { FC, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import { user_get_me } from 'api'
import axios from 'axios'
import {
    CloseIcon,
    ContractIcon,
    DashboardIcon,
    MenuIcon,
    NewContractIcon,
    SettingIcon,
} from 'icons'
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'

import { useAtom, useAtomValue } from 'jotai'
import { AdminPerms, TokenAtom, UserAtom } from 'state'

import './style/admin.scss'

const Admin: FC = () => {
    const perms = useAtomValue(AdminPerms)
    const [user, setUser] = useAtom(UserAtom)
    const [token, setToken] = useAtom(TokenAtom)
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) return
        if (user.user_id) {
            if (!perms.perms) {
                navigate('/')
            }
            return
        }

        user_get_me(token).then(data => {
            if (data === null) {
                setToken('')
                navigate('/login/?next=' + location.pathname)
            } else {
                setUser(data)
            }
        })
    }, [token, perms, user])

    if (!token) return <Navigate to={'/login/?next=' + location.pathname} />

    // if (!perms.perms) return <Navigate to='/' />

    return (
        <main className='admin-container'>
            <Sidebar />
            <Outlet />
        </main>
    )
}

const Sidebar: FC = () => {
    const [close, setClose] = useState(true)

    const navigate = useNavigate()
    const token = useAtomValue(TokenAtom)

    const add_schema = async () => {
        const response = await axios.post(
            '/api/admin/schemas/',
            {
                title: 'قرارداد جدید',
                data: {
                    pages: [{ content: '# قرارداد جدید' }],
                    fields: {},
                },
            },
            { headers: { Authorization: 'Bearer ' + token } }
        )
        navigate('/admin/schema/' + response.data.id)
    }

    return (
        <aside className={'admin-sidebar' + C(close, 'close')}>
            <div className={`buttons-wrapper ${C(!close)}`}>
                <button className={`close`} onClick={() => setClose(true)}>
                    <CloseIcon size={24} />
                </button>
                <button className={`open `} onClick={() => setClose(false)}>
                    <MenuIcon size='24' />
                </button>
            </div>
            <div className='sidebar-wrapper'>
                <SidebarRow
                    title='تنظیمات'
                    className='setting'
                    Icon={SettingIcon}
                    href='settings/'
                />
                <SidebarRow
                    title='قالب قرارداد ها'
                    className='contract'
                    href='schemas/'
                    Icon={ContractIcon}
                />
                <SidebarRow
                    title='قرارداد جدید'
                    className='dashboard'
                    href=''
                    onclick={add_schema}
                    Icon={NewContractIcon}
                />
                <SidebarRow
                    title='داشبورد'
                    className='dashboard'
                    href='/dashboard/'
                    Icon={DashboardIcon}
                />
            </div>
        </aside>
    )
}

type SidebarRowProps = {
    title: string
    Icon: Icon
    href: string
    className?: string
    onclick?: () => void
}

const SidebarRow: FC<SidebarRowProps> = ({
    Icon,
    title,
    href,
    className = '',
    onclick,
}) => {
    return (
        <>
            {onclick ? (
                <button
                    onClick={onclick}
                    className={`sidebar-row title_small ${className}`}
                >
                    <div className='icon'>
                        <Icon size={25} />
                    </div>
                    <div className='holder'>{title}</div>
                    <div></div>
                </button>
            ) : (
                <Link
                    to={href}
                    className={`sidebar-row title_small ${className}`}
                >
                    <div className='icon'>
                        <Icon size={25} />
                    </div>
                    <div className='holder'>{title}</div>
                    <div></div>
                </Link>
            )}
        </>
    )
}

export default Admin
