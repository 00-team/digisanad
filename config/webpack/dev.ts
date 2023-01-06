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
        new HtmlPlugin({ template: resolve(APP_DIR, 'template.html') }),
    ],
    devServer: {
        port: 8000,
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
                target: 'http://127.0.0.1:7000/',
            },

            // static
            {
                context: ['/favicon.ico'],
                target: 'http://127.0.0.1:7000/static/',
            },
        ],
    },
}

export default DevConfig
