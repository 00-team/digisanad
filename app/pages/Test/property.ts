import { SchemaData } from './types'

export const property: SchemaData = {
    stages: [
        {
            title: 'طرفین',
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
            title: 'مشخصات ملک',
            uid: 'prop_detail',
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
        },
        {
            uid: 'prop_status',
            title: 'وضعیت ملک',
            fields: [
                {
                    title: 'وضعیت تصرف مالک در ملک فوق',
                    type: 'question',
                    uid: 'F_question_1',
                    questions: [
                        {
                            display: 'آیا ملک در تصرف مالک است ؟',
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
                },
                {
                    title: 'وضعیت اسناد مالکیت',
                    type: 'question',
                    uid: 'F_question_2',
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
                },
                {
                    title: 'RECORD',
                    type: 'record',
                    uid: 'field_record_2',
                    plural: true,
                },
            ],
        },
        {
            uid: 'stage__1',
            title: 'شرط ضمن عقد',
            fields: [],
            description:
                '232 ق م: شروط ذیل باطل است:\n1. شرطی که انجام آن غیر مقدور باشد.\n2. شرطی که در آن نفع و فایده نباشد.\n3. شرطی که نامشروع باشد.\n\n233 ق م: شروط ذیل باطل و موجب بطلان عقد است:\n1. شرط خلاف مقتضای عقد.\n2. شرط مجهولی که جهل به آن موجب جهل به عوضین شود.',
        },
    ],
}
