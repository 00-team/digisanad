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
                <div className='title_hero logo-text hero-header'>
                    <span>Digi Sanad</span>
                </div>
                <div className='title words-wrapper'>
                    {'راه حلی برای تنظیم قرار داد های فیزیکی'
                        .split(' ')
                        .map((word, index) => {
                            return (
                                <span
                                    key={index}
                                    className='hero-word'
                                    style={{
                                        animationDelay: `${
                                            index * 50 + 5500
                                        }ms`,
                                    }}
                                >
                                    {word}
                                </span>
                            )
                        })}
                </div>
                <form
                    className='input-container title'
                    onSubmit={e => e.preventDefault()}
                >
                    <input
                        placeholder='جستجو کنید...'
                        className='title_small'
                        type={'search'}
                    />
                    <button className='title_small'>جستجو</button>
                </form>
            </div>
        </section>
    )
}

export default HeroSection
