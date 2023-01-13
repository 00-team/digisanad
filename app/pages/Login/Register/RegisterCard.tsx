import React, { useState } from 'react'

import { PersonSvg } from 'Icons'
import { GoBack } from 'Icons/Models/GoBack'

import { AddressSvg } from 'Icons/Dashboard/Address'
import { CallenderSvg } from 'Icons/Dashboard/Callender'
import { NationalIdSvg } from 'Icons/Dashboard/NationalId'
import PostalCodeSvg from 'Icons/Dashboard/PostalCode'

import { Submit } from 'components'

import './style/card.scss'

const RegisterCard = () => {
    const [Stages, setStages] = useState<'contact' | 'info' | 'address'>(
        'contact'
    )
    const [Data, setData] = useState({
        fname: '',
        lname: '',
        phone: '',
        nationalId: '',
        birthDay: { year: 0, month: 0, day: 0 },
        address: '',
        postalCode: '',
    })

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const onlyPersian = /^[\u0600-\u06FF\s]+$/
        const isNotEmpty = (string: string) => string.trim()
        const isOnlyDigits = (string: string) =>
            string.trim() && /^\d+$/.test(string)
        const validBirthday = () =>
            Data.birthDay.day !== 0 &&
            Data.birthDay.month !== 0 &&
            Data.birthDay.year !== 0

        const checkContact = () => {
            if (
                isNotEmpty(Data.fname) &&
                isNotEmpty(Data.lname) &&
                isOnlyDigits(Data.phone)
            ) {
                if (
                    onlyPersian.test(Data.fname) &&
                    onlyPersian.test(Data.lname)
                ) {
                    setStages('info')
                } else {
                    ReactAlert.error('لطفا مشخصات خود را به فارسی بنویسید.')
                }
            } else {
                ReactAlert.error('لطفا فرم را به صورت کامل پر کنید.')
            }
            return
        }
        const checkInfo = () => {
            if (isOnlyDigits(Data.nationalId) && validBirthday()) {
                setStages('address')
            } else {
                ReactAlert.error('لطفا فرم را به صورت کامل پر کنید.')
            }
            return
        }
        const checkAddress = () => {
            if (isNotEmpty(Data.address) && isOnlyDigits(Data.postalCode)) {
                if (onlyPersian.test(Data.address)) {
                    ReactAlert.show('send req')
                } else {
                    ReactAlert.error(
                        'لطفا آدرس خود را فقط با حروف فارسی پر کنید.'
                    )
                }
            } else {
                ReactAlert.error('لطفا فرم را به صورت کامل پر کنید.')
            }
        }

        Stages === 'contact' && checkContact()
        Stages === 'info' && checkInfo()
        Stages === 'address' && checkAddress()
    }

    return (
        <form onSubmit={SubmitForm} className='register-card'>
            <div className='card-title  title_hero logo-text'>Digi Sanad</div>
            <div className='card-header title'>
                <span>ثبت نام</span>
            </div>
            {Stages === 'contact' && (
                <div className='inps'>
                    <div className='input-wrapper'>
                        <div className='holder title_small'>
                            <div className='holder-icon icon'>
                                <PersonSvg />
                            </div>
                            <div className='holder-data'>نام</div>
                        </div>
                        <input
                            type='text'
                            className='fname title_smaller'
                            name='userFirstName'
                            autoFocus
                            value={Data.fname}
                            onChange={e =>
                                setData({ ...Data, fname: e.target.value })
                            }
                        />
                    </div>
                    <div className='input-wrapper'>
                        <div className='holder title_small'>
                            <div className='holder-icon icon'>
                                <PersonSvg />
                            </div>
                            <div className='holder-data'>نام خانوادگی</div>
                        </div>
                        <input
                            type='text'
                            className='lname title_smaller'
                            name='userLastName'
                            value={Data.lname}
                            onChange={e =>
                                setData({ ...Data, lname: e.target.value })
                            }
                        />
                    </div>
                    <div className='input-wrapper'>
                        <div className='holder title_small'>
                            <div className='holder-icon icon'>
                                <PersonSvg />
                            </div>
                            <div className='holder-data'>تلفن همراه </div>
                        </div>
                        <input
                            inputMode='numeric'
                            className='lname title_smaller'
                            name='userPhone'
                            value={Data.phone}
                            onChange={e =>
                                setData({ ...Data, phone: e.target.value })
                            }
                        />
                    </div>
                </div>
            )}
            {Stages === 'info' && (
                <div className='inps'>
                    <div className='input-wrapper'>
                        <div className='holder title_small'>
                            <div className='holder-icon icon'>
                                <NationalIdSvg />
                            </div>
                            <div className='holder-data'>کد ملی </div>
                        </div>
                        <input
                            inputMode='numeric'
                            className='userNationalId title_smaller'
                            name='national-id'
                            value={Data.nationalId}
                            onChange={e =>
                                setData({ ...Data, nationalId: e.target.value })
                            }
                        />
                    </div>
                    <div className='input-wrapper birthday'>
                        <div className='holder title_small'>
                            <div className='holder-icon icon'>
                                <CallenderSvg />
                            </div>
                            <div className='holder-data'>تاریخ تولد</div>
                        </div>
                        <div className='birthday-inp'>
                            <select
                                name='birthdayYear'
                                onChange={e =>
                                    setData({
                                        ...Data,
                                        birthDay: {
                                            ...Data.birthDay,
                                            year: parseInt(e.target.value),
                                        },
                                    })
                                }
                                defaultValue={
                                    Data.birthDay.year === 0
                                        ? 'سال'
                                        : Data.birthDay.year
                                }
                            >
                                <option className='default' disabled hidden>
                                    سال
                                </option>
                                {Array.from(Array(100).keys()).map(
                                    (_, index) => (
                                        <option
                                            key={index}
                                            value={index + 1300}
                                        >
                                            {index + 1300}
                                        </option>
                                    )
                                )}
                            </select>
                            <select
                                name='birthdayMonth'
                                onChange={e =>
                                    setData({
                                        ...Data,
                                        birthDay: {
                                            ...Data.birthDay,
                                            month: parseInt(e.target.value),
                                        },
                                    })
                                }
                                defaultValue={
                                    Data.birthDay.month === 0
                                        ? 'ماه'
                                        : Data.birthDay.month
                                }
                            >
                                <option className='default' disabled hidden>
                                    ماه
                                </option>
                                {Array.from(Array(12).keys()).map(
                                    (_, index) => (
                                        <option key={index} value={index + 1}>
                                            {index + 1}
                                        </option>
                                    )
                                )}
                            </select>
                            <select
                                name='birthdayDay'
                                onChange={e =>
                                    setData({
                                        ...Data,
                                        birthDay: {
                                            ...Data.birthDay,
                                            day: parseInt(e.target.value),
                                        },
                                    })
                                }
                                defaultValue={
                                    Data.birthDay.day === 0
                                        ? 'روز'
                                        : Data.birthDay.day
                                }
                            >
                                <option className='default' disabled hidden>
                                    روز
                                </option>
                                {Array.from(Array(31).keys()).map(
                                    (_, index) => (
                                        <option key={index} value={index + 1}>
                                            {index + 1}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            )}
            {Stages === 'address' && (
                <div className='inps'>
                    <div className='input-wrapper'>
                        <div className='holder title_small'>
                            <div className='holder-icon icon'>
                                <AddressSvg />
                            </div>
                            <div className='holder-data'>آدرس </div>
                        </div>
                        <textarea
                            cols={20}
                            rows={5}
                            className='address title_smaller'
                            name='address'
                            maxLength={1000}
                            onChange={e =>
                                setData({ ...Data, address: e.target.value })
                            }
                        />
                    </div>

                    <div className='input-wrapper'>
                        <div className='holder title_small'>
                            <div className='holder-icon icon'>
                                <PostalCodeSvg />
                            </div>
                            <div className='holder-data'>کد پستی</div>
                        </div>
                        <input
                            type='text'
                            className='postal-code title_smaller'
                            name='postalCode'
                            onChange={e =>
                                setData({ ...Data, postalCode: e.target.value })
                            }
                        />
                    </div>
                </div>
            )}

            {Stages !== 'contact' && (
                <div
                    className='go-back-wrapper icon'
                    onClick={() => {
                        Stages === 'info' && setStages('contact')
                        Stages === 'address' && setStages('info')
                    }}
                >
                    <GoBack />
                </div>
            )}

            <Submit
                className='title_small'
                title={Stages === 'info' ? 'مرحله بعد' : 'تایید'}
            />
        </form>
    )
}

export default RegisterCard
