import React, { FC, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import { get_messages } from 'api'
import { InfoSvg, NotificationSvg, WarningSvg } from 'icons'

import { useAtom, useAtomValue } from 'jotai'
import { MessageModel, MessagesAtom, TokenAtom } from 'state'

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
                <NotifMessage level='info' />
                <NotifMessage level='notification' />
                <NotifMessage level='urgent' />
            </div>
        </div>
    )
}

interface NotifMessageProps extends MessageModel {}

const NotifMessage: FC<Pick<NotifMessageProps, 'level'>> = ({ level }) => {
    type levels = {
        [k in typeof level]: string
    }

    const levels_title: levels = {
        info: 'اطلاعیه',
        notification: '',
        urgent: 'مهم',
    } as const

    return (
        <div className={`notif-container ${level}`}>
            <div className='has-seen'></div>

            {level !== 'notification' && (
                <div className={`notif-level ${level}`}>
                    {level === 'info' && <InfoSvg fill='#5199ff' size={30} />}
                    {level === 'urgent' && (
                        <WarningSvg fill='#e20338' size={30} />
                    )}
                    <p className='title_small'>{levels_title[level]}</p>
                </div>
            )}
        </div>
    )
}

export default Notifications
