import React, { FC } from 'react'

import { PersonSvg } from 'Icons'
import { EmailSvg } from 'Icons/Models/Email'
import { PhoneSvg2 } from 'Icons/Models/Phone2'

import { useAtomValue } from 'jotai'
import { UserAtom } from 'state'

import { AddressSvg } from 'Icons/Dashboard/Address'
import { CallenderSvg } from 'Icons/Dashboard/Callender'
import { NationalIdSvg } from 'Icons/Dashboard/NationalId'
import PostalCodeSvg from 'Icons/Dashboard/PostalCode'

import './style/myinfo.scss'

const MyInfo: FC = () => {
    const User = useAtomValue(UserAtom)

    return (
        <section className='myinfo-container'>
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
    Svg: FC
    holder: string
    data: any
    className?: string
}

const Row: FC<RowProps> = ({ data, holder, Svg, className }) => {
    return (
        <div className={`row title ${className && className}`}>
            <div className='nickname-title title  row-title'>
                <div className='icon'>
                    <Svg />
                </div>
                {holder}
            </div>
            <div className='row-data '>{data}</div>
        </div>
    )
}

export default MyInfo
