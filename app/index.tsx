import React, { FC } from 'react'
import { createRoot } from 'react-dom/client'

import { Options, Provider as AlertProvider } from '@00-team/react-alert'
import { BrowserRouter as Router } from 'react-router-dom'

import { Alert } from 'components'

import App from './App'

const AlertOptions: Options = {
    position: 'top-right',
    timeout: 8000,
    wrapper: () => ({ className: 'wrapper' }),
    inner: () => ({ className: 'inner' }),
}

const Root: FC = () => {
    return (
        <AlertProvider template={Alert} options={AlertOptions}>
            <Router>
                <App />
            </Router>
        </AlertProvider>
    )
}

const container = document.getElementById('root')!
createRoot(container).render(<Root />)
