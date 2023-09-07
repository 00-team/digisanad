import React, { FC, useEffect, useState } from 'react'

import axios from 'axios'
import {
    AddressIcon,
    AdminIcon,
    CallenderIcon,
    CheckIcon,
    CloseIcon,
    EmailIcon,
    NationalIdIcon,
    PersonIcon,
    PhoneIcon2,
    PostalCodeIcon,
    WalletIcon,
} from 'icons'
import { useNavigate, useParams } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { AP, PermList, TokenAtom, UserModel } from 'state'

import './style/userinfo.scss'

const UserInfo: FC = () => {
    const token = useAtomValue(TokenAtom)

    const [activePerms, setActivePerms] = useState([''])
    const [showPerms, setShowPerms] = useState(false)
    const [data, setData] = useState<UserModel>()

    const navigate = useNavigate()
    const { user_id } = useParams()

    const fetch_data = async () => {
        const response = await axios.get(`/api/admin/users/${user_id}/`, {
            headers: { Authorization: 'Bearer ' + token },
        })
        setData(response.data)
    }

    useEffect(() => {
        if (!data) return

        const perms = BigInt(data.admin || 0)

        Object.entries(PermList).map(([key, value]) => {
            // @ts-ignore
            if (perms & AP[key]) {
                setActivePerms([...activePerms, value.display])
            }
        })
    }, [data])

    useEffect(() => {
        if (!user_id) {
            navigate('/admin/users/')
            return
        }

        fetch_data()
    }, [user_id])

    if (!data)
        return (
            <section className='user-container empty'>
                <h3 className='section_title'>
                    کاربری با همچین مشخصاتی وجود ندارد!
                </h3>
            </section>
        )

    return (
        <section className='user-container'>
            <h3 className='section_title'>
                {data.first_name} {data.last_name}
            </h3>
            <div className='user-wrapper title'>
                <button
                    onClick={() => setShowPerms(true)}
                    className='perms-btn title'
                >
                    دسترسی ها
                </button>
                <Row
                    Icon={PersonIcon}
                    data={data.first_name + ' ' + data.last_name}
                    className={'nickname'}
                    holder={'نام کاربری'}
                />
                <Row
                    Icon={AdminIcon}
                    data={BigInt(data.admin || 0) ? 'هست' : 'نیست'}
                    className={'admin'}
                    holder={'ناظر'}
                />
                <Row
                    Icon={PhoneIcon2}
                    data={data.phone}
                    className={'phone'}
                    holder={'تلفن همراه'}
                />
                <Row
                    Icon={NationalIdIcon}
                    data={data.national_id}
                    className={'national-id'}
                    holder={'کد ملی'}
                />
                <Row
                    Icon={CallenderIcon}
                    data={data.birth_date}
                    className={'birth-date'}
                    holder={'تاریخ تولد '}
                />
                <Row
                    Icon={EmailIcon}
                    data={data.email}
                    className={'email'}
                    holder={'پست الکترونیکی'}
                />
                <Row
                    Icon={AddressIcon}
                    data={data.address}
                    className={'address title_small'}
                    holder={'نشانی محل سکونت '}
                />
                <Row
                    Icon={PostalCodeIcon}
                    data={data.postal_code}
                    className={'postal-code '}
                    holder={'کد پستی'}
                />
                <Row
                    Icon={WalletIcon}
                    data={data.w_eth_in_acc}
                    className={'wallet-acc '}
                    holder={'موجودی حساب'}
                />
                <Row
                    Icon={WalletIcon}
                    data={data.w_eth_in_sys}
                    className={'wallet-sys '}
                    holder={'موجودی سیستم'}
                />
            </div>
            {showPerms && (
                <div className='perms-container'>
                    <div className='perms-wrapper'>
                        <div
                            onClick={() => setShowPerms(false)}
                            className='close'
                        >
                            <CloseIcon size={25} />
                        </div>
                        <h4 className='section_title'>دسترسی ها</h4>
                        <div className='perms title_smaller'>
                            <div className='perms-have'>
                                <h5 className='title'>
                                    <CheckIcon
                                        style={{
                                            color: 'rgb(0, 129, 73)',
                                        }}
                                    />
                                    داشته ها
                                </h5>

                                {activePerms.map((perm, index) => {
                                    if (!perm) return
                                    return (
                                        <button
                                            onClick={() =>
                                                setActivePerms(perms => {
                                                    return perms.filter(
                                                        activeperm =>
                                                            activeperm !== perm
                                                    )
                                                })
                                            }
                                            className='perm'
                                            key={index}
                                        >
                                            {perm}
                                        </button>
                                    )
                                })}
                            </div>
                            <div className='perms-havent'>
                                <h5 className='title'>
                                    <CloseIcon
                                        style={{ color: 'var(--alert-error)' }}
                                    />
                                    نداشته ها
                                </h5>

                                {Object.entries(PermList).map(
                                    ([key, value], idx1) => {
                                        const perms = BigInt(data.admin || 0)

                                        if (activePerms.includes(value.display))
                                            return

                                        // @ts-ignore
                                        if (perms & AP[key]) {
                                            return
                                        } else {
                                            return (
                                                <button
                                                    className='perm'
                                                    key={idx1}
                                                    onClick={() =>
                                                        setActivePerms([
                                                            ...activePerms,
                                                            value.display,
                                                        ])
                                                    }
                                                >
                                                    {value.display}
                                                </button>
                                            )
                                        }
                                    }
                                )}
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
