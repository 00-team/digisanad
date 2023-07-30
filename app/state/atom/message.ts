import { atom } from 'jotai'
import { MessageModel } from 'state'

const MessageAtom = atom<MessageModel | null>(null)

export { MessageAtom }
