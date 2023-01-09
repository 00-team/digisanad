import React, { FC, useState } from 'react'

import { C } from '@00-team/utils'

import { PersonSvg } from 'Icons'
import { SendSvg } from 'Icons/Actions/Send'

import { ContractSvg } from 'Icons/Dashboard/Contract'
import { GlobeSvg } from 'Icons/Dashboard/Globe'
import { TransactionSvg } from 'Icons/Dashboard/Transaction'
import { LogoutButton } from 'pages/Dashboard/LogoutButton'

import './style/dashboard.scss'

import DEFAULT_IMG from 'static/avatar.png'

const OPTIONS_BASE_DELAY = 1.75
const ADDED_DELAY = 0.1

interface OptionsProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    Icon: FC<{}>
    style?: React.CSSProperties
    active?: boolean
}

const SIDEBAR_OPTIONS: OptionsProps[] = [
    { title: 'اطلاعات من', Icon: PersonSvg },
    { title: 'قرارداد های من', Icon: ContractSvg },
    { title: 'تراکنش های من', Icon: TransactionSvg },
    { title: 'رفتن به سایت', Icon: GlobeSvg },
]

const Dashboard = () => {
    return (
        <section className='dashboard-container'>
            <Sidebar />
            <div className='dashboard-wrapper'></div>
        </section>
    )
}

const Sidebar = () => {
    const [Active, setActive] = useState(0)
    setActive
    return (
        <div className='sidebar'>
            <div className='avatar'>
                <img className='profile-avatar' src={DEFAULT_IMG} />
                <div className='title_small name-avatar'>
                    <span>سید صدرا تقوی</span>
                </div>
            </div>
            <div className='sidebar-wrapper title_small'>
                {SIDEBAR_OPTIONS.map(({ title, Icon }, index) => {
                    return (
                        <SidebarColumn
                            key={index}
                            title={title}
                            Icon={Icon}
                            active={Active === index}
                            style={{
                                animationDelay: `${
                                    OPTIONS_BASE_DELAY + ADDED_DELAY * index
                                }s`,
                            }}
                            onClick={() => setActive(index)}
                        />
                    )
                })}
                <LogoutButton
                    style={{
                        animationDelay: `${
                            OPTIONS_BASE_DELAY +
                            ADDED_DELAY * (SIDEBAR_OPTIONS.length + 2)
                        }s`,
                    }}
                />
            </div>
        </div>
    )
}

const SidebarColumn: FC<OptionsProps> = ({
    title,
    Icon,
    style,
    active,
    ...attr
}) => {
    return (
        <div className={`column-wrapper ${C(active)}`} style={style} {...attr}>
            <div className='column'>
                <div className='holder-icon icon'>
                    <Icon />
                </div>
                <div className='holder-text '>{title}</div>
            </div>
            <div className='send-icon icon'>
                <SendSvg />
            </div>
        </div>
    )
}

export default Dashboard
