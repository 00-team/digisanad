import React, { FC, useState } from 'react'

import { C } from '@00-team/utils'

import { CloudIcon, ContractIcon, MenuIcon, SettingIcon } from 'icons'
import { Link, Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { AdminPerms } from 'state'

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

    return (
        <aside className={'admin-sidebar' + C(close, 'close')}>
            <button onClick={() => setClose(s => !s)}>
                <MenuIcon size='24' />
            </button>
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
                    title='داشبورد'
                    className='dashboard'
                    href='/dashboard/'
                    Icon={CloudIcon}
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
}

const SidebarRow: FC<SidebarRowProps> = ({
    Icon,
    title,
    href,
    className = '',
}) => {
    return (
        <Link to={href} className={`sidebar-row title_small ${className}`}>
            <div className='icon'>
                <Icon size={25} />
            </div>
            <div className='holder'>{title}</div>
            <div></div>
        </Link>
    )
}

export default Admin
