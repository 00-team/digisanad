type Message = {
    message_id: number
    seen: boolean
    sender: User | null | 'system'
    receiver: number
    timestamp: number
    level: 'notification' | 'info' | 'urgent'
}

type User = {
    user_id: number

    first_name: string
    last_name: string
}

export { Message as MessageModel }
