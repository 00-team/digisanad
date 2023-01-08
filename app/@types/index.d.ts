import { FC, HTMLAttributes } from 'react'

import { AlertContextModel } from '@00-team/react-alert'

declare global {
    var ReactAlert: AlertContextModel
    type Icon = FC<HTMLAttributes<SVGSVGElement>>
    var HandleError: (error: unknown) => void
}
