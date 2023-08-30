import axios from 'axios'

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { UserModel } from 'state'

const DEFUALT_USER: UserModel = {
    address: '',
    birth_date: [],
    email: '',
    first_name: '',
    last_name: '',
    national_id: '',
    phone: null,
    postal_code: '',
    user_id: null,
    admin: '0',
}

const User = atom<UserModel>(DEFUALT_USER)

const TokenAtom = atomWithStorage<string>('user_token', '')

type Args = 'clear' | 'fetch' | Partial<UserModel>

const UserAtom = atom(
    get => get(User),
    async (get, set, args: Args) => {
        let user = get(User)

        if (args === 'fetch') {
            try {
                // if (!user.token) return

                // let response = await axios.get('/api/user/get/', {
                //     headers: { Authorization: `Bearer ${user.token}` },
                // })
                let response = await axios.get('/api/user/get/')

                set(User, { ...user, ...response.data })
            } catch (error) {
                HandleError(error)
            }
        } else if (args === 'clear') {
            set(User, DEFUALT_USER)
        } else {
            set(User, { ...user, ...args })
        }
    }
)

const AP = {
    MASTER: 1n << 0n,

    V_USER: 1n << 1n, // VISION | VIEW
    A_USER: 1n << 2n, // APPEND | ADD
    C_USER: 1n << 3n, // CHANGE | CHANGE
    D_USER: 1n << 4n, // DELETE | DELETE

    V_TRANSACTION: 1n << 5n,
    A_TRANSACTION: 1n << 6n,
    C_TRANSACTION: 1n << 7n,
    D_TRANSACTION: 1n << 8n,

    V_WALLET: 1n << 9n,
    A_WALLET: 1n << 10n,
    C_WALLET: 1n << 11n,
    D_WALLET: 1n << 12n,

    V_GENERAL: 1n << 13n,
    C_GENERAL: 1n << 14n,

    V_MESSAGE: 1n << 15n,
    A_MESSAGE: 1n << 16n,
    C_MESSAGE: 1n << 17n,
    D_MESSAGE: 1n << 19n,

    V_SCHEMA: 1n << 20n,
    A_SCHEMA: 1n << 21n,
    C_SCHEMA: 1n << 22n,
    D_SCHEMA: 1n << 23n,
} as const

type AdminPermsModel = {
    perms: bigint
    check: (perms: bigint) => boolean
}

const AdminPerms = atom<AdminPermsModel>(get => {
    let perms = 0n
    try {
        perms = BigInt(get(User).admin)
    } catch {}

    return {
        perms,
        check(perms) {
            if (this.perms & AP.MASTER) {
                return true
            }

            return !!(this.perms & perms)
        },
    }
})

export { UserAtom, TokenAtom, AdminPerms, AP }
