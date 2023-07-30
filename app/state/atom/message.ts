import { atom } from 'jotai'
import { MessageModel } from 'state'

const MessagesAtom = atom<MessageModel[] | null>(null)

export { MessagesAtom }
