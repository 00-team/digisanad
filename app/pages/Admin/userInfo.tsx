import React, { FC, useEffect, useState } from 'react'

import axios from 'axios'
import {
    AddressIcon,
    AdminIcon,
    CallenderIcon,
    CloseIcon,
    EmailIcon,
    NationalIdIcon,
    PersonIcon,
    PhoneIcon2,
    PostalCodeIcon,
    WalletIcon,
} from 'icons'

import { useAtomValue } from 'jotai'
import { TokenAtom, UserModel } from 'state'

import './style/userinfo.scss'

const UserInfo: FC = () => {
    const token = useAtomValue(TokenAtom)

    const [showPerms, setshowPerms] = useState(false)
    const [Data, setData] = useState<UserModel>()

    const userId = location.pathname.split('/')[3]

    const fetch_user = async () => {
        const response = await axios.get(`/api/admin/users/${userId}/`, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        setData(response.data)
    }

    useEffect(() => {
        fetch_user()
    }, [])

    console.log(Data)

    if (!Data)
        return (
            <section className='user-container empty'>
                <h3 className='section_title'>
                    کاربری با همچین مشخصاتی وجود ندارد!{' '}
                </h3>
            </section>
        )

    return (
        <section className='user-container'>
            <h3 className='section_title'>
                {Data.first_name} {Data.last_name}
            </h3>
            <div className='user-wrapper title'>
                <button
                    onClick={() => setshowPerms(true)}
                    className='perms-btn title'
                >
                    دسترسی ها
                </button>
                <Row
                    Icon={PersonIcon}
                    data={Data.first_name + ' ' + Data.last_name}
                    className={'nickname'}
                    holder={'نام کاربری'}
                />
                <Row
                    Icon={AdminIcon}
                    data={Data.admin ? 'هست' : 'نیست'}
                    className={'admin'}
                    holder={'ناظر'}
                />
                <Row
                    Icon={PhoneIcon2}
                    data={Data.phone}
                    className={'phone'}
                    holder={'تلفن همراه'}
                />
                <Row
                    Icon={NationalIdIcon}
                    data={Data.national_id}
                    className={'national-id'}
                    holder={'کد ملی'}
                />
                <Row
                    Icon={CallenderIcon}
                    data={Data.birth_date}
                    className={'birth-date'}
                    holder={'تاریخ تولد '}
                />
                <Row
                    Icon={EmailIcon}
                    data={Data.email}
                    className={'email'}
                    holder={'پست الکترونیکی'}
                />
                <Row
                    Icon={AddressIcon}
                    data={Data.address}
                    className={'address title_small'}
                    holder={'نشانی محل سکونت '}
                />
                <Row
                    Icon={PostalCodeIcon}
                    data={Data.postal_code}
                    className={'postal-code '}
                    holder={'کد پستی'}
                />
                <Row
                    Icon={WalletIcon}
                    data={Data.w_eth_in_acc}
                    className={'wallet-acc '}
                    holder={'موجودی حساب'}
                />
                <Row
                    Icon={WalletIcon}
                    data={Data.w_eth_in_sys}
                    className={'wallet-sys '}
                    holder={'موجودی سیستم'}
                />
            </div>
            {showPerms && (
                <div className='perms-container'>
                    <div className='perms-wrapper'>
                        <div
                            onClick={() => setshowPerms(false)}
                            className='close'
                        >
                            <CloseIcon size={25} />
                        </div>
                        <h4 className='section_title'>دسترسی ها</h4>
                        <div className='perms title_smaller'>
                            <div className='perms-have'>
                                <div className='perm'>لورم</div>
                                <div className='perm'>ایپسوم</div>
                                <div className='perm'>لورم ایپسوم</div>
                            </div>
                            <div className='perms-havent'>
                                <div className='perm'>لورم</div>
                                <div className='perm'>لورم ایپسوم</div>
                                <div className='perm'>ایپسوم</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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

export default UserInfo
