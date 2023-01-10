import React, { useRef, useState } from 'react'

import { PersonSvg } from 'Icons'
import { Close } from 'Icons/Actions/Close'

import { Profile } from 'Icons/Dashboard/Profile'

import { Submit } from 'components'

import './style/myinfo.scss'

import DEFAULT_IMG from 'static/avatar.png'

const MyInfo = () => {
    return (
        <section className='myinfo-container'>
            <div className='section-header section_title'>
                <span>اطلاعات من</span>
            </div>

            <div className='myinfo-wrapper'>
                <div className='rows'>
                    <Nickname />
                    <Avatar />
                </div>
                <div className='submit-wrapper'>
                    <Submit className='title_smaller' title='تایید' />
                </div>
            </div>
        </section>
    )
}

const Nickname = () => {
    return (
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
                    defaultValue={'سید صدرا تقوی'}
                />
            </div>
        </div>
    )
}
const Avatar = () => {
    const [Image, setImage] = useState(DEFAULT_IMG)
    const picture = useRef<HTMLInputElement>(null)

    const ChangeImg = () => {
        if (!picture.current || !picture.current.files) return

        const pic = picture.current.files[0]

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
                        <label className='can-clear' htmlFor='avatar-img'>
                            <Close />
                        </label>
                    )}
                </div>
                <input
                    ref={picture}
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
