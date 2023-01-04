import React, { FC } from 'react'

import Welcomer from './Welcomer'

import './style/home.scss'

const Home: FC = () => {
    return (
        <main className='home'>
            <Welcomer />
        </main>
    )
}

export default Home
