import { atom } from 'jotai'

type LoginType = {
    phone: string
    stage: 'phone' | 'code'
    resend: boolean
    time: number
}

const DEFUALT_LOGIN: LoginType = {
    phone: '',
    stage: 'phone',
    resend: false,
    time: 3,
}

const Login = atom<LoginType>(DEFUALT_LOGIN)

const LoginAtom = atom(
    get => get(Login),
    async (get, set, update: 'clear' | Partial<LoginType>) => {
        if (update === 'clear') {
            set(Login, DEFUALT_LOGIN)
        } else {
            set(Login, { ...get(Login), ...update })
        }
    }
)

export { LoginAtom, LoginType }
