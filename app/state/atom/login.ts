import { atom } from 'jotai'
import { LoginType } from 'state/models/Login'

const Login = atom<LoginType>({
    stage: 'phone',
    resend: false,
    time: 3,
})

const LoginAtom = atom(
    get => get(Login),
    async (get, set, update: Partial<LoginType>) => {
        set(Login, { ...get(Login), ...update })
    }
)

export { LoginAtom }
