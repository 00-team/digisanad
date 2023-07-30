import { FC, HTMLAttributes, SVGAttributes } from 'react'

import { AlertContextModel } from '@00-team/react-alert'

interface IconAttrs extends SVGAttributes<SVGElement> {
    size?: number | string
}

declare global {
    var ReactAlert: AlertContextModel
    type Icon = FC<IconAttrs>
    var HandleError: (error: unknown) => void
}
