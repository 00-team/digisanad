type Message = {
    message_id: number
    text: string
    seen: boolean
    sender: User | null | 'system'
    receiver: number
    timestamp: number
    level: 'notification' | 'info' | 'urgent'
}

type unseenCount = {
    count: number
}

type User = {
    user_id: number

    first_name: string
    last_name: string
}

export {
    Message as MessageModel,
    User as SenderUser,
    unseenCount as unseenCountModel,
}
