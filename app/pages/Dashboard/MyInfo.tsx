import React, {
    ChangeEvent,
    FC,
    MutableRefObject,
    useRef,
    useState,
} from 'react'

import { PersonSvg } from 'Icons'
import { Close } from 'Icons/Actions/Close'

import { useAtom } from 'jotai'
import { UserAtom } from 'state'

import { Profile } from 'Icons/Dashboard/Profile'

import { Submit } from 'components'

import './style/myinfo.scss'

import DEFAULT_IMG from 'static/avatar.png'

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
                    <Avatar value={picture} picture={User.picture} />
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

interface AvatarProps {
    picture: string | null
    value: MutableRefObject<File | 'delete' | null>
}

const Avatar: FC<AvatarProps> = ({ value, picture }) => {
    const [Image, setImage] = useState(picture || DEFAULT_IMG)

    const ChangeImg = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.currentTarget.files || !e.currentTarget.files[0]) return

        const pic = e.currentTarget.files[0]
        value.current = pic

        setImage(URL.createObjectURL(pic!))
    }

    return (
        <div className='avatar row'>
            <div className='avatar-title title row-title'>
                <div className='icon'>
                    <Profile />
                </div>
                عکس پروفایل
            </div>
            <div className='input-wrapper '>
                <div className='label-wrapper'>
                    <label
                        className='avatar-img'
                        htmlFor='avatar-img'
                        style={{
                            backgroundImage: `url(${Image})`,
                        }}
                    ></label>
                    {Image !== DEFAULT_IMG && (
                        <label
                            className='can-clear'
                            // htmlFor='avatar-img'
                            onClick={() => {
                                value.current = 'delete'
                                setImage(DEFAULT_IMG)
                            }}
                        >
                            <Close />
                        </label>
                    )}
                </div>
                <input
                    id='avatar-img'
                    type='file'
                    accept='image/x-png,image/jpeg'
                    multiple={false}
                    onChange={ChangeImg}
                />
            </div>
        </div>
    )
}

export default MyInfo
