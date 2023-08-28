import React, { FC, useEffect, ReactNode } from 'react'

import { C } from '@00-team/utils'

import { user_get_me } from 'api'
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ContractIcon,
    GlobeIcon, // PersonIcon,
    ProfileIcon,
    SendIcon,
    ToolIcon,
    TransactionIcon,
    WalletIcon,
} from 'icons'
import { Link, Outlet, useMatch, useNavigate } from 'react-router-dom'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { TokenAtom, UserAtom } from 'state'

import { LogoutButton } from 'components/common/LogoutButton'

// import Contracts from './Contracts'
// import { Deposit } from './Deposit'
// import MyInfo from './MyInfo'
import Notifications from './Notifications'

// import Transactions from './Transactions'
// import Wallet from './Wallet'
// import Withdraw from './Withdraw'
import './style/dashboard.scss'

const OPTIONS_BASE_DELAY = 1
const ADDED_DELAY = 0.1

// interface OptionsProps extends React.HTMLAttributes<HTMLAnchorElement> {
//     title: string
//     Icon: Icon
//     Component: FC
//     style?: React.CSSProperties
//     active?: boolean
//     id: string
// }

type SidebarLinkModel = {
    link: string
    title: string
    icon: ReactNode
}

const SIDEBAR_LINKS: SidebarLinkModel[] = [
    {
        link: 'info',
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
        link: 'transactins',
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

// const SIDEBAR_OPTIONS: OptionsProps[] = [
//     { title: 'اطلاعات من', Icon: PersonIcon, Component: MyInfo, id: 'info' },
//     {
//         title: 'قرارداد های من',
//         Icon: ContractIcon,
//         Component: Contracts,
//         id: 'contracts',
//     },
//     {
//         title: 'تراکنش های من',
//         Icon: TransactionIcon,
//         Component: Transactions,
//         id: 'transactins',
//     },
//     {
//         title: 'کیف پول',
//         Icon: WalletIcon,
//         Component: Wallet,
//         id: 'wallet',
//     },
//     {
//         title: 'افزایش موجودی',
//         Icon: ArrowUpIcon,
//         Component: Deposit,
//         id: 'deposit',
//     },
//     {
//         title: 'برداشت موجودی',
//         Icon: ArrowDownIcon,
//         Component: Withdraw,
//         id: 'withdraw',
//     },
// ]

const Dashboard: FC = () => {
    const setUser = useSetAtom(UserAtom)
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
        <main className='dashboard-container'>
            <Sidebar />
            <aside className='dashboard-wrapper'>
                <Outlet />
                {/*(() => {
                    let so = SIDEBAR_OPTIONS[SectionActive]
                    if (!so) return <></>
                    return <so.Component />
                })()*/}
                <Notifications />
            </aside>
        </main>
    )
}

const Sidebar: FC = ({}) => {
    const user = useAtomValue(UserAtom)

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
                    <SidebarLink
                        {...args}
                        key={i}
                        // style={{
                        //     animationDelay: `${
                        //         OPTIONS_BASE_DELAY + ADDED_DELAY * index
                        //     }s`,
                        // }}
                        // onClick={() => SectionsetActive(index)}
                    />
                ))}
                {user.admin && (
                    <SidebarLink
                        link='/admin/'
                        title='پنل مدریت'
                        icon={<ToolIcon />}
                        // style={{
                        //     animationDelay: `${
                        //         OPTIONS_BASE_DELAY +
                        //         ADDED_DELAY * SIDEBAR_OPTIONS.length
                        //     }s`,
                        // }}
                        // onClick={() => SectionsetActive(1)}
                    />
                )}
                {/*<GotoSiteColumn
                    style={{
                        animationDelay: `${
                            OPTIONS_BASE_DELAY +
                            ADDED_DELAY * (SIDEBAR_OPTIONS.length + 1)
                        }s`,
                    }}
                />*/}
                <LogoutButton
                    style={{
                        animationDelay: `${
                            OPTIONS_BASE_DELAY + ADDED_DELAY * (2 + 2)
                        }s`,
                    }}
                />
            </div>
        </aside>
    )
}

// const GotoSiteColumn: FC<Partial<OptionsProps>> = ({ style }) => {
//     return (
//         <Link to='/' className='column-wrapper goto ' style={style}>
//             <div className='column'>
//                 <div className='holder-icon icon'>
//                     {' '}
//                     <GlobeIcon size={25} />{' '}
//                 </div>
//                 <div className='holder-text '>رفتن به سایت</div>
//             </div>
//             <div className='send-icon icon'>
//                 <SendIcon size={25} />
//             </div>
//         </Link>
//     )
// }
// GotoSiteColumn

const SidebarLink: FC<SidebarLinkModel> = ({ title, icon, link }) => {
    const active = !!useMatch(link)

    return (
        <Link
            to={link}
            className={`column-wrapper ${C(active)}`}
            // style={style}
            // {...attr}
        >
            <div className='column'>
                <div className='holder-icon icon'>{icon}</div>
                <div className='holder-text '>{title}</div>
            </div>
            <div className='send-icon icon'>
                <SendIcon size={25} />
            </div>
        </Link>
    )
}

export default Dashboard
