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
                '## شرط ضمن عقد\n232 ق م شروط ذیل باطل است:\n1. شرطی که انجام آن غیر مقدور باشد.\n2. شرطی که در آن نفع و فایده نباشد.\n3. شرطی که نامشروع باشد.\n\n233 ق م شروط ذیل باطل و موجب بطلان عقد است:\n1. شرط خلاف مقتضای عقد.\n2. شرط مجهولی که جهل به آن موجب جهل به عوضین شود.\n\n({option_0})\n\nشما در این قسمت میتوانید شرط ضمن قرارداد خود را بیشتر توضیح دهید:\n({text_1})\n',
        },
        {
            content:
                '## خسارت حاصله از عدم اجرای تعهدات\n* توجه فرمایید شما باید این قسمت را نسبت به شرایط تعهدات دو طرف قرارداد تکمیل فرمایید\n\nدر مورد عدم ایفاء تعهدات از طرف یکی از متعاملین طرف دیگر: ({user_2}) می تواند ادعای خسارت نماید . خسارت می تواند، توضیح دهید:\n({text_2})\n\nبرای ایفاء تعهد ، مدت معینی مقرر شده  و مدت مزبور تا این تاریخ منقضی خواهد شد : ({date_0})\n\nو اگـــر برای ایفاء تعهد مدتی مقرر نبوده  طرف قرارداد  آقا / خانم ({user_3}) وقتی می تواند ادعای خسارت نماید که اختیار موقع انجام با اوبوده و ثابت نماید که انجام تعهد را مطالبه کرده است.\n\n### متخلف از انجام تعهد ، وقتی محکوم به تأدیه خسارت می شود کـــه نتواند ثابت نماید که عدم انجام به واسطۀ علت خارجی بوده است که نمی توان مربوط به او نمود.\n\nتأدیه ( پرداخت ) خسارت به مبلغ روزانه: ({int_0}) تومان\nدر کل مجموع مبلغ خسارت ({int_2}) تومان است.\n\nمبلغ کل به حروف ({str_5})\n\n### در صورتی که موضوع  تعهد تأدیه وجه نقدی باشد حاکم می تواند با رعایت ماده 221 مدیون را به جبران خسارت حاصله از تأخیر در تأدیه دِین محکوم نماید .\nاگر  آقا / خانم ({user_4}) تعهد اقدام به امری را بکند  به قرار ذیل:\n\n({text_3})\n\nیا تعهد نماید که از انجام امری به قرار ذیل:\n({text_4})\n\nتعهد نمود  در صورت تخلف مسئول خسارت طرف مقابل است مشروط  بر اینکـــــــــه جبران خسارت تصریح شده و یا تعهد عرفاً به منزلۀ تصریح باشد و یا بر حسب قانون موجب ضِمان باشد.\n({text_5})\n\nدر صورت  عدم ایفاء تعهد  با رعایت مادۀ فوق حاکم می تواند  به  کسی که تعهد به نفع او شده است اجازه دهد که خود او عمل را انجام دهد و متخلف را به تأدیه (پرداخت) مخارج آن  محکوم نماید .',
        },
        {
            content:
                'کاربر گرامی بر روی این گزینه کلیک نمایید و از امکانات موتور جستجو استفاده نمایید.\n\nDigiSanad ابزاری نوین\n\n({signature_0})',
        },
    ],
    fields: {
        user_0: {
            type: 'user',
            value: '',
            uid: 'user_0',
            optional: false,
        },
        user_1: {
            type: 'user',
            uid: 'user_1',
            value: '',
            optional: false,
        },
        int_1: {
            type: 'int',
            uid: 'int_1',
            optional: false,
            max: 6,
            min: 1,
            value: 1,
        },
        str_0: {
            type: 'str',
            uid: 'str_0',
            optional: false,
            max: null,
            min: null,
            value: '',
        },
        str_1: {
            type: 'str',
            uid: 'str_1',
            optional: false,
            max: null,
            min: null,
            value: '',
        },
        str_2: {
            type: 'str',
            uid: 'str_2',
            optional: false,
            max: null,
            min: null,
            value: '',
        },
        str_3: {
            type: 'str',
            uid: 'str_3',
            optional: false,
            max: null,
            min: null,
            value: '',
        },
        str_4: {
            type: 'str',
            uid: 'str_4',
            optional: false,
            max: 10,
            min: 10,
            value: '',
        },
        text_0: {
            type: 'text',
            uid: 'text_0',
            optional: false,
            max: null,
            min: null,
            value: '',
        },
        geo_1: {
            type: 'geo',
            uid: 'geo_1',
            optional: false,
            value: {
                latitude: 0,
                longitude: 0,
            },
        },
        question_0: {
            type: 'question',
            uid: 'question_0',
            title: 'وضعیت تصرف مالک در ملک فوق',
            optional: false,
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
            optional: false,
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
            optional: false,
            plural: true,
            value: [],
        },
        option_0: {
            type: 'option',
            uid: 'option_0',
            title: 'شرط ضمن عقد را انتخاب نمایید',
            options: [
                {
                    uid: 'o0',
                    display:
                        'شرط صفت عبارت است از شرط راجعه به کیفیت یا کمیت مورد معامله .',
                },
                {
                    uid: 'o1',
                    display:
                        'شرط نتیجه آن است که تحقق امری در خارج عقد شرط شود .',
                },
                {
                    uid: 'o2',
                    display:
                        'شرط فعل آن است که اقدام یا عدم اقدام به فعلی بر یکی از متعاملین یا بر  شخص خارجی شرط شود .',
                },
            ],
            optional: false,
            singleton: true,
            value: ['o0', 'o1', 'o2'],
        },
        text_1: {
            type: 'text',
            uid: 'text_1',
            optional: false,
            max: null,
            min: null,
            value: '',
        },
        user_2: {
            type: 'user',
            uid: 'user_2',
            value: '',
            optional: false,
        },
        text_2: {
            type: 'text',
            uid: 'text_2',
            optional: false,
            max: null,
            min: null,
            value: '',
        },
        date_0: {
            type: 'date',
            uid: 'date_0',
            optional: false,
            value: 0,
        },
        user_3: {
            type: 'user',
            uid: 'user_3',
            value: '',
            optional: false,
        },
        int_0: {
            type: 'int',
            uid: 'int_0',
            optional: false,
            max: null,
            min: null,
            value: 0,
        },
        int_2: {
            type: 'int',
            uid: 'int_2',
            optional: false,
            max: null,
            min: null,
            value: 0,
        },
        str_5: {
            type: 'str',
            uid: 'str_5',
            optional: false,
            max: null,
            min: null,
            value: '',
        },
        user_4: {
            type: 'user',
            uid: 'user_4',
            value: '',
            optional: false,
        },
        text_3: {
            type: 'text',
            uid: 'text_3',
            optional: false,
            max: null,
            min: null,
            value: '',
        },
        text_4: {
            type: 'text',

            uid: 'text_4',
            optional: false,
            max: null,
            min: null,
            value: '',
        },
        text_5: {
            type: 'text',
            uid: 'text_5',
            optional: false,
            max: null,
            min: null,
            value: '',
        },
        signature_0: {
            type: 'signature',
            uid: 'signature_0',
            optional: false,
            value: '',
        },
    },
}
