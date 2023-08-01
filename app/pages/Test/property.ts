import { SchemaData } from './types'

const property: SchemaData = {
    stages: [
        {
            title: 'the parties',
            uid: 'parties',
            fields: [
                {
                    title: 'فروشنده ملک',
                    type: 'user',
                    uid: 'seller',
                },
                {
                    title: 'خریدار',
                    type: 'user',
                    uid: 'buyer',
                },
            ],
        },
        {
            fields: [
                {
                    max: 6,
                    min: 1,
                    title: 'میزان دانگ',
                    type: 'int',
                    uid: 'dang_amount',
                },
                {
                    title: 'پلاک ثبتی اصلی',
                    type: 'str',
                    uid: 'F_str_1',
                    min: 0,
                    max: 16,
                },
                {
                    title: 'پلاک ثبتی فرعی',
                    type: 'str',
                    uid: 'F_str_2',
                    min: 0,
                    max: 16,
                },
                {
                    title: 'بخش ثبتی',
                    type: 'str',
                    uid: 'F_str_3',
                    min: 0,
                    max: 255,
                },
                {
                    title: 'شهر مورد ثبت ملک',
                    type: 'str',
                    uid: 'F_str_4',
                    min: 0,
                    max: 255,
                },
                {
                    title: 'کدپستی ملک',
                    type: 'str',
                    uid: 'F_str_5',
                    min: 0,
                    max: 10,
                },
                {
                    title: 'واقع در آدرس',
                    type: 'text',
                    uid: 'F_text_1',
                    min: 0,
                    max: 1024,
                },
                {
                    title: 'موقعیت مکانی ملک',
                    type: 'geo',
                    uid: 'F_geo_1',
                },
            ],
            title: 'مشخصات ملک',
            uid: 'prop_detail',
        },
    ],
}
export { property }
