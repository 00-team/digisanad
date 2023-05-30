
from shared import settings
from shared.tools import isallnum


class VerificationCode(str):

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(
            examples=['99999', '12345'],
            maxLength=settings.verification_code_len,
            minLength=settings.verification_code_len
        )

    @classmethod
    def validate(cls, value):
        if not isinstance(value, str):
            raise TypeError('string required')

        if len(value) != settings.verification_code_len:
            raise ValueError('invalid code length')

        if not isallnum(value):
            raise ValueError('code must be all number')

        return value

    def __repr__(self):
        return f'VerificationCode({super().__repr__()})'


class PhoneNumber(str):

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(
            examples=['09223334444', '09123456789'],
            maxLength=11,
            minLength=11
        )

    @classmethod
    def validate(cls, value):
        if not isinstance(value, str):
            raise TypeError('string required')

        if len(value) != 11:
            raise ValueError('invalid phone number length')

        if value[:2] != '09' or not isallnum(value):
            raise ValueError('invalid phone number string')

        return value

    def __repr__(self):
        return f'PhoneNumber({super().__repr__()})'


class NationalID(str):

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(
            examples=['0625557777'],
            maxLength=10,
            minLength=10
        )

    @classmethod
    def validate(cls, value):
        if not isinstance(value, str):
            raise TypeError('string required')

        if len(value) != 10:
            raise ValueError('invalid national id length')

        if not isallnum(value):
            raise ValueError('invalid national id')

        return value

    def __repr__(self):
        return f'NationalID({super().__repr__()})'


class PostalCode(str):

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(
            examples=['1234567890'],
            maxLength=10,
            minLength=10
        )

    @classmethod
    def validate(cls, value):
        if not isinstance(value, str):
            raise TypeError('string required')

        if len(value) != 10:
            raise ValueError('invalid postal code length')

        if not isallnum(value):
            raise ValueError('invalid postal code')

        return value

    def __repr__(self):
        return f'PostalCode({super().__repr__()})'
