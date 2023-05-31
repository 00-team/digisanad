import { atom } from 'jotai'
import { WalletModel } from 'state'

const WalletAtom = atom<WalletModel | null>(null)
export { WalletAtom }
