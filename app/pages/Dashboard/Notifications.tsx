import React, { FC } from 'react'

import { NotificationSvg } from 'icons'

import './style/notifications.scss'

const Notifications: FC = () => {
    return (
        <div className='notifications-container'>
            <button className='notification-icon'>
                <NotificationSvg size={innerWidth >= 1024 ? 40 : 20} />
            </button>
        </div>
    )
}

export default Notifications
