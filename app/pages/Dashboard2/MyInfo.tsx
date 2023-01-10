import React, { useState } from 'react'

import { C } from '@00-team/utils'

import { EditSvg, PersonSvg } from 'Icons'

import { Submit } from 'components'

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
                <div className='submit-wrapper'>
                    <Submit className='title_smaller' title='تایید' />
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
                    style={{
                        cursor: Editable ? 'text' : 'default',
                        opacity: Editable ? '1' : '0.6  ',
                        pointerEvents: Editable ? 'all' : 'none',
                    }}
                />
                <div
                    className='edit icon'
                    onClick={() => setEditable(true)}
                    style={{ opacity: Editable ? '0' : '1' }}
                >
                    <EditSvg />
                </div>
            </div>
        </div>
    )
}

export default MyInfo
