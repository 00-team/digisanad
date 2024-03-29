import axios from 'axios'

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

type UserModel = {
    user_id: number
    phone: string
    first_name: string
    last_name: string
    birth_date: string
    national_id: string
    postal_code: string
    address: string
    email: string
    admin: string | null
    w_last_update: number
    w_eth_in_acc: number
    w_eth_in_sys: number
    w_eth_addr: string
}

const DEFUALT_USER: UserModel = {
    address: '',
    birth_date: '',
    email: '',
    first_name: '',
    last_name: '',
    national_id: '',
    phone: '',
    postal_code: '',
    user_id: 0,
    admin: null,
    w_eth_in_sys: 0,
    w_eth_in_acc: 0,
    w_last_update: 0,
    w_eth_addr: '',
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

type PL = {
    [K in keyof typeof AP]: {
        display: string
    }
}
export const PermList: PL = {
    MASTER: { display: 'تمام دسترسی ها' },

    V_USER: { display: 'نمایش کابران' },
    A_USER: { display: 'اضافه کردن کابران' },
    C_USER: { display: 'تغییر کابران' },
    D_USER: { display: 'حذف کابران' },

    V_TRANSACTION: { display: 'نمایش تراکنش' },
    A_TRANSACTION: { display: 'اضافه کردن تراکنش' },
    C_TRANSACTION: { display: 'تغییر تراکنش' },
    D_TRANSACTION: { display: 'حذف تراکنش' },

    V_WALLET: { display: 'نمایش کیف پول' },
    A_WALLET: { display: 'اضافه کردن کیف پول' },
    C_WALLET: { display: 'تغییر کیف پول' },
    D_WALLET: { display: 'حذف کیف پول' },

    V_GENERAL: { display: 'نمایش تنظیمات' },
    C_GENERAL: { display: 'تغییر تنظیمات' },

    V_MESSAGE: { display: 'نمایش پیام' },
    A_MESSAGE: { display: 'اضافه کردن پیام' },
    C_MESSAGE: { display: 'تغییر پیام' },
    D_MESSAGE: { display: 'حذف پیام' },

    V_SCHEMA: { display: 'نمایش قالب' },
    A_SCHEMA: { display: 'اضافه کردن قالب' },
    C_SCHEMA: { display: 'تغییر قالب' },
    D_SCHEMA: { display: 'حذف قالب' },
}

type AdminPermsModel = {
    perms: bigint
    check: (perms: bigint) => boolean
}

const AdminPerms = atom<AdminPermsModel>(get => {
    let perms = 0n
    let user = get(User)

    if (user.admin) {
        try {
            perms = BigInt(user.admin)
        } catch {}
    }

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

type UserPublic = {
    user_id: number
    phone: string
    first_name: string
    last_name: string
}

type PriceModel = {
    next_update: number
    usd_irr: number
    eth_usd: number
    gwei_usd: number
}

const PriceAtom = atom<PriceModel>({
    next_update: 0,
    usd_irr: 0,
    eth_usd: 0,
    gwei_usd: 0,
})

export {
    PriceAtom,
    UserAtom,
    TokenAtom,
    AdminPerms,
    AdminPermsModel,
    AP,
    UserModel,
    UserPublic,
    PriceModel,
}
