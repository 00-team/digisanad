import { Schema } from './types'

export const property: Schema = {
    pages: [
        {
            content:
                '# طرفین\nفروشنده ملک ({user_0}) و خریدار ({user_1}) می باشد.\n\n## ساب تایتل\n\n({geo_0})\n\n## خسارت حاصله از عدم اجرای تعهدات\n\nو اگـــر برای ایفاء تعهد مدتی مقرر نبوده  طرف قرارداد  آقا / خانم ({user_1}) وقتی می تواند ادعای خسارت نماید که اختیار موقع انجام با اوبوده و ثابت نماید که انجام تعهد را مطالبه کرده است.\n\n\n({int_0})',
        },
    ],
    fields: {
        option_0: {
            type: 'option',
            uid: 'option_0',
            title: 'Option',
            options: [],
            optinal: false,
            singleton: false,
            description: '',
            value: [],
        },
        user_0: {
            type: 'user',
            value: '',
            uid: 'user_0',
            title: 'Number',
            description: '',
            optinal: false,
        },
        user_1: {
            type: 'user',
            uid: 'user_1',
            value: '',
            title: 'Number',
            description: '',
            optinal: false,
        },
        geo_0: {
            type: 'geo',
            uid: 'geo_0',
            title: 'Number',
            description: '',
            optinal: false,
            value: {
                latitude: 0,
                longitude: 0,
            },
        },
        int_0: {
            type: 'int',
            uid: 'int_0',
            title: 'Number',
            description: '',
            optinal: false,
            max: -1,
            min: 3,
            value: 0,
        },
    },
}
