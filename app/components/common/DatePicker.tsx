import React, { FC } from 'react'

import '@react-shamsi/calendar/dist/styles.css'
import { DatePicker as OldDatePicker } from '@react-shamsi/datepicker'
// If you want to use the time picker
import '@react-shamsi/timepicker/dist/styles.css'

import './style/datepicker.scss'

export const DatePicker: FC = () => {
    return (
        <div className='datepicker-container'>
            <OldDatePicker
                className='datepicker-wrapper'
                autoUpdate
                defaultDate={new Date()}
            />
        </div>
    )
}
