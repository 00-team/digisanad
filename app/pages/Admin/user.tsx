import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

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
import {
    AdminPerms,
    AP,
    PermList,
    TokenAtom,
    UserModel,
    AdminPermsModel,
} from 'state'

import './style/userinfo.scss'

const UserInfo: FC = () => {
    const token = useAtomValue(TokenAtom)
    const self_perms = useAtomValue(AdminPerms)

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

    const save_data = async (perms: string) => {
        const url = `/api/admin/users/${user_id}/perms/?perms=${perms}`
        try {
            const response = await axios.patch(
                url,
                {},
                {
                    headers: { Authorization: 'Bearer ' + token },
                }
            )

            if (!response.data.ok) {
                ReactAlert.error('خطا در هنگام ذخیره اطلاعات')
            } else {
                ReactAlert.success('اطلاعات جدید با موفقیت ذخیره شد')
                fetch_data()
            }
        } catch (error) {
            HandleError(error)
        }
    }

    const update = (save?: boolean) => {
        setData(s => {
            if (!s) return

            if (save) {
                save_data(s.admin || '0')
            }

            return { ...s }
        })
    }

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

            <Info
                user={data}
                setShowPerms={setShowPerms}
                update={update}
                self_perms={self_perms}
            />
            {showPerms && (
                <Perms
                    setShowPerms={setShowPerms}
                    user={data}
                    self_perms={self_perms}
                    update={update}
                />
            )}
        </section>
    )
}

type BaseProps = {
    setShowPerms: Dispatch<SetStateAction<boolean>>
    user: UserModel
    update: (save?: boolean) => void
    self_perms: AdminPermsModel
}

type PermlistState = {
    have: [bigint, string][]
    have_not: [bigint, string][]
    perms: bigint
}

const Perms: FC<BaseProps> = ({ user, setShowPerms, update }) => {
    const [permlist, setPermlist] = useState<PermlistState>({
        have: [],
        have_not: [],
        perms: 0n,
    })

    useEffect(() => {
        let have: [bigint, string][] = []
        let have_not: [bigint, string][] = []

        const perms = BigInt(user.admin || 0)

        Object.entries(PermList).forEach(([key, value]) => {
            let P = AP[key as keyof typeof AP]

            if (perms & P) {
                have.push([P, value.display])
            } else {
                have_not.push([P, value.display])
            }
        })

        setPermlist({ have, have_not, perms })
    }, [user])

    return (
        <div className='perms-container'>
            <div className='perms-wrapper'>
                <div onClick={() => setShowPerms(false)} className='close'>
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

                        {permlist.have.map(([perm, display], i) => (
                            <button
                                disabled={!!(perm & AP.MASTER)}
                                onClick={() => {
                                    user.admin = (
                                        permlist.perms & ~perm
                                    ).toString()
                                    update()
                                }}
                                className='perm'
                                key={i}
                            >
                                {display}
                            </button>
                        ))}
                    </div>
                    <div className='perms-havent'>
                        <h5 className='title'>
                            <CloseIcon
                                style={{ color: 'var(--alert-error)' }}
                            />
                            نداشته ها
                        </h5>
                        {permlist.have_not.map(([perm, display], i) => (
                            <button
                                disabled={!!(perm & AP.MASTER)}
                                onClick={() => {
                                    user.admin = (
                                        permlist.perms | perm
                                    ).toString()
                                    update()
                                }}
                                className='perm'
                                key={i}
                            >
                                {display}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    className='save-btn title_smaller'
                    onClick={() => update(true)}
                >
                    ذخیره
                </button>
            </div>
        </div>
    )
}

const Info: FC<BaseProps> = ({ setShowPerms, user, self_perms }) => (
    <div className='user-wrapper title'>
        <button
            disabled={
                !!(BigInt(user.admin || 0) & AP.MASTER) ||
                !self_perms.check(AP.MASTER)
            }
            onClick={() => setShowPerms(true)}
            className='perms-btn title'
        >
            دسترسی ها
        </button>
        <Row
            Icon={PersonIcon}
            data={user.first_name + ' ' + user.last_name}
            className={'nickname'}
            holder={'نام کاربری'}
        />
        <Row
            Icon={AdminIcon}
            data={BigInt(user.admin || 0) ? 'هست' : 'نیست'}
            className={'admin'}
            holder={'ناظر'}
        />
        <Row
            Icon={PhoneIcon2}
            data={user.phone}
            className={'phone'}
            holder={'تلفن همراه'}
        />
        <Row
            Icon={NationalIdIcon}
            data={user.national_id}
            className={'national-id'}
            holder={'کد ملی'}
        />
        <Row
            Icon={CallenderIcon}
            data={user.birth_date}
            className={'birth-date'}
            holder={'تاریخ تولد '}
        />
        <Row
            Icon={EmailIcon}
            data={user.email}
            className={'email'}
            holder={'پست الکترونیکی'}
        />
        <Row
            Icon={AddressIcon}
            data={user.address}
            className={'address title_small'}
            holder={'نشانی محل سکونت '}
        />
        <Row
            Icon={PostalCodeIcon}
            data={user.postal_code}
            className={'postal-code '}
            holder={'کد پستی'}
        />
        <Row
            Icon={WalletIcon}
            data={user.w_eth_in_acc}
            className={'wallet-acc '}
            holder={'موجودی حساب'}
        />
        <Row
            Icon={WalletIcon}
            data={user.w_eth_in_sys}
            className={'wallet-sys '}
            holder={'موجودی سیستم'}
        />
    </div>
)

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
