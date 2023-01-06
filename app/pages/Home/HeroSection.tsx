import React from 'react'

import './style/hero.scss'

const HERO_IMG = require('../../static/hero.jpg')

const HeroSection = () => {
    return (
        <section
            className='hero-container'
            style={{ backgroundImage: `url(${HERO_IMG})` }}
        >
            <div className='hero-wrapper'>
                <div className='title logo-text'>Digi Sanad</div>
                <div className='title_smaller'>
                    راه حلی برای تنظیم قرار داد های فیزیکی
                </div>
                <div className='input-container'>
                    <input type='text' />
                </div>
            </div>
        </section>
    )
}

export default HeroSection
