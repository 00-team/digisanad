import React from 'react'

import { EditSvg } from 'Icons'
import { SendSvg } from 'Icons/Actions/Send'

import { LogoutButton } from './LogoutButton'

import './style/dashboard.scss'

const DEFAULT_IMG = require('../../static/avatar.png')

const Dashboard = () => {
    return (
        <section className='dashboard-container'>
            <div className='profile'>
                <img className='profile-img' src={DEFAULT_IMG}></img>
                <div className='profile-content title'>
                    <div className='holder'>سید صدرا تقوی</div>
                    <div className='update-profile icon'>
                        <EditSvg />
                    </div>
                </div>
            </div>
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
            <div className='div3 default'></div>
            <div className='div4 default'></div>
            <div className='div5 default'></div>
            <div className='div6 default'></div>
        </section>
    )
}

export default Dashboard

const DefaultSvg = () => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        stroke-width='0'
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
