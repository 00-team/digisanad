import React, { FC } from 'react'
import { createRoot } from 'react-dom/client'

const Root: FC = () => {
    return <>ROOT</>
}

createRoot(document.getElementById('root')!).render(<Root />)
