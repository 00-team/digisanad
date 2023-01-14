import React, { FC, useEffect, useState } from 'react'

import { PersonSvg } from 'Icons'
import { EmailSvg } from 'Icons/Models/Email'
import { GoBack } from 'Icons/Models/GoBack'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

import { useAtom } from 'jotai'
import { LoginAtom, UserAtom } from 'state'

import { AddressSvg } from 'Icons/Dashboard/Address'
import { CallenderSvg } from 'Icons/Dashboard/Callender'
import { CodeSvg } from 'Icons/Dashboard/Code'
import { NationalIdSvg } from 'Icons/Dashboard/NationalId'
import PostalCodeSvg from 'Icons/Dashboard/PostalCode'

import Clouds from '../../../components/Clouds'
import { Submit } from 'components'
import { Timer } from 'components/common/Timer'

import './style/register.scss'

const Register: FC = () => {
    const [Login, setLogin] = useAtom(LoginAtom)
    const [User, setUser] = useAtom(UserAtom)

    const [Stages, setStages] = useState<
        'contact' | 'info' | 'address' | 'code'
    >('contact')
    const [Data, setData] = useState({
        fname: '',
        lname: '',
        phone: '',
        email: '',
        nationalId: '',
        birthDay: { year: 0, month: 0, day: 0 },
        address: '',
        postalCode: '',
        code: '',
    })

    const navigate = useNavigate()

    useEffect(() => {
        if (User.token || User.user_id !== 0) {
            navigate('/dashboard')
        }
    }, [])

    const SendAgain = async () => {
        try {
            const response = await axios.post('/api/auth/verify/', {
                phone: Data.phone,
                action: 'register',
            })

            console.log(response)

            if (typeof response.data.timer === 'number') {
                ReactAlert.info('کد تایید مجددا برای شما پیامک شد.')
                setLogin({
                    stage: 'code',
                    time: response.data.timer,
                    resend: !response.data.timer,
                })
            } else {
                ReactAlert.error('خطا! لطفا دوباره تلاش کنید.')
            }
        } catch (error) {
            console.log(error)
            HandleError(error)
        }
    }
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

        // sections checks
        const checkContact = () => {
            if (
                isNotEmpty(Data.fname) &&
                isNotEmpty(Data.lname) &&
                isNotEmpty(Data.email) &&
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
                    setStages('code')
                    getCode()
                } else {
                    ReactAlert.error(
                        'لطفا آدرس خود را فقط با حروف فارسی پر کنید.'
                    )
                }
            } else {
                ReactAlert.error('لطفا فرم را به صورت کامل پر کنید.')
            }
        }
        const checkCode = () => {
            isOnlyDigits(Data.code)
                ? sendRequest()
                : ReactAlert.error('لطفا کد تایید را وارد کنید.')
        }
        const getCode = async () => {
            try {
                await axios.post('/api/auth/verify/', {
                    phone: Data.phone,
                    action: 'register',
                })
                ReactAlert.info('کد تایید برای شما ارسال شد.')
            } catch (error) {
                console.log(error)
                HandleError(error)
            }
        }
        //

        const sendRequest = async () => {
            try {
                const response = await axios.post('/api/auth/register/', {
                    phone: Data.phone,
                    code: Data.code,
                    first_name: Data.fname,
                    last_name: Data.lname,
                    birth_date: [
                        Data.birthDay.year,
                        Data.birthDay.month,
                        Data.birthDay.day,
                    ],
                    national_id: Data.nationalId,
                    postal_code: Data.postalCode,
                    address: Data.address,
                    email: Data.email,
                })
                setUser({
                    token: response.data.token,
                    user_id: response.data.user_id,
                })
                navigate('/dashboard')
            } catch (error) {
                console.log(error)
                HandleError(error)
            }
        }

        Stages === 'contact' && checkContact()
        Stages === 'info' && checkInfo()
        Stages === 'address' && checkAddress()
        Stages === 'code' && checkCode()
    }

    return (
        <div className='register'>
            <form onSubmit={SubmitForm} className='register-card'>
                <div className='card-title  title_hero logo-text'>
                    Digi Sanad
                </div>
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
                        <div className='input-wrapper'>
                            <div className='holder title_small'>
                                <div className='holder-icon icon'>
                                    <EmailSvg />
                                </div>
                                <div className='holder-data'>
                                    پست الکترونیکی{' '}
                                </div>
                            </div>
                            <input
                                type='text'
                                className='lname title_smaller'
                                name='userEmail'
                                value={Data.email}
                                onChange={e =>
                                    setData({ ...Data, email: e.target.value })
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
                                    setData({
                                        ...Data,
                                        nationalId: e.target.value,
                                    })
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
                                            <option
                                                key={index}
                                                value={index + 1}
                                            >
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
                                            <option
                                                key={index}
                                                value={index + 1}
                                            >
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
                                maxLength={1024}
                                value={Data.address}
                                onChange={e =>
                                    setData({
                                        ...Data,
                                        address: e.target.value,
                                    })
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
                                value={Data.postalCode}
                                onChange={e =>
                                    setData({
                                        ...Data,
                                        postalCode: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                )}
                {Stages === 'code' && (
                    <div className='inps'>
                        <div className='input-wrapper'>
                            <div className='holder title_small'>
                                <div className='holder-icon icon'>
                                    <CodeSvg />
                                </div>
                                <div className='holder-data'>کد تایید</div>
                            </div>
                            <div className='sms-wrapper'>
                                <input
                                    autoComplete='one-time-code'
                                    className='sms-code title_small'
                                    name='code'
                                    inputMode='numeric'
                                    autoFocus
                                    id='code'
                                    placeholder='12345'
                                    onChange={e =>
                                        setData({
                                            ...Data,
                                            code: e.target.value,
                                        })
                                    }
                                />
                                <div className='card-options'>
                                    <div className='phone-number-holder title_smaller'>
                                        کد تایید به شماره {Data.phone} پیامک شد.
                                    </div>
                                    {Login.resend ? (
                                        <div
                                            className='title_small can-resend'
                                            onClick={() => SendAgain()}
                                        >
                                            ارسال مجدد
                                        </div>
                                    ) : (
                                        <div className='title_small timer-container cant-resend'>
                                            <Timer start={Login.time} />
                                            <div>ثانیه تا ارسال مجدد</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {Stages !== 'contact' && (
                    <div
                        className='go-back-wrapper icon'
                        onClick={() => {
                            Stages === 'info' && setStages('contact')
                            Stages === 'address' && setStages('info')
                            Stages === 'code' && setStages('address')
                        }}
                    >
                        <GoBack />
                    </div>
                )}

                <Link to={'/login'} className='goto-login title_small'>
                    حساب کابری دارید؟
                </Link>

                <Submit
                    className='title_small'
                    title={Stages === 'info' ? 'مرحله بعد' : 'تایید'}
                />
            </form>
            <Clouds />
        </div>
    )
}

export default Register
