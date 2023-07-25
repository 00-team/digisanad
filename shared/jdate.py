# jdatetime is (c) 2010-2011 Milad Rastian <eslashmili at gmail.com>.
# The jdatetime module was contributed to Python as of Python 2.7 and thus
# was licensed under the Python license. Same license applies to all files in
# the jdatetime package project.

import datetime as py_datetime
import locale as _locale
import platform
import re
from functools import partial as _partial

try:
    from greenlet import getcurrent as get_ident
except ImportError:
    from _thread import get_ident


# dervied from http://farsitools.sf.net
# Copyright (C) 2003-2011  Parspooyesh Fanavar (http://parspooyesh.com/)
# see LICENSE.txt
g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]


class GregorianToJalali:
    def __init__(self, gyear, gmonth, gday):
        """
        Convert gregorian date to jalali date
        gmonth: number of month in range 1-12
        """
        self.gyear = gyear
        self.gmonth = gmonth
        self.gday = gday
        self.__gregorianToJalali()

    def getJalaliList(self):
        return (self.jyear, self.jmonth, self.jday)

    def __gregorianToJalali(self):
        """
        g_y: gregorian year
        g_m: gregorian month
        g_d: gregorian day
        """
        global g_days_in_month, j_days_in_month

        gy = self.gyear - 1600
        gm = self.gmonth - 1
        gd = self.gday - 1

        g_day_no = 365 * gy + (gy + 3) // 4 - \
            (gy + 99) // 100 + (gy + 399) // 400

        for i in range(gm):
            g_day_no += g_days_in_month[i]
        if gm > 1 and ((gy % 4 == 0 and gy % 100 != 0) or (gy % 400 == 0)):
            # leap and after Feb
            g_day_no += 1
        g_day_no += gd

        j_day_no = g_day_no - 79

        j_np = j_day_no // 12053
        j_day_no %= 12053
        jy = 979 + 33 * j_np + 4 * int(j_day_no // 1461)

        j_day_no %= 1461

        if j_day_no >= 366:
            jy += (j_day_no - 1) // 365
            j_day_no = (j_day_no - 1) % 365

        for i in range(11):
            if not j_day_no >= j_days_in_month[i]:
                i -= 1
                break
            j_day_no -= j_days_in_month[i]

        jm = i + 2
        jd = j_day_no + 1

        self.jyear = jy
        self.jmonth = jm
        self.jday = jd


class JalaliToGregorian:
    def __init__(self, jyear, jmonth, jday):
        """
        Convert db time stamp (in gregorian date) to jalali date
        """
        self.jyear = jyear
        self.jmonth = jmonth
        self.jday = jday
        self.__jalaliToGregorian()

    def getGregorianList(self):
        return (self.gyear, self.gmonth, self.gday)

    def __jalaliToGregorian(self):
        global g_days_in_month, j_days_in_month
        jy = self.jyear - 979
        jm = self.jmonth - 1
        jd = self.jday - 1

        j_day_no = 365 * jy + int(jy // 33) * 8 + (jy % 33 + 3) // 4
        for i in range(jm):
            j_day_no += j_days_in_month[i]

        j_day_no += jd

        g_day_no = j_day_no + 79

        # 146097 = 365*400 + 400/4 - 400/100 + 400/400
        gy = 1600 + 400 * int(g_day_no // 146097)
        g_day_no = g_day_no % 146097

        leap = 1
        if g_day_no >= 36525:  # 36525 = 365*100 + 100/4
            g_day_no -= 1
            # 36524 = 365*100 + 100/4 - 100/100
            gy += 100 * int(g_day_no // 36524)
            g_day_no = g_day_no % 36524

            if g_day_no >= 365:
                g_day_no += 1
            else:
                leap = 0

        gy += 4 * int(g_day_no // 1461)  # 1461 = 365*4 + 4/4
        g_day_no %= 1461

        if g_day_no >= 366:
            leap = 0
            g_day_no -= 1
            gy += g_day_no // 365
            g_day_no = g_day_no % 365

        i = 0
        while g_day_no >= g_days_in_month[i] + (i == 1 and leap):
            g_day_no -= g_days_in_month[i] + (i == 1 and leap)
            i += 1
        self.gmonth = i + 1
        self.gday = g_day_no + 1
        self.gyear = gy


MINYEAR = 1
MAXYEAR = 9377

STRFTIME_MAPPING = {
    # A mapping between symbol to it's helper function and function kwargs
    # symbol: (helper_function_name, {kwargs})
    "%a": ("_strftime_get_method_value", {"attr": "jweekday_short", "fmt": "%s"}),
    "%A": ("_strftime_get_method_value", {"attr": "jweekday", "fmt": "%s"}),
    "%b": ("_strftime_get_method_value", {"attr": "jmonth_short", "fmt": "%s"}),
    "%B": ("_strftime_get_method_value", {"attr": "jmonth", "fmt": "%s"}),
    "%d": ("_strftime_get_attr_value", {"attr": "day", "fmt": "%02.d"}),
    "%-d": ("_strftime_get_attr_value", {"attr": "day", "fmt": "%d"}),
    "%j": ("_strftime_get_method_value", {"attr": "yday", "fmt": "%03.d"}),
    "%m": ("_strftime_get_attr_value", {"attr": "month", "fmt": "%02.d"}),
    "%-m": ("_strftime_get_attr_value", {"attr": "month", "fmt": "%d"}),
    "%w": ("_strftime_get_method_value", {"attr": "weekday", "fmt": "%d"}),
    "%W": ("_strftime_get_method_value", {"attr": "weeknumber", "fmt": "%d"}),
    "%Y": ("_strftime_get_attr_value", {"attr": "year", "fmt": "%d"}),
    "%y": ("_strftime_get_attr_value", {"attr": "cyear", "fmt": "%02.d"}),
    "%f": ("_strftime_get_attr_value", {"attr": "microsecond", "fmt": "%06.d", "fb": "000000"}),
    "%H": ("_strftime_get_attr_value", {"attr": "hour", "fmt": "%02.d", "fb": "00"}),
    "%-H": ("_strftime_get_attr_value", {"attr": "hour", "fmt": "%d", "fb": "0"}),
    "%I": ("_strftime_get_attr_value", {"attr": "hour", "fmt": "%02.d", "fb": "12"}),
    "%-I": ("_strftime_get_attr_value", {"attr": "hour", "fmt": "%d", "fb": "12"}),
    "%M": ("_strftime_get_attr_value", {"attr": "minute", "fmt": "%02.d", "fb": "00"}),
    "%-M": ("_strftime_get_attr_value", {"attr": "minute", "fmt": "%d", "fb": "0"}),
    "%S": ("_strftime_get_attr_value", {"attr": "second", "fmt": "%02.d", "fb": "00"}),
    "%-S": ("_strftime_get_attr_value", {"attr": "second", "fmt": "%d", "fb": "0"}),
    "%p": ("_strftime_p", {}),
    "%z": ("_strftime_z", {}),
    "%Z": ("_strftime_cap_z", {}),
}

timedelta = py_datetime.timedelta
tzinfo = py_datetime.tzinfo

if platform.system() == 'Windows':
    FA_LOCALE = 'Persian_Iran'
else:
    FA_LOCALE = 'fa_IR'


def _format_time(hour, minute, second, microsecond, timespec='auto'):
    specs = {
        'hours': '{:02d}',
        'minutes': '{:02d}:{:02d}',
        'seconds': '{:02d}:{:02d}:{:02d}',
        'milliseconds': '{:02d}:{:02d}:{:02d}.{:03d}',
        'microseconds': '{:02d}:{:02d}:{:02d}.{:06d}',
    }

    if timespec == 'auto':
        # Skip trailing microseconds when equals to 0
        timespec = 'microseconds' if microsecond else 'seconds'
    elif timespec == 'milliseconds':
        # convert to millisecond
        microsecond //= 1000

    try:
        fmt = specs[timespec]
    except KeyError:
        raise ValueError('Unknown timespec value: %s' % timespec)
    else:
        return fmt.format(hour, minute, second, microsecond)


class time(py_datetime.time):
    def __repr__(self):
        return f"jdatetime.time({self.hour}, {self.minute}, {self.second})"


_thread_local_locales = dict()


def set_locale(locale):
    """Set the thread local module locale. This will be the default locale
    for new date/datetime instances in current thread.
    Returns the previous value of locale set on current thread.

    Note: since Python thread identities maybe recycled and reused,
    always ensure the desied locale is set for current thread,
    or the locale maybe affected by previous threads with the same
    identity.

    :param str|None: locale
    :return: str|None
    """
    thread_identity = get_ident()
    prev_locale = _thread_local_locales.get(thread_identity)
    _thread_local_locales[thread_identity] = locale
    return prev_locale


def get_locale():
    """Get the thread local module locale. This will be the default locale
    for newly date/datetime instances in current thread.

    :return: str|None
    """
    return _thread_local_locales.get(get_ident())


class jdate:
    """date(year, month, day) --> date object"""
    j_months_en = [
        'Farvardin',
        'Ordibehesht',
        'Khordad',
        'Tir',
        'Mordad',
        'Shahrivar',
        'Mehr',
        'Aban',
        'Azar',
        'Dey',
        'Bahman',
        'Esfand',
    ]
    j_months_short_en = [
        'Far',
        'Ord',
        'Kho',
        'Tir',
        'Mor',
        'Sha',
        'Meh',
        'Aba',
        'Aza',
        'Dey',
        'Bah',
        'Esf',
    ]
    j_weekdays_en = [
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
    ]
    j_weekdays_short_en = [
        'Sat',
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
    ]
    j_ampm_en = {'PM': 'PM', 'AM': 'AM'}
    j_months_fa = [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
    ]
    j_weekdays_fa = [
        'شنبه',
        'یک‌شنبه',
        'دوشنبه',
        'سه‌شنبه',
        'چهارشنبه',
        'پنج‌شنبه',
        'جمعه',
    ]
    j_ampm_fa = {'PM': 'بعد از ظهر', 'AM': 'قبل از ظهر'}

    @property
    def year(self):
        return self.__year

    @property
    def cyear(self):
        return self.__year % 100

    @property
    def month(self):
        return self.__month

    @property
    def day(self):
        return self.__day

    def timetuple(self):
        "Return local time tuple compatible with time.localtime()."
        return self.togregorian().timetuple()

    @property
    def locale(self):
        return self.__locale

    __year = 0
    __month = 0
    __day = 0
    __locale = None

    def _check_arg(self, value):
        if isinstance(value, int):
            return True
        return False

    def __init__(self, year, month, day, **kwargs):
        """date(year, month, day) --> date object"""
        if not (self._check_arg(year) and self._check_arg(month) and self._check_arg(day)):
            raise TypeError("an integer is required" + repr(type(year)))
        if year < MINYEAR or year > MAXYEAR:
            raise ValueError("year is out of range")
        self.__year = year

        if month < 1 or month > 12:
            raise ValueError("month must be in 1..12")
        self.__month = month

        if day < 1:
            raise ValueError("day is out of range for month")
        if self.__month == 12 and day == 30 and self.isleap():
            # for leap years it's ok to have 30 days in Esfand
            pass
        elif self.__month == 12 and day == 30 and not self.isleap():
            raise ValueError("day is out of range for month")
        elif day > j_days_in_month[self.__month - 1]:
            raise ValueError("day is out of range for month")
        self.__day = day
        self.__locale = kwargs['locale'] if (
            'locale' in kwargs and kwargs['locale']) else get_locale()

        if self._is_fa_locale():
            self.j_months = self.j_months_fa
            self.j_months_short = self.j_months_fa
            self.j_weekdays = self.j_weekdays_fa
            self.j_weekdays_short = self.j_weekdays_fa
            self.j_ampm = self.j_ampm_fa
        else:
            self.j_months = self.j_months_en
            self.j_months_short = self.j_months_short_en
            self.j_weekdays = self.j_weekdays_en
            self.j_weekdays_short = self.j_weekdays_short_en
            self.j_ampm = self.j_ampm_en

    def _is_fa_locale(self):
        if self.__locale and self.__locale == FA_LOCALE:
            return True
        if FA_LOCALE in _locale.getlocale():
            return True
        if None not in _locale.getlocale():
            return False
        if FA_LOCALE in _locale.getdefaultlocale():
            return True
        return False

    """The smallest possible difference between
    non-equal date objects, timedelta(days=1)."""
    resolution = timedelta(1)

    def isleap(self):
        """check if year is leap year
            algortim is based on http://en.wikipedia.org/wiki/Leap_year"""
        return self.year % 33 in (1, 5, 9, 13, 17, 22, 26, 30)

    def togregorian(self):
        """Convert current jalali date to gregorian and return datetime.date"""
        (y, m, d) = JalaliToGregorian(self.year,
                                      self.month, self.day).getGregorianList()
        return py_datetime.date(y, m, d)

    @staticmethod
    def fromgregorian(**kw):
        """Convert gregorian to jalali and return jdatetime.date

        jdatetime.date.fromgregorian(day=X,month=X,year=X)
        jdatetime.date.fromgregorian(date=datetime.date)
        jdatetime.date.fromgregorian(date=datetime.date, locale='fa_IR')
        """
        locale = kw.get('locale')
        if 'date' in kw:
            d = kw['date']
            try:
                (y, m, d) = GregorianToJalali(
                    d.year, d.month, d.day).getJalaliList()
                return jdate(y, m, d, locale=locale)
            except AttributeError:
                raise ValueError(
                    'When calling fromgregorian(date=) the parameter should be a date like object.'
                )
        if 'day' in kw and 'month' in kw and 'year' in kw:
            (year, month, day) = (kw['year'], kw['month'], kw['day'])
            (y, m, d) = GregorianToJalali(year, month, day).getJalaliList()
            return jdate(y, m, d, locale=locale)

        error_msg = ["fromgregorian have to be be called"]
        error_msg += ["or"]
        error_msg += ["fromgregorian(day=X,month=X,year=X)"]
        error_msg += ["fromgregorian(date=datetime.date)"]
        raise ValueError(" ".join(error_msg))

    @staticmethod
    def today():
        """Current date or datetime:  same as self.__class__.fromtimestamp(time.time())."""
        to = py_datetime.date.today()
        (y, m, d) = GregorianToJalali(to.year, to.month, to.day).getJalaliList()
        return jdate(y, m, d)

    @staticmethod
    def fromtimestamp(timestamp):
        d = py_datetime.date.fromtimestamp(timestamp)
        (y, m, d) = GregorianToJalali(d.year, d.month, d.day).getJalaliList()
        return jdate(y, m, d)

    @staticmethod
    def fromisoformat(date_string: str):
        """
        Convert an ISO 8601 formatted string to a jdatetime.date
        """
        if not isinstance(date_string, str):
            raise TypeError("fromisoformat: argument must be str")

        iso_format_regex = r"(\d{4})-(\d{2})-(\d{2})"
        matched_str = re.fullmatch(iso_format_regex, date_string)
        if matched_str is not None:
            y, m, d = list(map(int, date_string.split('-')))
            return jdate(y, m, d)
        else:
            raise ValueError(f'Invalid isoformat string: {date_string!r}')

    def toordinal(self):
        """Return proleptic jalali ordinal. Farvardin 1 of year 1 which is equal to 622-3-21 of Gregorian."""
        d = self.togregorian()
        return d.toordinal() - 226894

    @staticmethod
    def fromordinal(ordinal):
        """int -> date corresponding to a proleptic Jalali ordinal.
           it starts from Farvardin 1 of year 1, which is equal to 622-3-21 of Gregorian"""
        if ordinal < 1:
            raise ValueError("ordinal must be >= 1")
        d = py_datetime.date.fromordinal(226894 + ordinal)
        (y, m, d) = GregorianToJalali(d.year, d.month, d.day).getJalaliList()
        return jdate(y, m, d)

    @staticmethod
    def j_month_to_num(month_name):
        return jdate.j_months_en.index(month_name.lower().capitalize()) + 1

    @staticmethod
    def j_month_short_to_num(month_name):
        return jdate.j_months_short_en.index(month_name.lower().capitalize()) + 1

    @staticmethod
    def j_month_fa_to_num(month_name):
        return jdate.j_months_fa.index(month_name) + 1

    def __repr__(self):
        return f"jdatetime.date({self.year}, {self.month}, {self.day})"

    def __str__(self):
        return self.strftime("%Y-%m-%d")

    def __add__(self, timedelta):
        """x.__add__(y) <==> x+y"""
        if isinstance(timedelta, py_datetime.timedelta):
            return jdate.fromgregorian(date=self.togregorian() + timedelta, locale=self.locale)
        raise TypeError(
            "unsupported operand type(s) for +: '%s' and '%s'" %
            (type(self), type(timedelta))
        )

    def __sub__(self, other):
        """x.__sub__(y) <==> x-y"""

        if isinstance(other, py_datetime.timedelta):
            return jdate.fromgregorian(date=self.togregorian() - other, locale=self.locale)
        if isinstance(other, py_datetime.date):
            return self.togregorian() - other
        if isinstance(other, jdate):
            return self.togregorian() - other.togregorian()

        raise TypeError(
            "unsupported operand type(s) for -: '%s' and '%s'" %
            (type(self), type(timedelta))
        )

    def __radd__(self, timedelta):
        """x.__radd__(y) <==> y+x"""
        if isinstance(timedelta, py_datetime.timedelta):
            return self.__add__(timedelta)
        raise TypeError(
            "unsupported operand type for +: '%s' and '%s'" %
            (type(timedelta), type(self))
        )

    def __rsub__(self, other):
        """x.__rsub__(y) <==> y-x"""
        if isinstance(other, jdate):
            return other.__sub__(self)
        if isinstance(other, py_datetime.date):
            return other - self.togregorian()
        raise TypeError(
            "unsupported operand type for -: '%s' and '%s'" %
            (type(other), type(self))
        )

    def __eq__(self, other_date):
        """x.__eq__(y) <==> x==y"""
        if other_date is None:
            return False
        if isinstance(other_date, py_datetime.date):
            return self.__eq__(jdate.fromgregorian(date=other_date))
        if not isinstance(other_date, jdate):
            return False
        if (
            self.year == other_date.year and
            self.month == other_date.month and
            self.day == other_date.day and
            self.locale == other_date.locale
        ):
            return True
        return False

    def __ge__(self, other_date):
        """x.__ge__(y) <==> x>=y"""
        if isinstance(other_date, py_datetime.date):
            return self.__ge__(jdate.fromgregorian(date=other_date))
        if not isinstance(other_date, jdate):
            raise TypeError(
                "unsupported operand type for >=: '%s'" %
                (type(other_date)))

        if self.year > other_date.year:
            return True
        elif self.year == other_date.year:
            if self.month > other_date.month:
                return True
            elif self.month == other_date.month and self.day >= other_date.day:
                return True
        return False

    def __gt__(self, other_date):
        """x.__gt__(y) <==> x>y"""
        if isinstance(other_date, py_datetime.date):
            return self.__gt__(jdate.fromgregorian(date=other_date))
        if not isinstance(other_date, jdate):
            raise TypeError(
                "unsupported operand type for >: '%s'" %
                (type(other_date))
            )

        if self.year > other_date.year:
            return True
        elif self.year == other_date.year:
            if self.month > other_date.month:
                return True
            elif self.month >= other_date.month and self.day > other_date.day:
                return True
        return False

    def __le__(self, other_date):
        """x.__le__(y) <==> x<=y"""
        if isinstance(other_date, py_datetime.date):
            return self.__le__(jdate.fromgregorian(date=other_date))
        if not isinstance(other_date, jdate):
            raise TypeError(
                "unsupported operand type for <=: '%s'" %
                (type(other_date))
            )

        return not self.__gt__(other_date)

    def __lt__(self, other_date):
        """x.__lt__(y) <==> x<y"""
        if isinstance(other_date, py_datetime.date):
            return self.__lt__(jdate.fromgregorian(date=other_date))
        if not isinstance(other_date, jdate):
            raise TypeError(
                "unsupported operand type for <: '%s'" %
                (type(other_date))
            )

        return not self.__ge__(other_date)

    def __ne__(self, other_date):
        """x.__ne__(y) <==> x!=y"""
        if other_date is None:
            return True
        if isinstance(other_date, py_datetime.date):
            return self.__ne__(jdate.fromgregorian(date=other_date))
        if not isinstance(other_date, jdate):
            return True

        return not self.__eq__(other_date)

    def __hash__(self):
        """x.__hash__() <==> hash(x)"""
        gd = self.togregorian()
        return gd.__hash__()

    def ctime(self):
        """Return ctime() style string."""
        return self.strftime("%c")

    def replace(self, year=0, month=0, day=0):
        """Return date with new specified fields."""
        new_year = self.year
        new_month = self.month
        new_day = self.day

        if year != 0:
            new_year = year
        if month != 0:
            new_month = month
        if day != 0:
            new_day = day

        return jdate(new_year, new_month, new_day, locale=self.locale)

    def yday(self):
        """return day of year"""
        day = 0
        for i in range(0, self.month - 1):
            day = day + j_days_in_month[i]
        day = day + self.day
        return day

    def weekday(self):
        """Return the day of the week represented by the date.
        Shanbeh == 0 ... Jomeh == 6"""
        gd = self.togregorian()
        return (gd.weekday() - 5) % 7

    def isoweekday(self):
        """Return the day of the week as an integer, where Shanbeh is 1 and Jomeh is 7"""
        return self.weekday() + 1

    def jweekday_short(self):
        return self.j_weekdays_short[self.weekday()]

    def jweekday(self):
        return self.j_weekdays[self.weekday()]

    def weeknumber(self):
        """Return week number """
        return (self.yday() + jdate(self.year, 1, 1).weekday() - 1) // 7 + 1

    def jmonth_short(self):
        return self.j_months_short[self.month - 1]

    def jmonth(self):
        return self.j_months[self.month - 1]

    def isocalendar(self):
        """Return a 3-tuple, (ISO year, ISO week number, ISO weekday)."""
        return (self.year, self.weeknumber(), self.isoweekday())

    def isoformat(self):
        """Return a string representing the date in ISO 8601 format, 'YYYY-MM-DD'"""
        return self.strftime("%Y-%m-%d")

    def __format__(self, format):
        """
        PEP-3101
        Make string formating work!
        """
        return self.strftime(format)

    # strftime helper functions
    def _strftime_get_attr_value(self, format, symbol, attr, fmt, fb=None):
        try:
            return format.replace(symbol, fmt % getattr(self, attr))
        except Exception:
            return format.replace(symbol, fb)

    def _strftime_get_method_value(self, format, symbol, attr, fmt):
        return format.replace(symbol, fmt % getattr(self, attr)())

    def _strftime_p(self, format, **kwrgs):
        try:
            if self.hour >= 12:
                return format.replace("%p", self.j_ampm['PM'])
            return format.replace("%p", self.j_ampm['AM'])
        except Exception:
            return format.replace("%p", self.j_ampm['AM'])

    def _strftime_z(self, format, **kwrgs):
        try:
            sign = "+"
            diff = self.utcoffset()
            diff_sec = diff.seconds
            if diff.days > 0 or diff.days < -1:
                raise ValueError(
                    "tzinfo.utcoffset() returned big time delta! ; must be in -1439 .. 1439"
                )
            if diff.days != 0:
                sign = "-"
                diff_sec = (1 * 24 * 60 * 60) - diff_sec
            tmp_min = diff_sec / 60
            diff_hour = tmp_min / 60
            diff_min = tmp_min % 60
            return format.replace("%z", '%s%02.d%02.d' % (sign, diff_hour, diff_min))
        except AttributeError:
            return format.replace("%z", '')

    def _strftime_cap_z(self, format, **kwrgs):
        if hasattr(self, 'tzname') and self.tzname() is not None:
            return format.replace("%Z", self.tzname())
        else:
            return format.replace("%Z", '')

    def strftime(self, format):
        # Convert to unicode
        try:
            format = format.decode('utf-8')
        except Exception:
            pass

        symbols = {
            "%c": "%a %b %d %H:%M:%S %Y",
            "%x": "%m/%d/%y",
            "%X": "%H:%M:%S",
        }
        for s, r in symbols.items():
            format = format.replace(s, r)

        for symbol in re.findall(r"\%-?[a-zA-z-]", format):
            if symbol in STRFTIME_MAPPING:
                replace_method_name, kwargs = STRFTIME_MAPPING[symbol]
                kwargs.update({"format": format, "symbol": symbol})
                format = getattr(self, replace_method_name)(**kwargs)
        return format

    def aslocale(self, locale):
        return jdate(self.year, self.month, self.day, locale=locale)


"""The earliest representable date, date(MINYEAR, 1, 1)"""
jdate.min = jdate(MINYEAR, 1, 1)

"""The latest representable date, date(MAXYEAR, 12, 31)."""
jdate.max = jdate(MAXYEAR, 12, 30)

_DIRECTIVE_PATTERNS = {
    '%Y': r'(?P<Y>\d{4})',
    '%y': r'(?P<y>\d{2})',
    '%m': r'(?P<m>\d{1,2})',
    '%d': r'(?P<d>\d{1,2})',
    '%H': r'(?P<H>\d{1,2})',
    '%M': r'(?P<M>\d{1,2})',
    '%S': r'(?P<S>\d{1,2})',
    '%f': r'(?P<f>\d{1,6})',
    '%B': r'(?P<B>[a-zA-Z\u0600-\u06EF\uFB8A\u067E\u0686\u06AF]{2,12})',
    '%b': r'(?P<b>[a-zA-Z]{3})',
    '%z': r'(?P<z>[+-]\d\d:?[0-5\u06F0-\u06F5]\d(:?[0-5\u06F0-\u06F5]\d(\.\d{1,6})?)?)',
}

# Replace directives with patterns according to _DIRECTIVE_PATTERNS
_directives_to_pattern = _partial(
    re.compile('|'.join(_DIRECTIVE_PATTERNS)).sub,
    lambda match: _DIRECTIVE_PATTERNS[match.group()]
)


class jdatetime(jdate):
    """datetime(
        year, month, day, [hour, [minute, [seconds, [microsecond, [tzinfo]]]]]
    )-> datetime objects"""
    __time = None

    def time(self):
        """Return time object with same time but with tzinfo=None."""
        return time(self.hour, self.minute, self.second, self.microsecond, fold=self.fold)

    def date(self):
        """Return date object with same year, month and day."""
        return jdate(self.year, self.month, self.day, locale=self.locale)

    def __init__(
        self,
        year,
        month,
        day,
        hour=None,
        minute=None,
        second=None,
        microsecond=None,
        tzinfo=None,
        *,
        fold=0,
        **kwargs,
    ):
        jdate.__init__(self, year, month, day, **kwargs)
        tmp_hour = 0
        tmp_min = 0
        tmp_sec = 0
        tmp_micr = 0
        if hour is not None:
            tmp_hour = hour
        if minute is not None:
            tmp_min = minute
        if second is not None:
            tmp_sec = second
        if microsecond is not None:
            tmp_micr = microsecond

        if fold not in (0, 1):
            raise ValueError('fold must be either 0 or 1', fold)
        self._fold = fold

        if not (
            self._check_arg(tmp_hour) and
            self._check_arg(tmp_min) and
            self._check_arg(tmp_sec) and
            self._check_arg(tmp_micr)
        ):
            raise TypeError("an integer is required")

        self.__time = time(tmp_hour, tmp_min, tmp_sec,
                           tmp_micr, tzinfo, fold=fold)

    def __repr__(self):
        if self.__time.tzinfo is not None:
            return "jdatetime.datetime({}, {}, {}, {}, {}, {}, {}, tzinfo={})".format(
                self.year,
                self.month,
                self.day, self.hour,
                self.minute,
                self.second,
                self.microsecond,
                self.tzinfo,
            )

        if self.__time.microsecond != 0:
            return "jdatetime.datetime({}, {}, {}, {}, {}, {}, {})".format(
                self.year,
                self.month,
                self.day,
                self.hour,
                self.minute,
                self.second,
                self.microsecond,
            )

        if self.__time.second != 0:
            return "jdatetime.datetime({}, {}, {}, {}, {}, {})".format(
                self.year,
                self.month,
                self.day,
                self.hour,
                self.minute,
                self.second,
            )

        return "jdatetime.datetime({}, {}, {}, {}, {})".format(
            self.year, self.month, self.day, self.hour, self.minute
        )

    @staticmethod
    def today():
        """Current date or datetime"""
        return jdatetime.now()

    @staticmethod
    def now(tz=None):
        """[tz] -> new datetime with tz's local day and time."""
        now_datetime = py_datetime.datetime.now(tz)
        now = jdate.fromgregorian(date=now_datetime.date())
        return jdatetime(
            now.year,
            now.month,
            now.day,
            now_datetime.hour,
            now_datetime.minute,
            now_datetime.second,
            now_datetime.microsecond,
            tz,
        )

    @staticmethod
    def utcnow():
        """Return a new datetime representing UTC day and time."""
        now_datetime = py_datetime.datetime.utcnow()
        now = jdate.fromgregorian(date=now_datetime.date())
        return jdatetime(
            now.year,
            now.month,
            now.day,
            now_datetime.hour,
            now_datetime.minute,
            now_datetime.second,
            now_datetime.microsecond,
        )

    @staticmethod
    def fromtimestamp(timestamp, tz=None):
        """timestamp[, tz] -> tz's local time from POSIX timestamp."""
        now_datetime = py_datetime.datetime.fromtimestamp(timestamp, tz)
        now = jdate.fromgregorian(date=now_datetime.date())
        return jdatetime(
            now.year,
            now.month,
            now.day,
            now_datetime.hour,
            now_datetime.minute,
            now_datetime.second,
            now_datetime.microsecond,
            tz,
        )

    @staticmethod
    def utcfromtimestamp(timestamp):
        """timestamp -> UTC datetime from a POSIX timestamp (like time.time())."""
        now_datetime = py_datetime.datetime.fromtimestamp(timestamp)
        now = jdate.fromgregorian(date=now_datetime.date())
        return jdatetime(
            now.year,
            now.month,
            now.day,
            now_datetime.hour,
            now_datetime.minute,
            now_datetime.second,
            now_datetime.microsecond,
        )

    @staticmethod
    def combine(d=None, t=None, **kw):
        """date, time -> datetime with same date and time fields"""

        c_date = None
        if d is not None:
            c_date = d
        elif 'date' in kw:
            c_date = kw['date']

        c_time = None
        if t is not None:
            c_time = t
        elif 'time' in kw:
            c_time = kw['time']

        if c_date is None:
            raise TypeError("Required argument 'date' (pos 1) not found")
        if c_time is None:
            raise TypeError("Required argument 'time' (pos 2) not found")

        if not isinstance(c_date, jdate):
            raise TypeError(
                "combine() argument 1 must be jdatetime.date, not %s" %
                (type(c_date))
            )
        if not isinstance(c_time, time):
            raise TypeError(
                "combine() argument 2 must be jdatetime.time, not %s" %
                (type(c_time))
            )

        return jdatetime(
            c_date.year,
            c_date.month,
            c_date.day,
            c_time.hour,
            c_time.minute,
            c_time.second,
            c_time.microsecond,
            c_time.tzinfo,
            locale=c_date.locale,
            fold=c_time.fold,
        )

    def timestamp(self):
        return self.togregorian().timestamp()

    @staticmethod
    def fromordinal(ordinal):
        """int -> date corresponding to a proleptic Jalali ordinal.
           it starts from Farvardin 1 of year 1, which is equal to 622-3-21 of Gregorian
        """
        if ordinal < 1:
            raise ValueError("ordinal must be >= 1")
        d = py_datetime.date.fromordinal(226894 + ordinal)
        j_date = jdate.fromgregorian(date=d)
        return jdatetime(j_date.year, j_date.month, j_date.day, 0, 0)

    @property
    def hour(self):
        return self.__time.hour

    @property
    def minute(self):
        return self.__time.minute

    @property
    def second(self):
        return self.__time.second

    @property
    def microsecond(self):
        return self.__time.microsecond

    @property
    def tzinfo(self):
        return self.__time.tzinfo

    @property
    def fold(self):
        return self._fold

    @staticmethod
    def strptime(date_string, format):
        """string, format -> new datetime parsed from a string (like time.strptime())"""
        regex = _directives_to_pattern(re.escape(format))

        match = re.fullmatch(regex, date_string)
        if match is None:
            raise ValueError(
                "time data '%s' does not match format '%s'" %
                (date_string, format)
            )

        get = match.groupdict().get

        year = int(get('Y') or get('y') or 1279)
        if year < 100:  # %y, see the discussion at #100
            year += 1400 if year <= 68 else 1300
        month = get('B') or get('b') or int(get('m', 1))
        if isinstance(month, str):
            try:
                if get('b'):
                    month = jdate.j_month_short_to_num(month_name=month)
                elif month.isascii():
                    month = jdate.j_month_to_num(month_name=month)
                else:
                    month = jdate.j_month_fa_to_num(month_name=month)
            except ValueError:
                raise ValueError(
                    "time data '%s' does not match format '%s'" %
                    (date_string, format)
                )

        timezone_string = get('z', None)
        timezone = jdatetime._timezone_from_string(timezone_string)

        return jdatetime(
            year,
            month,
            int(get('d', 1)),
            int(get('H', 0)),
            int(get('M', 0)),
            int(get('S', 0)),
            None if get('f') is None else int('{:0<6}'.format(get('f'))),
            timezone,
        )

    def replace(
        self,
        year=None,
        month=None,
        day=None,
        hour=None,
        minute=None,
        second=None,
        microsecond=None,
        tzinfo=True,
        fold=None,
    ):
        """Return datetime with new specified fields."""
        t_year = self.year
        if year is not None:
            t_year = year

        t_month = self.month
        if month is not None:
            t_month = month

        t_day = self.day
        if day is not None:
            t_day = day

        t_hour = self.hour
        if hour is not None:
            t_hour = hour

        t_min = self.minute
        if minute is not None:
            t_min = minute

        t_sec = self.second
        if second is not None:
            t_sec = second

        t_mic = self.microsecond
        if microsecond is not None:
            t_mic = microsecond

        t_tz = self.tzinfo
        if tzinfo is not True:
            t_tz = tzinfo

        if fold is None:
            fold = self._fold

        return jdatetime(
            t_year,
            t_month,
            t_day,
            t_hour,
            t_min,
            t_sec,
            t_mic,
            t_tz,
            locale=self.locale,
            fold=fold,
        )

    def __add__(self, timedelta):
        """x.__add__(y) <==> x+y"""
        if isinstance(timedelta, py_datetime.timedelta):
            return jdatetime.fromgregorian(datetime=self.togregorian() + timedelta, locale=self.locale)
        raise TypeError(
            "unsupported operand type(s) for +: '%s' and '%s'" %
            (type(self), type(timedelta)))

    def __sub__(self, other):
        """x.__sub__(y) <==> x-y"""

        if isinstance(other, py_datetime.timedelta):
            return jdatetime.fromgregorian(datetime=self.togregorian() - other, locale=self.locale)
        if isinstance(other, py_datetime.datetime):
            return self.togregorian() - other
        if isinstance(other, jdatetime):
            return self.togregorian() - other.togregorian()
        raise TypeError(
            "unsupported operand type(s) for -: '%s' and '%s'" %
            (type(self), type(other))
        )

    def __radd__(self, timedelta):
        """x.__radd__(y) <==> y+x"""
        if isinstance(timedelta, py_datetime.timedelta):
            return self.__add__(timedelta)
        raise TypeError(
            "unsupported operand type for +: '%s' and '%s'" %
            (type(timedelta), type(self))
        )

    def __rsub__(self, other):
        """x.__rsub__(y) <==> y-x"""
        if isinstance(other, jdatetime):
            return other.__sub__(self)
        if isinstance(other, py_datetime.datetime):
            return other - self.togregorian()
        raise TypeError(
            "unsupported operand type for -: '%s' and '%s'" %
            (type(other), type(self))
        )

    def __eq__(self, other_datetime):
        """x.__eq__(y) <==> x==y"""
        if other_datetime is None:
            return False
        if isinstance(other_datetime, py_datetime.datetime):
            return self.__eq__(jdatetime.fromgregorian(datetime=other_datetime))
        if not isinstance(other_datetime, jdatetime):
            return False
        if (
            self.year == other_datetime.year and
            self.month == other_datetime.month and
            self.day == other_datetime.day and
            self.locale == other_datetime.locale
        ):
            return (
                self.timetz() == other_datetime.timetz() and
                self.microsecond == other_datetime.microsecond
            )
        return False

    def __ge__(self, other_datetime):
        """x.__ge__(y) <==> x>=y"""
        if isinstance(other_datetime, py_datetime.datetime):
            return self.__ge__(jdatetime.fromgregorian(datetime=other_datetime))
        if not isinstance(other_datetime, jdatetime):
            raise TypeError(
                "unsupported operand type for >=: '%s'" %
                (type(other_datetime))
            )

        return (
            self.year,
            self.month,
            self.day,
            self.hour,
            self.minute,
            self.second,
            self.microsecond,
        ) >= (
            other_datetime.year,
            other_datetime.month,
            other_datetime.day,
            other_datetime.hour,
            other_datetime.minute,
            other_datetime.second,
            other_datetime.microsecond,
        )

    def __gt__(self, other_datetime):
        """x.__gt__(y) <==> x>y"""
        if isinstance(other_datetime, py_datetime.datetime):
            return self.__gt__(jdatetime.fromgregorian(datetime=other_datetime))
        if not isinstance(other_datetime, jdatetime):
            raise TypeError(
                "unsupported operand type for >: '%s'" %
                (type(other_datetime)))

        return (
            self.year,
            self.month,
            self.day,
            self.hour,
            self.minute,
            self.second,
            self.microsecond
        ) > (
            other_datetime.year,
            other_datetime.month,
            other_datetime.day,
            other_datetime.hour,
            other_datetime.minute,
            other_datetime.second,
            other_datetime.microsecond,
        )

    def __hash__(self):
        """x.__hash__() <==> hash(x)"""
        gdt = self.togregorian()
        return gdt.__hash__()

    def __le__(self, other_datetime):
        """x.__le__(y) <==> x<=y"""
        if isinstance(other_datetime, py_datetime.datetime):
            return self.__le__(jdatetime.fromgregorian(datetime=other_datetime))
        if not isinstance(other_datetime, jdatetime):
            raise TypeError(
                "unsupported operand type for <=: '%s'" %
                (type(other_datetime))
            )

        return not self.__gt__(other_datetime)

    def __lt__(self, other_datetime):
        """x.__lt__(y) <==> x<y"""
        if isinstance(other_datetime, py_datetime.datetime):
            return self.__lt__(jdatetime.fromgregorian(datetime=other_datetime))
        if not isinstance(other_datetime, jdatetime):
            raise TypeError(
                "unsupported operand type for <: '%s'" %
                (type(other_datetime))
            )
        return not self.__ge__(other_datetime)

    def __ne__(self, other_datetime):
        """x.__ne__(y) <==> x!=y"""
        if other_datetime is None:
            return True
        if isinstance(other_datetime, py_datetime.datetime):
            return self.__ne__(jdatetime.fromgregorian(datetime=other_datetime))
        if not isinstance(other_datetime, jdatetime):
            return True

        return not self.__eq__(other_datetime)

    @staticmethod
    def fromgregorian(**kw):
        """Convert gregorian to jalali and return jadatetime.datetime
        jadatetime.date.fromgregorian(day=X,month=X,year=X,[hour=X, [minute=X, [second=X, [tzinfo=X]]]])
        jadatetime.date.fromgregorian(date=datetime.date)
        jadatetime.date.fromgregorian(datetime=datetime.date)
        jadatetime.date.fromgregorian(datetime=datetime.datetime)
        jadatetime.date.fromgregorian(datetime=datetime.datetime, locale='fa_IR')
        """
        locale = kw.get('locale')
        date_param = kw.get('date') or kw.get('datetime')
        if date_param:
            try:
                (y, m, d) = GregorianToJalali(
                    date_param.year,
                    date_param.month,
                    date_param.day
                ).getJalaliList()
            except AttributeError:
                raise ValueError(
                    'When calling fromgregorian(date=) or fromgregorian(datetime=) '
                    'the parameter should be date like.'
                )
            try:
                return jdatetime(
                    y,
                    m,
                    d,
                    date_param.hour,
                    date_param.minute,
                    date_param.second,
                    date_param.microsecond,
                    date_param.tzinfo,
                    locale=locale,
                )
            except AttributeError:
                return jdatetime(y, m, d, locale=locale)

        if 'day' in kw and 'month' in kw and 'year' in kw:
            (year, month, day) = (kw['year'], kw['month'], kw['day'])
            (y, m, d) = GregorianToJalali(year, month, day).getJalaliList()
            hour = None
            minute = None
            second = None
            microsecond = None
            tzinfo = None
            if 'hour' in kw:
                hour = kw['hour']
                if 'minute' in kw:
                    minute = kw['minute']
                    if 'second' in kw:
                        second = kw['second']
                        if 'microsecond' in kw:
                            microsecond = kw['microsecond']
                            if 'tzinfo' in kw:
                                tzinfo = kw['tzinfo']
            return jdatetime(y, m, d, hour, minute, second, microsecond, tzinfo, locale=locale)

        raise ValueError(
            "fromgregorian have to called fromgregorian"
            "(day=X,month=X,year=X, [hour=X, [minute=X, [second=X, [tzinfo=X]]]]) "
            "or fromgregorian(date=datetime.date) or fromgregorian(datetime=datetime.datetime)"
        )

    def togregorian(self):
        """Convert current jalali date to gregorian and return datetime.datetime"""
        gdate = jdate.togregorian(self)
        return py_datetime.datetime.combine(gdate, self.__time)

    def astimezone(self, tz):
        """tz -> convert to local time in new timezone tz"""
        gdt = self.togregorian()
        gdt = gdt.astimezone(tz)
        return jdatetime.fromgregorian(datetime=gdt)

    def ctime(self):
        """Return ctime() style string."""
        return self.strftime("%c")

    def dst(self):
        """
        Return the daylight saving time (DST) adjustment
        Return self.tzinfo.dst(self)
        """

        if self.tzinfo:
            return self.tzinfo.dst(self)
        return None

    def isoformat(self, sep='T', timespec='auto'):
        """[sep] -> string in ISO 8601 format,
        YYYY-MM-DDTHH:MM:SS[.mmmmmm][+HH:MM]."""

        assert isinstance(sep, str) and len(sep) == 1, \
            f'argument 1 must be a single character: {sep}'

        tz = self.strftime("%z")

        date_ = self.strftime("%Y-%m-%d")
        time_ = _format_time(self.hour, self.minute,
                             self.second, self.microsecond, timespec)

        return f'{date_}{sep}{time_}{tz}'

    def timetuple(self):
        """Return time tuple, compatible with time.localtime().
        It returns Gregorian object!
        """
        dt = self.togregorian()
        return dt.timetuple()

    def timetz(self):
        """Return time object with same time and tzinfo."""
        return self.__time

    def tzname(self):
        """Return self.tzinfo.tzname(self)"""
        if self.tzinfo:
            return self.tzinfo.tzname(self.togregorian())
        return None

    def utcoffset(self):
        """Return self.tzinfo.utcoffset(self)."""
        if self.tzinfo:
            return self.tzinfo.utcoffset(self.togregorian())

    def utctimetuple(self):
        """Return UTC time tuple, compatible with time.localtime().
        It returns Gregorian object !
        """
        dt = self.togregorian()
        return dt.utctimetuple()

    def __str__(self):
        if self.microsecond == 0:
            mil = ""
        else:
            mil = "." + str(self.microsecond)
        tz = self.strftime("%z")
        return self.strftime("%Y-%m-%d %H:%M:%S") + f"{mil}{tz}"

    def aslocale(self, locale):
        return jdatetime(
            self.year,
            self.month,
            self.day,
            self.hour,
            self.minute,
            self.second,
            self.microsecond,
            tzinfo=self.tzinfo,
            locale=locale,
        )

    @staticmethod
    def _timezone_from_string(timezone_string):
        if timezone_string is None:
            return None
        # keep the original string for value error exception.
        z = timezone_string
        if z[3] == ':':
            z = z[:3] + z[4:]
            if len(z) > 5:
                if z[5] != ':':
                    msg = f"Inconsistent use of : in {timezone_string}"
                    raise ValueError(msg)
                z = z[:5] + z[6:]
        hours = int(z[1:3])
        minutes = int(z[3:5])
        seconds = int(z[5:7] or 0)
        gmtoff = (hours * 60 * 60) + (minutes * 60) + seconds
        gmtoff_remainder = z[8:]
        # Pad to always return microseconds.
        gmtoff_remainder_padding = "0" * (6 - len(gmtoff_remainder))
        gmtoff_fraction = int(gmtoff_remainder + gmtoff_remainder_padding)
        if z.startswith("-"):
            gmtoff = -gmtoff
            gmtoff_fraction = -gmtoff_fraction
        timezone = py_datetime.timezone(
            timedelta(seconds=gmtoff, microseconds=gmtoff_fraction))
        return timezone
