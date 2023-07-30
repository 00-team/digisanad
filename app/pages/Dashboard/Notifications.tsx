import React, { FC, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import { get_messages, get_unseen_count } from 'api'
import { InfoSvg, NotificationSvg, SenderSvg, WarningSvg } from 'icons'

import { useAtom, useAtomValue } from 'jotai'
import { MessageModel, MessagesAtom, TokenAtom, UnseenCountAtom } from 'state'

import './style/notifications.scss'

const Notifications: FC = () => {
    const token = useAtomValue(TokenAtom)

    const [messages, setMessages] = useAtom(MessagesAtom)
    const [UnseenCount, setUnseenCount] = useAtom(UnseenCountAtom)

    const [Open, setOpen] = useState(true)

    useEffect(() => {
        if (!token) return

        if (messages == null) {
            get_messages(token).then(data => setMessages(data))

            return
        }
    }, [])

    useEffect(() => {
        if (!token) return

        if (UnseenCount == null) {
            get_unseen_count(token).then(data => setUnseenCount(data))

            return
        }
    }, [])

    useEffect(() => {
        if (!token) return

        if (messages == null) {
            get_messages(token).then(data => setMessages(data))

            return
        }
    }, [])

    // useEffect(() => {
    //     console.log(messages)
    // }, [messages])

    return (
        <div className='notifications-container'>
            <button
                className='notification-icon'
                onClick={() => setOpen(!Open)}
            >
                {UnseenCount && UnseenCount.count >= 1 && (
                    <span className='unseen-count description'>
                        {UnseenCount?.count}
                    </span>
                )}
                <NotificationSvg size={innerWidth >= 1024 ? 40 : 30} />
            </button>
            <div className={`notifications-wrapper ${C(Open)}`}>
                {messages?.map((message, index) => {
                    return <NotifMessage {...message} key={index} />
                })}
            </div>
        </div>
    )
}

interface NotifMessageProps extends MessageModel {}

const NotifMessage: FC<NotifMessageProps> = ({ seen, sender, text, level }) => {
    type levels = {
        [k in typeof level]: string
    }

    const levels_title: levels = {
        info: 'اطلاعیه',
        notification: '',
        urgent: 'مهم',
    } as const

    const getSender = (): string => {
        if (sender === 'system') return 'سیستم'
        else if (sender === null) return 'نامعلوم'
        else return sender.first_name + ' ' + sender.last_name
    }

    return (
        <div className={`notif-container ${level}`}>
            {seen && <div className='has-seen'></div>}

            {level !== 'notification' && (
                <div className={`notif-level ${level}`}>
                    {level === 'info' && <InfoSvg fill='#5199ff' size={30} />}
                    {level === 'urgent' && (
                        <WarningSvg fill='#e20338' size={30} />
                    )}
                    <p className='title_small'>{levels_title[level]}</p>
                </div>
            )}

            <div className='sender title_smaller'>
                <div className='holder'>
                    <SenderSvg size={20} />
                    فرستنده:
                </div>
                <p className='data '>{getSender()}</p>
            </div>

            <p className='text title_smaller'>{text}</p>
        </div>
    )
}

export default Notifications
