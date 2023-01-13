import React, { useState } from 'react'

import { PersonSvg } from 'Icons'

import { AddressSvg } from 'Icons/Dashboard/Address'
import { CallenderSvg } from 'Icons/Dashboard/Callender'
import { NationalIdSvg } from 'Icons/Dashboard/NationalId'
import PostalCodeSvg from 'Icons/Dashboard/PostalCode'

import { Submit } from 'components'

import './style/card.scss'

const RegisterCard = () => {
    const [Stages, setStages] = useState<'info' | 'address'>('info')
    const [Data, setData] = useState({
        fname: '',
        lname: '',
        nationalId: '',
        birthDay: { year: 0, month: 0, day: 0 },
        address: '',
        postalCode: '',
    })

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const isSectionEmpty = () => {
            const isNotEmpty = (string: string) => string.trim()
            const isOnlyDigits = (string: string) =>
                string.trim() && /^\d+$/.test(string)
            const validBirthday = () =>
                Data.birthDay.day !== 0 &&
                Data.birthDay.month !== 0 &&
                Data.birthDay.year !== 0

            const firstSectionEmpty = () =>
                isNotEmpty(Data.fname) &&
                isNotEmpty(Data.lname) &&
                isOnlyDigits(Data.nationalId) &&
                validBirthday()

            const secondSectionEmpty = () =>
                isNotEmpty(Data.address) && isOnlyDigits(Data.postalCode)

            return Stages === 'info'
                ? firstSectionEmpty()
                : secondSectionEmpty()
        }

        const checkPersonalInfo = () => {
            const onlyPersian = /^[\u0600-\u06FF\s]+$/

            if (onlyPersian.test(Data.fname) && onlyPersian.test(Data.lname))
                return setStages('address')
            else return ReactAlert.error('لطفا مشخصات خود را به فارسی بنویسید.')
        }

        isSectionEmpty()
            ? Stages === 'info'
                ? checkPersonalInfo()
                : ReactAlert.success('send req') //send request
            : ReactAlert.error('لطفا فورم را به درستی پر کنید.')
    }

    return (
        <form onSubmit={SubmitForm} className='register-card'>
            <div className='card-title  title_hero logo-text'>Digi Sanad</div>
            <div className='card-header title'>
                <span>ثبت نام</span>
            </div>
            {Stages === 'info' && (
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
                            onChange={e =>
                                setData({ ...Data, lname: e.target.value })
                            }
                        />
                    </div>
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
                                defaultValue={'سال'}
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
                                defaultValue={'ماه'}
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
                                defaultValue={'روز'}
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

            <Submit
                className='title_small'
                title={Stages === 'info' ? 'مرحله بعد' : 'تایید'}
            />
        </form>
    )
}

export default RegisterCard
