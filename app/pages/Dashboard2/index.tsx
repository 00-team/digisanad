import React, { FC, useState } from 'react'

import { C } from '@00-team/utils'

import { PersonSvg } from 'Icons'
import { SendSvg } from 'Icons/Actions/Send'

import { ContractSvg } from 'Icons/Dashboard/Contract'
import { GlobeSvg } from 'Icons/Dashboard/Globe'
import { TransactionSvg } from 'Icons/Dashboard/Transaction'
import { LogoutButton } from 'pages/Dashboard/LogoutButton'

import Contracts from './Contracts'
import MyInfo from './MyInfo'

import './style/dashboard.scss'

import DEFAULT_IMG from 'static/avatar.png'

const OPTIONS_BASE_DELAY = 1.75
const ADDED_DELAY = 0.1

interface OptionsProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    Icon: FC<{}>
    Component: FC
    style: React.CSSProperties
    active: boolean
}

const SIDEBAR_OPTIONS: Partial<OptionsProps>[] = [
    { title: 'اطلاعات من', Icon: PersonSvg, Component: MyInfo },
    { title: 'قرارداد های من', Icon: ContractSvg, Component: Contracts },
    { title: 'تراکنش های من', Icon: TransactionSvg, Component: MyInfo },
    { title: 'رفتن به سایت', Icon: GlobeSvg, Component: MyInfo },
]

interface DashboardChildProps {
    SectionActive: number
    SectionsetActive: (index: number) => void
}

const Dashboard: FC = () => {
    const [SectionActive, SectionsetActive] = useState(0)

    return (
        <section className='dashboard-container'>
            <Sidebar
                SectionActive={SectionActive}
                SectionsetActive={SectionsetActive}
            />
            <div className='dashboard-wrapper'>
                {SIDEBAR_OPTIONS.map(({ Component }, index) => {
                    if (!Component) return null

                    if (index === SectionActive)
                        return <Component key={index} />
                    else return null
                })}
            </div>
        </section>
    )
}

const Sidebar: FC<DashboardChildProps> = ({
    SectionActive,
    SectionsetActive,
}) => {
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
                            active={SectionActive === index}
                            style={{
                                animationDelay: `${
                                    OPTIONS_BASE_DELAY + ADDED_DELAY * index
                                }s`,
                            }}
                            onClick={() => SectionsetActive(index)}
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

const SidebarColumn: FC<Partial<OptionsProps>> = ({
    title,
    Icon,
    style,
    active,
    ...attr
}) => {
    return (
        <div className={`column-wrapper ${C(active)}`} style={style} {...attr}>
            <div className='column'>
                <div className='holder-icon icon'>{Icon && <Icon />}</div>
                <div className='holder-text '>{title}</div>
            </div>
            <div className='send-icon icon'>
                <SendSvg />
            </div>
        </div>
    )
}

export default Dashboard
