import React, { FC } from 'react'

import {
    CallSvg,
    FaxSvg,
    InstagramSvg,
    LocationSvg,
    SvgProps,
    TelegramSvg,
    WhatsappSvg,
} from 'icons'

import './style/footer.scss'

const logo = require('../../static/logo.jpg')

const Footer: FC = () => {
    return (
        <footer className='footer-container'>
            <div className='footer-wrapper'>
                <div className='footer-header'>
                    <FooterHeaderRow
                        Svg={LocationSvg}
                        data='یوسف اباد، پلاک 21، زنگ 5'
                        holder='آدرس'
                    />
                    <FooterHeaderRow
                        Svg={CallSvg}
                        data='09120974957'
                        holder='شماره تماس'
                    />
                    <FooterHeaderRow
                        Svg={FaxSvg}
                        data='02188359411'
                        holder='شماره فکس'
                    />
                </div>
                <div className='footer-content-wrapper'>
                    <div className='footer-content'>
                        <div className='content-socials'>
                            <div className='social icon telegram'>
                                <TelegramSvg size={40} />
                            </div>
                            <div className='social icon whatsapp'>
                                <WhatsappSvg size={40} />
                            </div>
                            <div className='social icon instagram'>
                                <InstagramSvg size={40} />
                            </div>
                        </div>
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

interface FooterHeaderRow {
    Svg: FC<SvgProps>
    holder: string
    data: string
}

const FooterHeaderRow: FC<FooterHeaderRow> = ({ Svg, data, holder }) => {
    return (
        <div className='footer-header-row title_small'>
            <div className='header-icon icon'>
                <div className='icon-wrapper'>
                    <Svg size={25} />
                </div>
            </div>
            <div className='header-wrapper '>
                <div className='holder title_smaller'>{holder} </div>
                <div className='data '>{data}</div>
            </div>
        </div>
    )
}

export default Footer
