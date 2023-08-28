import React, { FC } from 'react'

import { TemplateProps } from '@00-team/react-alert'
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from 'icons'

import './style/alert.scss'

const Alert: FC<TemplateProps> = ({ message, close, options }) => {
    return (
        <div className={`alert-container title_smaller ${options.type}`}>
            <div className='icon'>
                {options.type === 'success' && <SuccessIcon size={24} />}
                {options.type === 'error' && <WarningIcon size={24} />}
                {options.type === 'info' && <InfoIcon size={24} />}
            </div>
            <span className={'holder' + options.type}>{message}</span>
            <div className='alert-close' onClick={close}>
                <ErrorIcon size={15} />
            </div>
        </div>
    )
}
export { Alert }
