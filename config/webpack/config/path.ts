import { resolve } from 'path'

const BASE_DIR = resolve(__dirname, '../../../')
const APP_DIR = resolve(BASE_DIR, 'app')
const DIST_DIR = resolve(BASE_DIR, 'static/dist/')

export { BASE_DIR, APP_DIR, DIST_DIR, resolve }
