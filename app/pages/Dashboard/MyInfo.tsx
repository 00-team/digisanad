import React, { FC } from 'react'

import {
    AddressSvg,
    CallenderSvg,
    EmailSvg,
    NationalIdSvg,
    PersonSvg,
    PhoneSvg2,
} from 'icons'
import { PostalCodeSvg } from 'icons'

import { useAtomValue } from 'jotai'
import { UserAtom } from 'state'

import './style/myinfo.scss'

const MyInfo: FC = () => {
    const User = useAtomValue(UserAtom)

    return (
        <section id='info' className='myinfo-container'>
            <div className='section-header section_title'>اطلاعات من</div>

            <div className='myinfo-wrapper'>
                <div className='rows'>
                    <Row
                        Svg={PersonSvg}
                        data={User.first_name + ' ' + User.last_name}
                        className={'nickname'}
                        holder={'نام کاربری'}
                    />
                    <Row
                        Svg={PhoneSvg2}
                        data={User.phone}
                        className={'phone'}
                        holder={'تلفن همراه'}
                    />
                    <Row
                        Svg={NationalIdSvg}
                        data={User.national_id}
                        className={'national-id'}
                        holder={'کد ملی'}
                    />
                    <Row
                        Svg={CallenderSvg}
                        data={User.birth_date}
                        className={'birth-date'}
                        holder={'تاریخ تولد '}
                    />
                    <Row
                        Svg={EmailSvg}
                        data={User.email}
                        className={'email'}
                        holder={'پست الکترونیکی'}
                    />
                    <Row
                        Svg={AddressSvg}
                        data={User.address}
                        className={'address title_small'}
                        holder={'نشانی محل سکونت '}
                    />
                    <Row
                        Svg={PostalCodeSvg}
                        data={User.postal_code}
                        className={'postal-code '}
                        holder={'کد پستی'}
                    />
                </div>
            </div>
        </section>
    )
}

interface RowProps {
    Svg: Icon
    holder: string
    data: any
    className?: string
}

const Row: FC<RowProps> = ({ data, holder, Svg, className }) => {
    return (
        <div className={`row title ${className && className}`}>
            <div className='nickname-title title  row-title'>
                <div className='icon'>
                    <Svg size={25} />
                </div>
                {holder}
            </div>
            <div className='row-data '>{data}</div>
        </div>
    )
}

export default MyInfo
