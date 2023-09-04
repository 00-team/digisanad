import React, { FC, ReactNode, useEffect } from 'react'

import { C } from '@00-team/utils'

import { user_get_me } from 'api'
import axios from 'axios'
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ContractIcon,
    GlobeIcon,
    NewContractIcon,
    ProfileIcon,
    SendIcon,
    ToolIcon,
    TransactionIcon,
    WalletIcon,
} from 'icons'
import { Link, Navigate, Outlet, useMatch, useNavigate } from 'react-router-dom'

import { useAtom, useAtomValue } from 'jotai'
import { TokenAtom, UserAtom } from 'state'

import { LogoutButton } from 'components/common/LogoutButton'

import { Notifications } from './Notifications'

import './style/dashboard.scss'

export * from './Contract'
export * from './Contracts'
export * from './Deposit'
export * from './MyInfo'
export * from './Transactions'
export * from './Wallet'
export * from './Withdraw'

const OPTIONS_BASE_DELAY = 1
const ADDED_DELAY = 0.1

type SidebarLinkModel = {
    onclick?: () => void
    link: string
    title: string
    icon: ReactNode
}

const Dashboard: FC = () => {
    const [user, setUser] = useAtom(UserAtom)
    const [token, setToken] = useAtom(TokenAtom)
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) return
        if (user.user_id) return

        user_get_me(token).then(data => {
            if (data === null) {
                setToken('')
                navigate('/login/?next=' + location.pathname)
            } else {
                setUser(data)
            }
        })
    }, [token])

    if (!token) return <Navigate to={'/login/?next=' + location.pathname} />

    return (
        <main className='dashboard-container'>
            <Sidebar />
            <aside className='dashboard-wrapper'>
                <Outlet />
                <Notifications />
            </aside>
        </main>
    )
}

const Sidebar: FC = ({}) => {
    const user = useAtomValue(UserAtom)
    const token = useAtomValue(TokenAtom)
    const navigate = useNavigate()

    const add_contract = async () => {
        const response = await axios.post(
            '/api/contracts/',
            {
                title: 'قرار داد جدید',
                data: {},
            },
            { headers: { Authorization: 'Bearer ' + token } }
        )
        navigate('/dashboard/contract/' + response.data.id)
    }

    const SIDEBAR_LINKS: SidebarLinkModel[] = [
        {
            link: '',
            title: 'اطلاعات من',
            // icon: <PersonIcon />,
            icon: <ProfileIcon />,
        },
        {
            link: 'contracts',
            title: 'قرارداد های من',
            icon: <ContractIcon />,
        },
        {
            onclick: add_contract,
            link: 'contract',
            title: 'قرارداد جدید',
            icon: <NewContractIcon />,
        },
        {
            link: 'transactions',
            title: 'تراکنش های من',
            icon: <TransactionIcon />,
        },
        {
            link: 'wallet',
            title: 'کیف پول',
            icon: <WalletIcon />,
        },
        {
            link: 'deposit',
            title: 'افزایش موجودی',
            icon: <ArrowUpIcon />,
        },
        {
            link: 'withdraw',
            title: 'برداشت موجودی',
            icon: <ArrowDownIcon />,
        },
        {
            link: '/',
            title: 'رفتن به سایت',
            icon: <GlobeIcon />,
        },
    ]

    return (
        <aside className='sidebar'>
            <div className='avatar'>
                <div className='title_small name-avatar'>
                    <span>
                        {user.first_name + ' ' + user.last_name || '---'}
                    </span>
                </div>
            </div>
            <div className='sidebar-wrapper title_small'>
                {SIDEBAR_LINKS.map((args, i) => (
                    <SidebarLink {...args} key={i} idx={i} />
                ))}
                {BigInt(user.admin) ? (
                    <SidebarLink
                        link='/admin/'
                        title='پنل مدریت'
                        icon={<ToolIcon />}
                        idx={SIDEBAR_LINKS.length}
                    />
                ) : null}
                <LogoutButton
                    style={{
                        animationDelay: `${
                            OPTIONS_BASE_DELAY +
                            ADDED_DELAY * (SIDEBAR_LINKS.length + 1)
                        }s`,
                    }}
                />
            </div>
        </aside>
    )
}

type SidebarLinkProps = SidebarLinkModel & {
    idx?: number
}

const SidebarLink: FC<SidebarLinkProps> = ({
    title,
    icon,
    link,
    onclick,
    idx = 0,
}) => {
    let active = false
    if (!['/', '/admin/'].includes(link))
        active = !!useMatch('/dashboard/' + link)

    return (
        <>
            {onclick ? (
                <button
                    onClick={onclick}
                    className={`column-wrapper ${C(active)}`}
                    style={{ '--idx': idx }}
                >
                    <div className='column'>
                        <div className='holder-icon icon'>{icon}</div>
                        <div className='holder-text '>{title}</div>
                    </div>
                    <div className='send-icon icon'>
                        <SendIcon size={25} />
                    </div>
                </button>
            ) : (
                <Link
                    to={link}
                    className={`column-wrapper ${C(active)}`}
                    style={{ '--idx': idx }}
                >
                    <div className='column'>
                        <div className='holder-icon icon'>{icon}</div>
                        <div className='holder-text '>{title}</div>
                    </div>
                    <div className='send-icon icon'>
                        <SendIcon size={25} />
                    </div>
                </Link>
            )}
        </>
    )
}

export default Dashboard
