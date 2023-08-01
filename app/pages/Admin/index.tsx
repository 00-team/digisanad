import React, { FC } from 'react'

import { SettingSvg } from 'icons'

import './style/admin.scss'

const Admin: FC = () => {
    return (
        <main className='admin-container'>
            <Sidebar />
            <aside className='admin-wrapper'></aside>
        </main>
    )
}

const Sidebar: FC = () => {
    return (
        <aside className='admin-sidebar'>
            <SidebarRow title='تنظیمات' className='setting' Icon={SettingSvg} />
        </aside>
    )
}

interface SidebarRowProps {
    title: string
    Icon: Icon
    className?: string
}

const SidebarRow: FC<SidebarRowProps> = ({ Icon, title, className }) => {
    return (
        <div className={`sidebar-row title_small ${className && className}`}>
            <div className='icon'>
                <Icon size={25} />
            </div>
            <div className='holder'>{title}</div>
            <div></div>
        </div>
    )
}

export default Admin
