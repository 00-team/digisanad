
import httpx

from shared import settings

BASE_API = 'https://console.melipayamak.com/api'


async def send_code_sms(phone: str, code: str):
    if settings.debug:
        print(
            '--------------------\n'
            f'phone: {phone}\ncode: {code}\n'
            '--------------------'
        )
        return

    httpx.post(
        f'{BASE_API}/send/simple/{settings.meilisms_tokne}',
        json={
            'from': '50004001777036',
            'to': phone,
            'text': f'کد ورود شما به دیجی سند: {code}'
        }
    )
