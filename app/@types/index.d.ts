import { FC, HTMLAttributes } from 'react'

import { AlertContextModel } from '@00-team/react-alert'

interface IconAttrs extends HTMLAttributes<SVGSVGElement> {
    size?: number | string
}

declare global {
    var ReactAlert: AlertContextModel
    type Icon = FC<IconAttrs>
    var HandleError: (error: unknown) => void
}
