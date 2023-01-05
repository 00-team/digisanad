import React, { FC } from 'react'

import { useAtom } from 'jotai'
import { LoginStageAtom } from 'state'

import { Submit } from 'components'

import CodeEnter from './codeEnter'
import PhoneNumber from './phoneNumber'

import './style/card.scss'

const Card: FC = () => {
    const [Stages, setStages] = useAtom(LoginStageAtom)

    const mobileReg = new RegExp(/^09[0-9]{9}$/)

    const isPhoneValid = (phoneNumber: string) => {
        if (mobileReg.test(phoneNumber)) return true
        return false
    }

    const phoneSubmit = async () => {
        const phonenumber = document.querySelector(
            'input#phonenumber'
        ) as HTMLInputElement

        if (isPhoneValid(phonenumber.value)) {
            ReactAlert.success('کد تایید برای شما برای پیامک شد.')

            // let response = await axios.post('/api/auth/login/', {
            //     phone: phonenumber.value,
            // })

            // a number that indicate how much time you have left
            // console.log(response.data.timer)

            setStages('code')
            return
        }

        return ReactAlert.error('شماره تلفن خود را به درستی وارد کنید.')
    }

    const codeSubmit = () => {
        return ReactAlert.success('ورود شو بچ')
    }

    return (
        <form
            onSubmit={e => {
                e.preventDefault()
                Stages === 'code' ? codeSubmit() : phoneSubmit()
            }}
            className='card'
        >
            <div className='card-title  title_hero logo-text'>Digi Sanad</div>
            <div className='card-header title'>
                <span>ورود</span>
            </div>

            <div className='card-inps '>
                {Stages === 'phone' ? <PhoneNumber /> : <CodeEnter />}
            </div>

            {Stages === 'phone' ? (
                <Submit title='تایید' />
            ) : (
                <Submit title='ورود' />
            )}
        </form>
    )
}

export default Card
