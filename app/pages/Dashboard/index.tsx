import React from 'react'

import { CountAnim } from '@00-team/utils'

import { EditSvg } from 'Icons'
import { SendSvg } from 'Icons/Actions/Send'

import { Submit } from 'components'

import { LogoutButton } from './LogoutButton'

import './style/dashboard.scss'

const walletSvg = require('../../static/Dashboard/wallet.svg')

const DEFAULT_IMG = require('../../static/avatar.png')

const Dashboard = () => {
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

const Profile = () => {
    return (
        <div className='profile default'>
            <img className='profile-img' src={DEFAULT_IMG}></img>
            <div className='profile-content title'>
                <div className='holder'>سید صدرا تقوی</div>
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
                        <DefaultSvg />
                    </div>
                    <div className='holder-text '>لورم ایپسوم</div>
                </div>
                <div className='send-icon icon'>
                    <SendSvg />
                </div>
            </div>
            <div className='column-wrapper'>
                <div className='column'>
                    <div className='holder-icon icon'>
                        <DefaultSvg />
                    </div>
                    <div className='holder-text '>لورم ایپسوم</div>
                </div>
                <div className='send-icon icon'>
                    <SendSvg />
                </div>
            </div>
            <div className='column-wrapper'>
                <div className='column'>
                    <div className='holder-icon icon'>
                        <DefaultSvg />
                    </div>
                    <div className='holder-text '>لورم ایپسوم</div>
                </div>
                <div className='send-icon icon'>
                    <SendSvg />
                </div>
            </div>
            <LogoutButton />
        </div>
    )
}

const Wallet = () => {
    return (
        <div className='wallet default'>
            <div className='wallet-wrapper'>
                <div className='wallet-content'>
                    <div className='title money-balance'>
                        <div className='holder'>موجودی شما:</div>{' '}
                        <div className='data'>
                            <CountAnim end={530500} />
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

const DefaultSvg = () => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 24 24'
        height='1em'
        width='1em'
        xmlns='http://www.w3.org/2000/svg'
    >
        <g>
            <path fill='none' d='M0 0h24v24H0z'></path>
            <circle cx='12' cy='12' r='10'></circle>
        </g>
    </svg>
)
