import React, { FC } from 'react'

import './style/footer.scss'

const logo = require('../../static/logo.jpg')

const Footer: FC = () => {
    return (
        <footer className='footer-container'>
            <div className='footer-wrapper'>
                <div className='footer-content-wrapper'>
                    <div className='footer-content'>
                        <div className='content-row-wrapper title'>
                            Powered by smart contracts on blockchain Smart
                            contracts are commonly associated with
                            cryptocurrencies, and the smart contracts introduced
                            by Ethereum are generally considered a fundamental
                            building block for decentralized finance and NFT
                            applications.
                        </div>
                    </div>
                    <div className='footer-logo title_small'>
                        <div className='logo-name'>
                            <img
                                className='logo-img'
                                decoding={'async'}
                                loading={'lazy'}
                                src={logo}
                            />
                            © digisanad cms 2020 - 2023{' '}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
