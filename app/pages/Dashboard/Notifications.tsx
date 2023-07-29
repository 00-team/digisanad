import React, { FC, useState } from 'react'

import { NotificationSvg } from 'icons'

import './style/notifications.scss'

const Notifications: FC = () => {
    const [Unseen, setUnseen] = useState(true)
    return (
        <div className='notifications-container'>
            <button
                className='notification-icon'
                onClick={() => setUnseen(!Unseen)}
            >
                {Unseen && <span className='unseen-count description'>1</span>}
                <NotificationSvg size={innerWidth >= 1024 ? 40 : 30} />
            </button>
        </div>
    )
}

export default Notifications
