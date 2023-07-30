import React, { FC, useState } from 'react'

import { C } from '@00-team/utils'

import { NotificationSvg } from 'icons'

import './style/notifications.scss'

const Notifications: FC = () => {
    const [Open, setOpen] = useState(false)
    return (
        <div className='notifications-container'>
            <button
                className='notification-icon'
                onClick={() => setOpen(!Open)}
            >
                <span className='unseen-count description'>1</span>
                <NotificationSvg size={innerWidth >= 1024 ? 40 : 30} />
            </button>
            <div className={`notifications-wrapper ${C(Open)}`}></div>
        </div>
    )
}

export default Notifications
