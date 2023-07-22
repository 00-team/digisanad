import React, { FC } from 'react'

import { TemplateProps } from '@00-team/react-alert'
import { ErrorSvg, InfoSvg, SuccessSvg, WarningSvg } from 'icons'

import './style/alert.scss'

const Alert: FC<TemplateProps> = ({ message, close, options }) => {
    return (
        <div className={`alert-container title_smaller ${options.type}`}>
            <div className='icon'>
                {options.type === 'success' && <SuccessSvg size={24} />}
                {options.type === 'error' && <WarningSvg size={24} />}
                {options.type === 'info' && <InfoSvg size={24} />}
            </div>
            <span className={'holder' + options.type}>{message}</span>
            <div className='alert-close' onClick={close}>
                <ErrorSvg size={15} />
            </div>
        </div>
    )
}
export { Alert }
