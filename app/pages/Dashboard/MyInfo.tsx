import React, { FC, useRef, useState } from 'react'

import { PersonSvg } from 'Icons'

import { useAtom } from 'jotai'
import { UserAtom } from 'state'

import { Submit } from 'components'

import './style/myinfo.scss'

const MyInfo: FC = () => {
    const [User, setUser] = useAtom(UserAtom)
    const picture = useRef<File | 'delete' | null>(null)
    const [nickname, setNickname] = useState(User.nickname || '')

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
                        <div className='input-wrapper '>
                            <input
                                type='text'
                                className='title_smaller'
                                defaultValue={User.nickname || ''}
                                onChange={e =>
                                    setNickname(e.currentTarget.value)
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className='submit-wrapper'>
                    <Submit
                        className='title_smaller'
                        title='تایید'
                        onClick={() =>
                            setUser([
                                'update',
                                {
                                    picture: picture.current,
                                    nickname:
                                        User.nickname !== nickname
                                            ? nickname
                                            : null,
                                },
                            ])
                        }
                    />
                </div>
            </div>
        </section>
    )
}

export default MyInfo
