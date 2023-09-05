import { atom } from 'jotai'

import { UserPublic } from './user'

enum MessageLevel {
    NOTIFICATION = 'notification',
    INFO = 'info',
    URGENT = 'urgent',
}

type MessageModel = {
    message_id: number
    text: string
    seen: boolean
    sender: UserPublic | null | 'system'
    receiver: number
    timestamp: number
    level: MessageLevel
}

const MessagesAtom = atom<MessageModel[]>([])

export { MessagesAtom, MessageModel, MessageLevel }
