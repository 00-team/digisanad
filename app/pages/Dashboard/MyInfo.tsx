import React, { FC } from 'react'

import {
    AddressIcon,
    CallenderIcon,
    EmailIcon,
    NationalIdIcon,
    PersonIcon,
    PhoneIcon2,
} from 'icons'
import { PostalCodeIcon } from 'icons'

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
                        Icon={PersonIcon}
                        data={User.first_name + ' ' + User.last_name}
                        className={'nickname'}
                        holder={'نام کاربری'}
                    />
                    <Row
                        Icon={PhoneIcon2}
                        data={User.phone}
                        className={'phone'}
                        holder={'تلفن همراه'}
                    />
                    <Row
                        Icon={NationalIdIcon}
                        data={User.national_id}
                        className={'national-id'}
                        holder={'کد ملی'}
                    />
                    <Row
                        Icon={CallenderIcon}
                        data={User.birth_date}
                        className={'birth-date'}
                        holder={'تاریخ تولد '}
                    />
                    <Row
                        Icon={EmailIcon}
                        data={User.email}
                        className={'email'}
                        holder={'پست الکترونیکی'}
                    />
                    <Row
                        Icon={AddressIcon}
                        data={User.address}
                        className={'address title_small'}
                        holder={'نشانی محل سکونت '}
                    />
                    <Row
                        Icon={PostalCodeIcon}
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
    Icon: Icon
    holder: string
    data: any
    className?: string
}

const Row: FC<RowProps> = ({ data, holder, Icon, className }) => {
    return (
        <div className={`row title ${className && className}`}>
            <div className='nickname-title title  row-title'>
                <div className='icon'>
                    <Icon size={25} />
                </div>
                {holder}
            </div>
            <div className='row-data '>{data}</div>
        </div>
    )
}

export default MyInfo
