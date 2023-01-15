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
    token: null,
    user_id: 0,
    wallet: 0,
}

const User = atomWithStorage<UserModel>('user', DEFUALT_USER)

type Args = 'clear' | 'fetch' | Partial<UserModel>

const UserAtom = atom(
    get => get(User),
    async (get, set, args: Args) => {
        let user = get(User)

        if (args === 'fetch') {
            try {
                if (!user.token) return

                let response = await axios.get('/api/user/get/', {
                    headers: { Authorization: `user ${user.token}` },
                })

                set(User, { ...user, ...response.data, token: user.token })
            } catch (error) {
                console.log(error)
            }
        } else if (args === 'clear') {
            set(User, DEFUALT_USER)
        } else {
            set(User, { ...user, ...args })
        }
    }
)

export { UserAtom }
