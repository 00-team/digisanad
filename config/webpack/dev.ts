import HtmlPlugin from 'html-webpack-plugin'
import { Configuration as WConf } from 'webpack'
import { Configuration as DConf } from 'webpack-dev-server'

import Base from './base'
import { APP_DIR, resolve } from './config/path'
import { DevStyle } from './config/style'

interface Configuration extends WConf {
    devServer: DConf
}

const DevConfig: Configuration = {
    ...Base,
    mode: 'development',
    module: {
        rules: [...Base.module!.rules!, DevStyle],
    },
    plugins: [
        ...Base.plugins!,
        new HtmlPlugin({
            template: resolve(APP_DIR, 'template.html'),
            publicPath: '/',
        }),
    ],
    devServer: {
        port: 8100,
        hot: true, // true = full reload
        historyApiFallback: true,
        compress: true,
        client: {
            logging: 'none',
            reconnect: 7,
        },
        proxy: [
            {
                context: ['/api', '/static', '/media'],
                target: 'https://digisanad.com/',
                changeOrigin: true,
            },

            // static
            {
                context: ['/favicon.ico'],
                target: 'https://digisanad.com/static/',
                changeOrigin: true,
            },
        ],
    },
}

export default DevConfig
