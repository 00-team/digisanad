import React, { FC } from 'react'

import { PersonSvg } from 'Icons'

import { useAtomValue } from 'jotai'
import { UserAtom } from 'state'

import './style/myinfo.scss'

const MyInfo: FC = () => {
    const User = useAtomValue(UserAtom)

    return (
        <section className='myinfo-container'>
            <div className='section-header section_title'>
                <span>اطلاعات من</span>
            </div>

            <div className='myinfo-wrapper'>
                <div className='rows'>
                    <div className='nickname row '>
                        <div className='nickname-title title row-title'>
                            <div className='icon'>
                                <PersonSvg />
                            </div>
                            نام کاربری
                        </div>
                        <div className='row-data title'>
                            {User.first_name} {User.last_name}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyInfo
