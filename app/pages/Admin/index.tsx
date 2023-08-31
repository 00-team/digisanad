import React, { FC, useState } from 'react'

import { C } from '@00-team/utils'

import axios from 'axios'
import {
    CloseIcon,
    ContractIcon,
    MenuIcon,
    NewContractIcon,
    SettingIcon,
} from 'icons'
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { AdminPerms, TokenAtom } from 'state'

import './style/admin.scss'

const Admin: FC = () => {
    const perms = useAtomValue(AdminPerms)

    Navigate
    // if (!perms.perms) return <Navigate to='/' />
    if (!perms.perms) return <></>

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
            '/api/admins/schemas/',
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
