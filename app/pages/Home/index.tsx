import React, { FC } from 'react'

import HeroSection from './HeroSection'
import Welcomer from './Welcomer'

import './style/home.scss'

const Home: FC = () => {
    return (
        <main className='home'>
            <Welcomer />
            <HeroSection />
        </main>
    )
}

export default Home
