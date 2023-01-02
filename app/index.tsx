import React, { FC } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'

const Root: FC = () => {
    return (
        <Router>
            <App />
        </Router>
    )
}

const container = document.getElementById('root')!
createRoot(container).render(<Root />)
