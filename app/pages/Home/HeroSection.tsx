import React, { FC, useEffect } from 'react'

import { user_get_me } from 'api'
import { Link } from 'react-router-dom'

import { useAtom } from 'jotai'
import { TokenAtom, UserAtom } from 'state'

import './style/hero.scss'

import HERO_IMAGE from 'static/hero.jpg'

const HeroSection: FC = () => {
    return (
        <section
            className='hero-container'
            style={{
                backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
            url(${HERO_IMAGE})`,
            }}
        >
            <div className='hero-wrapper'>
                <div className='title_hero logo-text hero-header'>
                    <span>Digi Sanad</span>
                </div>
                <div className='title logo-text hero-header cms'>
                    <span>Contract Management System (CMS)</span>
                </div>
                <div className='title words-wrapper'>
                    {'سیستم مدیریت قرارداد های هوشمند'
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

                <DashboardButton />
            </div>
        </section>
    )
}

const DashboardButton: FC = () => {
    const [user, setUser] = useAtom(UserAtom)
    const [token, setToken] = useAtom(TokenAtom)

    useEffect(() => {
        if (user.user_id) return

        if (token) {
            user_get_me(token).then(data => {
                if (data === null || !data.user_id) {
                    setToken('')
                } else {
                    setUser(data)
                }
            })
        }
    }, [user, token])

    return (
        <Link
            to={user.user_id ? '/dashboard/' : '/login/'}
            className='dash-btn title_small'
        >
            {user.user_id ? 'داشبورد' : 'ورود'}
        </Link>
    )
}

export default HeroSection
