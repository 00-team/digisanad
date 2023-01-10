import React, { useState } from 'react'

import { C } from '@00-team/utils'

import { EditSvg, PersonSvg } from 'Icons'

import './style/myinfo.scss'

const MyInfo = () => {
    return (
        <section className='myinfo-container'>
            <div className='section-header section_title'>
                <span>اطلاعات من</span>
            </div>

            <div className='myinfo-wrapper'>
                <div className='rows'>
                    <Nickname />
                </div>
            </div>
        </section>
    )
}

const Nickname = () => {
    const [Editable, setEditable] = useState(false)
    return (
        <div className={`nickname row ${C(Editable)}`}>
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
                <div className='edit icon' onClick={() => setEditable(true)}>
                    <EditSvg />
                </div>
            </div>
        </div>
    )
}

export default MyInfo
