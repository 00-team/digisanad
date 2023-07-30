import React, { FC, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import { get_messages } from 'api'
import { NotificationSvg } from 'icons'

import { useAtom, useAtomValue } from 'jotai'
import { MessagesAtom, TokenAtom } from 'state'

import './style/notifications.scss'

const Notifications: FC = () => {
    const token = useAtomValue(TokenAtom)

    const [messages, setMessages] = useAtom(MessagesAtom)

    const [Open, setOpen] = useState(true)

    useEffect(() => {
        if (!token) return

        if (messages == null) {
            get_messages(token).then(data => setMessages(data))

            return
        }
    }, [])

    useEffect(() => {
        console.log(messages)
    }, [messages])

    return (
        <div className='notifications-container'>
            <button
                className='notification-icon'
                onClick={() => setOpen(!Open)}
            >
                <span className='unseen-count description'>1</span>
                <NotificationSvg size={innerWidth >= 1024 ? 40 : 30} />
            </button>
            <div className={`notifications-wrapper ${C(Open)}`}>
                <NotifMessage />
                <NotifMessage />
                <NotifMessage />
            </div>
        </div>
    )
}

interface NotifMessageProps {}

const NotifMessage: FC<NotifMessageProps> = () => {
    return (
        <div className='notif-container'>
            <div className='has-seen'></div>
        </div>
    )
}

export default Notifications
