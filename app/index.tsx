import React, { FC } from 'react'
import { createRoot } from 'react-dom/client'

import { Options, Provider as AlertProvider } from '@00-team/react-alert'
import { BrowserRouter as Router } from 'react-router-dom'

import { Provider as JotaiProvider, createStore } from 'jotai'

import { Alert } from 'components'

import App from './App'

const AlertOptions: Options = {
    position: 'top-right',
    timeout: 8000,
    wrapper: () => ({ className: 'wrapper' }),
    inner: () => ({ className: 'inner' }),
}

const jotai_store = createStore()

const Root: FC = () => {
    return (
        <JotaiProvider store={jotai_store}>
            <AlertProvider template={Alert} options={AlertOptions}>
                <Router>
                    <App />
                </Router>
            </AlertProvider>
        </JotaiProvider>
    )
}

const container = document.getElementById('root')!
createRoot(container).render(<Root />)
