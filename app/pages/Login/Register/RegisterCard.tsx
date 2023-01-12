import React from 'react'

import './style/card.scss'

const RegisterCard = () => {
    return (
        <form onSubmit={e => e.preventDefault()} className='register-card'>
            <div className='card-title  title_hero logo-text'>Digi Sanad</div>
        </form>
    )
}

export default RegisterCard
