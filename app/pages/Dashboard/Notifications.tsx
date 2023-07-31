import React, { FC, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import { get_messages, get_unseen_count } from 'api'
import axios from 'axios'
import {
    CallenderSvg,
    InfoSvg,
    NotificationSvg,
    SenderSvg,
    WarningSvg,
} from 'icons'

import { useAtom, useAtomValue } from 'jotai'
import { MessageModel, MessagesAtom, TokenAtom, UnseenCountAtom } from 'state'

import './style/notifications.scss'

const Notifications: FC = () => {
    const token = useAtomValue(TokenAtom)
    const [messages, setMessages] = useAtom(MessagesAtom)
    const [UnseenCount, setUnseenCount] = useAtom(UnseenCountAtom)

    const [Open, setOpen] = useState(false)

    const seenMsg = async () => {
        try {
            await messages?.forEach(({ message_id }) => {
                const response = axios.patch(
                    `/api/messages/${message_id}/`,
                    {
                        seened: true,
                    },
                    {
                        headers: {
                            Authorization: 'Bearer ' + token,
                        },
                    }
                )

                console.log(response)
            })
        } catch (err) {
            console.log(err)
        }
    }

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

    useEffect(() => {
        Open && seenMsg()
    }, [Open])

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

const NotifMessage: FC<NotifMessageProps> = ({
    seen,
    sender,
    text,
    level,
    timestamp,
}) => {
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

    const getTime = (timestamp: number) => {
        let offset = Math.abs(new Date().getTimezoneOffset()) * 60

        return (timestamp + offset) * 1000
    }

    return (
        <div className={`notif-container ${level}`}>
            {!seen && <div className='has-seen'></div>}

            {level !== 'notification' && (
                <div className={`notif-level ${level}`}>
                    {level === 'info' && <InfoSvg fill='#5199ff' size={30} />}
                    {level === 'urgent' && (
                        <WarningSvg fill='#e20338' size={30} />
                    )}
                    <p className='title_small'>{levels_title[level]}</p>
                </div>
            )}

            <div className='row sender title_smaller'>
                <div className='holder'>
                    <SenderSvg size={20} />
                    فرستنده:
                </div>
                <p className='data '>{getSender()}</p>
            </div>
            <div className='row sent-time title_smaller'>
                <div className='holder'>
                    <CallenderSvg size={20} />
                    زمان ارسال:
                </div>
                <p className='data '>
                    {new Date(getTime(timestamp)).toLocaleDateString('fa-IR')}
                </p>
            </div>

            <p className='text title_smaller'>{text}</p>
        </div>
    )
}

export default Notifications
