import { Schema } from './types'

export const property: Schema = {
    pages: [
        {
            content:
                '# قرارداد بیع\nخرید و فروش ملک\n\n## مشخصات طرفین\nفروشنده ملک: ({user_0})\nخریدار:     ({user_1})\n\n## مورد معامله\n\nمیزان دانگ: ({int_1})\nپلاک ثبتی اصلی: ({str_0})\nپلاک ثبتی فرعی: ({str_1})\nبخش ثبتی: ({str_2})\nشهر مورد ثبت ملک: ({str_3})\nکدپستی ملک: ({str_4})\n---\nواقع در آدرس: ({text_0})\nکاربر گرامی شما می توانید موقعیت مکانی ملک خود را بر روی نقشه ثبت نمایید:\n({geo_1})',
        },
        {
            content:
                '## وضعیت ملک\n({question_0})\n\n## وضعیت اسناد مالکیت\n({question_1})\n\nمحل نگه داری عکس اسناد فوق\n({record_0})',
        },
        {
            content:
                '## شرط ضمن عقد\n232 ق م شروط ذیل باطل است:\n1. شرطی که انجام آن غیر مقدور باشد.\n2. شرطی که در آن نفع و فایده نباشد.\n3. شرطی که نامشروع باشد.\n\n233 ق م شروط ذیل باطل و موجب بطلان عقد است:\n1. شرط خلاف مقتضای عقد.\n2. شرط مجهولی که جهل به آن موجب جهل به عوضین شود.\n\n({option_0})',
        },
    ],
    fields: {
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
        int_1: {
            type: 'int',
            uid: 'int_1',
            title: 'Number',
            description: '',
            optinal: false,
            max: 6,
            min: 1,
            value: 1,
        },
        str_0: {
            type: 'str',
            uid: 'str_0',
            title: 'String',
            description: '',
            optinal: false,
            max: null,
            min: null,
            value: '',
        },
        str_1: {
            type: 'str',
            uid: 'str_1',
            title: 'String',
            description: '',
            optinal: false,
            max: null,
            min: null,
            value: '',
        },
        str_2: {
            type: 'str',
            uid: 'str_2',
            title: 'String',
            description: '',
            optinal: false,
            max: null,
            min: null,
            value: '',
        },
        str_3: {
            type: 'str',
            uid: 'str_3',
            title: 'String',
            description: '',
            optinal: false,
            max: null,
            min: null,
            value: '',
        },
        str_4: {
            type: 'str',
            uid: 'str_4',
            title: 'String',
            description: '',
            optinal: false,
            max: 10,
            min: 10,
            value: '',
        },
        text_0: {
            type: 'text',
            uid: 'text_0',
            title: 'Text',
            description: '',
            optinal: false,
            max: null,
            min: null,
            value: '',
        },
        geo_1: {
            type: 'geo',
            uid: 'geo_1',
            title: 'Geo',
            description: '',
            optinal: false,
            value: {
                latitude: 0,
                longitude: 0,
            },
        },
        question_0: {
            type: 'question',
            uid: 'question_0',
            title: 'وضعیت تصرف مالک در ملک فوق',
            description: 'پاسخ سوالات بر پایه صداقت طراحی شده است',
            optinal: false,
            questions: [
                {
                    display: 'آیا ملک در تصرف مالک است؟',
                    uid: 'q1',
                },
                {
                    display: 'آیا ملک به هر عنوان در ید شخص ثالثی است؟',
                    uid: 'q2',
                },
            ],
            answers: [
                {
                    display: 'بله',
                    uid: 'yes',
                },
                {
                    display: 'خیر',
                    uid: 'no',
                },
            ],
            value: {
                q1: 'yes',
                q2: 'yes',
            },
        },
        question_1: {
            type: 'question',
            uid: 'question_1',
            title: 'وضعیت اسناد مالکیت',
            description: '',
            optinal: false,
            questions: [
                {
                    display: 'اسناد مربوط به شهرداری / بخشداری',
                    uid: 'q1',
                },
                {
                    display: 'اسناد مربوط به وضعیت اداره مالیات',
                    uid: 'q2',
                },
                {
                    display:
                        'اسناد مربوط به جهاد کشاورزی / اداره منابع طبیعی/ جنگلبانی و مراتع',
                    uid: 'q3',
                },
            ],
            answers: [
                {
                    display: 'دارد',
                    uid: 'have',
                },
                {
                    display: 'ندارد',
                    uid: 'not_have',
                },
            ],
            value: {
                q1: 'have',
                q2: 'have',
                q3: 'have',
            },
        },
        record_0: {
            type: 'record',
            uid: 'record_0',
            title: 'محل نگه داری عکس اسناد فوق',
            description: '',
            optinal: false,
            plural: true,
            value: [],
        },
        option_0: {
            type: 'option',
            uid: 'option_0',
            title: 'شرط ضمن عقد را انتخاب نمایید',
            options: [],
            optinal: false,
            singleton: false,
            description: '',
            value: [],
        },
    },
}
