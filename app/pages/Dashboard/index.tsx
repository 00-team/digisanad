import React, { FC, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import { user_get_me } from 'api'
import {
    ArrowDownSvg,
    ArrowUpSvg,
    ContractSvg,
    GlobeSvg,
    PersonSvg,
    SendSvg,
    TransactionSvg,
    WalletSvg,
} from 'icons'
import { Link, useNavigate } from 'react-router-dom'

import { useAtom, useAtomValue } from 'jotai'
import { TokenAtom, UserAtom } from 'state'

import { LogoutButton } from 'components/common/LogoutButton'

import Contracts from './Contracts'
import { Deposit } from './Deposit'
import MyInfo from './MyInfo'
import Wallet from './Wallet'

import './style/dashboard.scss'

const OPTIONS_BASE_DELAY = 1
const ADDED_DELAY = 0.1

interface OptionsProps extends React.HTMLAttributes<HTMLAnchorElement> {
    title: string
    Icon: Icon
    Component: FC
    style?: React.CSSProperties
    active?: boolean
    id: string
}

const SIDEBAR_OPTIONS: OptionsProps[] = [
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
        title: 'کیف پول',
        Icon: WalletSvg,
        Component: Wallet,
        id: 'wallet',
    },
    {
        title: 'افزایش موجودی',
        Icon: ArrowUpSvg,
        Component: Deposit,
        id: 'deposit',
    },
    {
        title: 'برداشت موجودی',
        Icon: ArrowDownSvg,
        Component: MyInfo,
        id: 'withdraw',
    },
]

interface DashboardChildProps {
    SectionActive: number
    SectionsetActive: (index: number) => void
}

const Dashboard: FC = () => {
    const [SectionActive, SectionsetActive] = useState(0)
    const [_, setUser] = useAtom(UserAtom)
    const [token, setToken] = useAtom(TokenAtom)

    const navigate = useNavigate()

    useEffect(() => {
        if (!token) return navigate('/login/')

        user_get_me(token).then(data => {
            if (data === null) {
                setToken('')
                navigate('/login/')
            } else {
                setUser(data)
            }
        })
    }, [])

    return (
        <section className='dashboard-container'>
            <Sidebar
                SectionActive={SectionActive}
                SectionsetActive={SectionsetActive}
            />
            <div className='dashboard-wrapper'>
                {(() => {
                    let so = SIDEBAR_OPTIONS[SectionActive]
                    if (!so) return <></>
                    return <so.Component />
                })()}
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
                {SIDEBAR_OPTIONS.map(({ title, Icon, id }, index) => (
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
                ))}
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
        <Link to='/' className='column-wrapper goto ' style={style}>
            <div className='column'>
                <div className='holder-icon icon'>
                    {' '}
                    <GlobeSvg size={25} />{' '}
                </div>
                <div className='holder-text '>رفتن به سایت</div>
            </div>
            <div className='send-icon icon'>
                <SendSvg size={25} />
            </div>
        </Link>
    )
}
const SidebarColumn: FC<Omit<OptionsProps, 'Component'>> = ({
    title,
    Icon,
    style,
    active,
    id,
    ...attr
}) => {
    return (
        <a
            // href={innerWidth <= 1024 ? `#${id}` : ''}
            className={`column-wrapper ${C(active)}`}
            style={style}
            {...attr}
        >
            <div className='column'>
                <div className='holder-icon icon'>
                    <Icon size={23} />
                </div>
                <div className='holder-text '>{title}</div>
            </div>
            <div className='send-icon icon'>
                <SendSvg size={25} />
            </div>
        </a>
    )
}

export default Dashboard
