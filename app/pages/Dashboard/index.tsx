import React, { FC, useEffect } from 'react'

import { CountAnim } from '@00-team/utils'

import { EditSvg } from 'Icons'
import { SendSvg } from 'Icons/Actions/Send'
import { Navigate } from 'react-router-dom'

import { useAtom, useAtomValue } from 'jotai'
import { UserAtom } from 'state'

import { ContractSvg } from 'Icons/Dashboard/Contract'
import { GlobeSvg } from 'Icons/Dashboard/Globe'
import { TransactionSvg } from 'Icons/Dashboard/Transaction'
import walletSvg from 'static/Dashboard/wallet.svg'

import { Submit } from 'components'

import { LogoutButton } from './LogoutButton'

import './style/dashboard.scss'

import DEFAULT_IMG from 'static/avatar.png'

const Dashboard: FC = () => {
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
            <Profile />
            <Options />
            <Wallet />
            <div className='div4 default'></div>
            <div className='div5 default'></div>
            <div className='div6 default'></div>
        </section>
    )
}

export default Dashboard

const Profile: FC = () => {
    const User = useAtomValue(UserAtom)

    return (
        <div className='profile default'>
            <img
                className='profile-img'
                src={User.picture || DEFAULT_IMG}
            ></img>
            <div className='profile-content title'>
                <div className='holder'>{User.nickname || '---'}</div>
                <div className='update-profile icon'>
                    <EditSvg />
                </div>
            </div>
        </div>
    )
}

const Options = () => {
    return (
        <div className='options default title'>
            <div className='column-wrapper'>
                <div className='column'>
                    <div className='holder-icon icon'>
                        <GlobeSvg />
                    </div>
                    <div className='holder-text '>رفتن به سایت </div>
                </div>
                <div className='send-icon icon'>
                    <SendSvg />
                </div>
            </div>
            <div className='column-wrapper'>
                <div className='column'>
                    <div className='holder-icon icon'>
                        <ContractSvg />
                    </div>
                    <div className='holder-text '> قرار داد های من</div>
                </div>
                <div className='send-icon icon'>
                    <SendSvg />
                </div>
            </div>
            <div className='column-wrapper'>
                <div className='column'>
                    <div className='holder-icon icon'>
                        <TransactionSvg />
                    </div>
                    <div className='holder-text '> تراکنش های من </div>
                </div>
                <div className='send-icon icon'>
                    <SendSvg />
                </div>
            </div>
            <LogoutButton />
        </div>
    )
}

const Wallet: FC = () => {
    const User = useAtomValue(UserAtom)

    return (
        <div className='wallet default'>
            <div className='wallet-wrapper'>
                <div className='wallet-content'>
                    <div className='title money-balance'>
                        <div className='holder'>موجودی شما:</div>{' '}
                        <div className='data'>
                            <CountAnim end={User.wallet} />
                        </div>
                    </div>
                    <div className='title_smaller charge'>
                        تنها در چند ثانیه موجودی خود را افزایش دهید.
                    </div>
                    <div className='charge-btn'></div>
                </div>
                <object
                    className='svg-container'
                    data={walletSvg}
                    type=''
                ></object>
            </div>
            <Submit title='افزایش موجودی' className='title_smaller' />
        </div>
    )
}
