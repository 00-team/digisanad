import React from 'react'

import '@react-shamsi/calendar/dist/styles.css'
import { DatePicker as OldDatePicker } from '@react-shamsi/datepicker'
// If you want to use the time picker
import '@react-shamsi/timepicker/dist/styles.css'

import { DateField, FieldProps } from './types'

import './style/datepicker.scss'

const DatePicker: FieldProps<DateField> = ({ field, update, disabled }) => {
    const toDate = (timestamp: number): Date => {
        if (!timestamp) return new Date()

        let offset = Math.abs(new Date().getTimezoneOffset()) * 60
        return new Date((timestamp + offset) * 1000)
    }

    if (disabled) {
        return <span>{toDate(field.value).toLocaleString('fa-IR')}</span>
    }

    return (
        <div className='datepicker-container'>
            <OldDatePicker
                onChange={e => {
                    let offset = new Date().getTimezoneOffset() * 60
                    field.value = Math.floor(e.getTime() / 1000 - offset)
                    console.log(field.value)
                    update()
                }}
                className='datepicker-wrapper'
                autoUpdate
                date={new Date(field.value)}
            />
        </div>
    )
}

export { DatePicker }
