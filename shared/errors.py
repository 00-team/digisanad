
from fastapi.responses import JSONResponse


class Error(Exception):
    def __init__(
        self, code: int, title: str, msg: str,
        status=400, headers={}, extra={},
    ):

        self.code = code
        self.title = title
        self.msg = msg
        self.status = status
        self.headers = headers

        if not isinstance(extra, dict):
            raise TypeError('invalid extra')

        self.extra = extra

    @property
    def schema(self):
        extra = {
            'title': 'Extra',
            'type': 'object',
            'properties': {},
        }

        for k, v in self.extra.items():
            if isinstance(v, (tuple, list)):
                t = 'array'
            elif isinstance(v, dict):
                t = 'object'
            elif isinstance(v, str):
                t = 'string'
            elif isinstance(v, (float, int)):
                t = 'number'
            elif isinstance(v, bool):
                t = 'boolean'
            else:
                t = 'any'

            extra['properties'][k] = {'type': t}

        return {
            'title': 'Error',
            'type': 'object',
            'required': ['code', 'status', 'message', 'title', 'extra'],
            'properties': {
                'code': {'type': 'integer'},
                'message': {'type': 'string'},
                'status': {'type': 'integer'},
                'title': {'type': 'string'},
                'extra': extra,
            },
            'example': {
                'code': self.code,
                'message': self.msg,
                'status': self.status,
                'title': self.title,
                'extra': self.extra,
            }
        }

    def json(self):
        return JSONResponse(
            status_code=self.status,
            content={
                'code': self.code,
                'title': self.title,
                'status': self.status,
                'message': self.msg,
                'extra': self.extra
            },
            headers=self.headers
        )

    def __call__(self, *args, **kwargs):
        msg = kwargs.pop('msg', self.msg)
        headers = kwargs.pop('headers', {})

        obj = Error(
            headers=headers,
            code=self.code,
            title=self.title,
            msg=msg.format(*args, **kwargs),
            status=self.status,
            extra=kwargs,
        )

        return obj


bad_verification = Error(
    40002, 'Bad Verification',
    'invalid verification code', 400
)
no_change = Error(40003, 'No Change', 'there is nothing to change', 400)
bad_id = Error(
    40004, 'Bad ID', 'invalid {} ID {}', 404,
    extra={'id': 7}
)
bad_auth = Error(40005, 'invalid authentication credentials', 403)
forbidden = Error(40006, 'Forbidden', 'Not Enough Permissions', 403)
rate_limited = Error(40007, 'Rate Limited', 'Too Many Requests', 429)
bad_args = Error(40009, 'Bad Args', 'invalid args', 400)
register_required = Error(
    40010, 'Register Required',
    'you need to register first in order to login!', 403
)
account_exists = Error(
    40011, 'Account Exists',
    'an account has been registered with this phone number already!',
    400
)
bad_balance = Error(
    40012, 'Bad Balance',
    'not enough balance in this wallet for transfer',
    400
)
bad_file = Error(
    40013, 'Bad File',
    'invalid or unknown file',
    400
)
closed_contract = Error(
    40014,
    'Closed Contract',
    'this contract is closed.',
    400
)

contract_new_field = Error(
    41001, 'Contract New Field',
    "contract can't have new fields after stage change", 400
)
contract_lock_field = Error(
    41002, 'Contract Lock Field',
    "contract field is locked", 400
)
contract_invalid_changer = Error(
    41003, 'Contract Invalid Changer',
    "contract changers are invalid", 400
)
contract_invalid_price = Error(
    41004, 'Contract Invalid Price',
    "contract price is invalid", 400
)

database_error = Error(50001, 'Database Error', 'Database Error', 500)


all_errors = [
    forbidden, bad_verification,
    no_change, bad_id, bad_auth, rate_limited,
    bad_args, register_required, account_exists,
    bad_balance, bad_file, closed_contract,

    contract_new_field, contract_invalid_changer,
    contract_lock_field, contract_invalid_price,

    database_error
]
