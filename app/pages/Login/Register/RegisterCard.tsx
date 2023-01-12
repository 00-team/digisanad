import React, { useState } from 'react'

import { PersonSvg } from 'Icons'

import { AddressSvg } from 'Icons/Dashboard/Address'
import { NationalIdSvg } from 'Icons/Dashboard/NationalId'
import PostalCodeSvg from 'Icons/Dashboard/PostalCode'

import { Submit } from 'components'

import './style/card.scss'

const RegisterCard = () => {
    const [Stages, setStages] = useState<'info' | 'address'>('info')

    const SubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        Stages === 'info' && setStages('address')
        Stages === 'address' && ReactAlert.success('send req') //send request
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
                        />
                    </div>
                    {/* <div className="birthday">
                    <div className="holder">
                        <div className="holder-icon icon">
                            <CallenderSvg />
                        </div>
                        <div className="holder-data"></div>
                    </div>
                </div> */}
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
