import Compression from 'compression-webpack-plugin'
import CssMinimizer from 'css-minimizer-webpack-plugin'
import HtmlPlugin from 'html-webpack-plugin'
import { Configuration } from 'webpack'

import Base from './base'
import { APP_DIR, BASE_DIR, resolve } from './config/path'
import { BuildStyle, CssExtract } from './config/style'

const Html = new HtmlPlugin({
    filename: resolve(BASE_DIR, 'templates/base.html'),
    template: resolve(APP_DIR, 'template.html'),
    inject: true,
    publicPath: '/static/dist/',
    minify: false,
})

const BuildConfig: Configuration = {
    ...Base,
    mode: 'production',
    module: {
        rules: [...Base.module!.rules!, BuildStyle],
    },
    plugins: [
        ...Base.plugins!,
        new CssExtract(),
        new Compression({ exclude: /\.(html)$/ }),
        Html,
    ],
    optimization: {
        emitOnErrors: false,
        chunkIds: 'deterministic',
        minimize: true,
        minimizer: [new CssMinimizer()],
    },
}

export default BuildConfig
