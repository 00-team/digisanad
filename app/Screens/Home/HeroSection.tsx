import React from 'react'

import './style/hero.scss'

const HERO_IMG = require('../../static/hero.jpg')

const HeroSection = () => {
    return (
        <section
            className='hero-container'
            style={{ backgroundImage: `url(${HERO_IMG})` }}
        >
            HeroSection
        </section>
    )
}

export default HeroSection
