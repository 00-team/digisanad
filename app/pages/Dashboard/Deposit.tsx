import React, { FC } from 'react'

import './style/deposit.scss'

const Deposit: FC = () => {
    return (
        <section className='deposit-container'>
            <h2 className='section-header section_title'>افزایش موجودی</h2>
            <div className='deposit-wrapper'>
                <div className='video-wrapper'>
                    <iframe
                        src='https://www.aparat.com/video/video/embed/videohash/IZj4O/vt/frame'
                        allowFullScreen={true}
                    ></iframe>
                </div>
            </div>
        </section>
    )
}

export { Deposit }
