import React, { FC, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import axios from 'axios'
import {
    CallenderIcon,
    InfoIcon,
    NotificationIcon,
    SenderIcon,
    WarningIcon,
} from 'icons'

import { useAtom, useAtomValue } from 'jotai'
import { LEVEL_TITLE, MessageModel, MessagesAtom, TokenAtom } from 'state'

import './style/notifications.scss'

const Notifications: FC = () => {
    const token = useAtomValue(TokenAtom)
    const [messages, setMessages] = useAtom(MessagesAtom)
    const [unseen, setUnseen] = useState(0)

    const [Open, setOpen] = useState(false)

    const seenMsg = async () => {
        if (!messages) return

        try {
            for (let mdx = 0; mdx < messages.length; mdx++) {
                let msg = messages[mdx]!
                if (msg.seen) continue

                await axios.patch(`/api/messages/${msg.message_id}/`, {
                    headers: { Authorization: 'Bearer ' + token },
                })
            }
        } catch (error) {
            HandleError(error)
        }
    }

    const get_messages = async () => {
        try {
            const response = await axios.get('/api/messages/', {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })

            setMessages(response.data)
            return
        } catch (error) {
            HandleError(error)
        }

        setMessages([])
    }
    const get_unseen_count = async () => {
        try {
            const response = await axios.get('/api/messages/unseen_count/', {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })

            setUnseen(response.data.count)
            return
        } catch (error) {
            HandleError(error)
        }

        setUnseen(0)
    }

    useEffect(() => {
        if (!token) return

        get_messages()
        get_unseen_count()
    }, [token])

    useEffect(() => {
        Open && seenMsg()
    }, [Open])

    return (
        <div className='notifications-container'>
            <button
                className='notification-icon'
                onClick={() => setOpen(!Open)}
            >
                {unseen >= 1 && (
                    <span className='unseen-count description'>{unseen}</span>
                )}
                <NotificationIcon size={innerWidth >= 1024 ? 40 : 30} />
            </button>
            <div className={`notifications-wrapper ${C(Open)}`}>
                {messages.length >= 1 ? (
                    messages.map((message, index) => {
                        return <NotifMessage {...message} key={index} />
                    })
                ) : (
                    <h4 className='title_small empty'>
                        پیامی برای نمایش وجود ندارد!
                    </h4>
                )}
            </div>
        </div>
    )
}

const NotifMessage: FC<MessageModel> = props => {
    const { seen, sender, text, level, timestamp } = props

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
                    {level === 'info' && <InfoIcon fill='#5199ff' size={30} />}
                    {level === 'urgent' && (
                        <WarningIcon fill='#e20338' size={30} />
                    )}
                    <p className='title_small'>{LEVEL_TITLE[level]}</p>
                </div>
            )}

            <div className='row sender title_smaller'>
                <div className='holder'>
                    <SenderIcon size={20} />
                    فرستنده:
                </div>
                <p className='data '>{getSender()}</p>
            </div>
            <div className='row sent-time title_smaller'>
                <div className='holder'>
                    <CallenderIcon size={20} />
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

export { Notifications }
