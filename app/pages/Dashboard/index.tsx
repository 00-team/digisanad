import React, { FC, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import { PersonSvg } from 'Icons'
import { SendSvg } from 'Icons/Actions/Send'
import { Link, Navigate } from 'react-router-dom'

import { useAtom, useAtomValue } from 'jotai'
import { UserAtom } from 'state'

import { ContractSvg } from 'Icons/Dashboard/Contract'
import { GlobeSvg } from 'Icons/Dashboard/Globe'
import { TransactionSvg } from 'Icons/Dashboard/Transaction'
import { WalletSvg } from 'Icons/Dashboard/Wallet'

import { LogoutButton } from 'components/common/LogoutButton'

import ChargeWallet from './ChargeWallet'
import Contracts from './Contracts'
import MyInfo from './MyInfo'

import './style/dashboard.scss'

const OPTIONS_BASE_DELAY = 1.75
const ADDED_DELAY = 0.1

interface OptionsProps extends React.HTMLAttributes<HTMLAnchorElement> {
    title: string
    Icon: FC<{}>
    Component: FC
    style: React.CSSProperties
    active: boolean
    id: string
}

const SIDEBAR_OPTIONS: Partial<OptionsProps>[] = [
    { title: 'اطلاعات من', Icon: PersonSvg, Component: MyInfo, id: 'info' },
    {
        title: 'قرارداد های من',
        Icon: ContractSvg,
        Component: Contracts,
        id: 'contracts',
    },
    {
        title: 'تراکنش های من',
        Icon: TransactionSvg,
        Component: MyInfo,
        id: 'transactins',
    },
    {
        title: 'افزایش موجودی',
        Icon: WalletSvg,
        Component: ChargeWallet,
        id: 'chargewallet',
    },
]

interface DashboardChildProps {
    SectionActive: number
    SectionsetActive: (index: number) => void
}

const Dashboard: FC = () => {
    const [SectionActive, SectionsetActive] = useState(3)
    const [User, setUser] = useAtom(UserAtom)

    useEffect(() => {
        if (User.user_id) {
            setUser('fetch')
        }
    }, [])

    if (User.user_id === 0) {
        return <Navigate to='/login' />
    }

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
    const User = useAtomValue(UserAtom)

    return (
        <div className='sidebar'>
            <div className='avatar'>
                <div className='title_small name-avatar'>
                    <span>
                        {User.first_name + ' ' + User.last_name || '---'}
                    </span>
                </div>
            </div>
            <div className='sidebar-wrapper title_small'>
                {SIDEBAR_OPTIONS.map(({ title, Icon, id }, index) => {
                    return (
                        <SidebarColumn
                            key={index}
                            title={title}
                            Icon={Icon}
                            active={SectionActive === index}
                            id={id}
                            style={{
                                animationDelay: `${
                                    OPTIONS_BASE_DELAY + ADDED_DELAY * index
                                }s`,
                            }}
                            onClick={() => SectionsetActive(index)}
                        />
                    )
                })}
                <GotoSiteColumn
                    style={{
                        animationDelay: `${
                            OPTIONS_BASE_DELAY +
                            ADDED_DELAY * (SIDEBAR_OPTIONS.length + 1)
                        }s`,
                    }}
                />
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

const GotoSiteColumn: FC<Partial<OptionsProps>> = ({ style }) => {
    return (
        <Link to={'/'} className='column-wrapper goto ' style={style}>
            <div className='column'>
                <div className='holder-icon icon'>
                    {' '}
                    <GlobeSvg />{' '}
                </div>
                <div className='holder-text '>رفتن به سایت</div>
            </div>
            <div className='send-icon icon'>
                <SendSvg />
            </div>
        </Link>
    )
}
const SidebarColumn: FC<Partial<OptionsProps>> = ({
    title,
    Icon,
    style,
    active,
    id,
    ...attr
}) => {
    return (
        <a
            href={innerWidth <= 1024 ? `#${id}` : ''}
            className={`column-wrapper ${C(active)}`}
            style={style}
            {...attr}
        >
            <div className='column'>
                <div className='holder-icon icon'>{Icon && <Icon />}</div>
                <div className='holder-text '>{title}</div>
            </div>
            <div className='send-icon icon'>
                <SendSvg />
            </div>
        </a>
    )
}

export default Dashboard
