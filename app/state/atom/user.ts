import axios from 'axios'

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { UserModel } from 'state'

const User = atomWithStorage<UserModel>('user', {
    user_id: 0,
    nickname: null,
    wallet: 0,
    picture: null,
    token: null,
    phone: null,
})

interface UpdateArgs {
    picture?: File | 'delete'
    nickname?: string
}
type Args = 'fetch' | ['update', UpdateArgs] | Partial<UserModel>

const UserAtom = atom(
    get => get(User),
    async (get, set, args: Args) => {
        let user = get(User)

        if (Array.isArray(args) && args[0] == 'update') {
            if (!user.token) return
            let fd = new FormData()

            if (args[1].nickname) fd.set('nickname', args[1].nickname)
            if (args[1].picture) fd.set('picture', args[1].picture)

            let response = await axios.post('/api/user/update/', fd, {
                headers: { Authorization: `user ${user.token}` },
            })
            console.log(response.data)
        } else if (args === 'fetch') {
            if (!user.token) return
            let response = await axios.get('/api/user/update/', {
                headers: { Authorization: `user ${user.token}` },
            })
            set(User, { ...user, ...response.data })
            console.log(response.data)
        } else {
            set(User, { ...user, ...args })
        }
    }
)

export { UserAtom }
