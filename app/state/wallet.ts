import { atom } from 'jotai'
import { WalletModel, unseenCountModel } from 'state'

const WalletAtom = atom<WalletModel | null>(null)
const UnseenCountAtom = atom<unseenCountModel | null>(null)

export { WalletAtom, UnseenCountAtom }
