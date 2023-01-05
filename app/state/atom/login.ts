import { atom } from 'jotai'
import {
    CanResendType,
    LoginStageType,
    ResendRemainingType,
} from 'state/models/Login'

const LoginStage = atom<LoginStageType>('phone')
const CanResend = atom<CanResendType>(false)
const ResendRemaining = atom<ResendRemainingType>(3)

const LoginStageAtom = atom(
    get => get(LoginStage),
    async (_, set, stage: LoginStageType) => {
        set(LoginStage, stage)
    }
)

const CanResendAtom = atom(
    get => get(CanResend),
    async (_, set, update: CanResendType) => {
        set(CanResend, update)
    }
)

const ResendRemainingAtom = atom(
    get => get(ResendRemaining),
    async (_, set, time: ResendRemainingType) => {
        set(ResendRemaining, time)
    }
)

export { LoginStageAtom, CanResendAtom, ResendRemainingAtom }
