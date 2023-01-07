import React from 'react'

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
            <div className='options default'>
                <div className='column-wrapper'></div>
            </div>
            <div className='div3 default'></div>
            <div className='div4 default'></div>
            <div className='div5 default'></div>
            <div className='div6 default'></div>
        </section>
    )
}

export default Dashboard

const EditSvg = () => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 512 512'
        height='1em'
        width='1em'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M103 464H48v-55L358.14 98.09l55.77 55.78L103 464zm322.72-322L370 86.28l31.66-30.66C406.55 50.7 414.05 48 421 48a25.91 25.91 0 0118.42 7.62l17 17A25.87 25.87 0 01464 91c0 7-2.71 14.45-7.62 19.36zm-7.52-70.83z'></path>
    </svg>
)
