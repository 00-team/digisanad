

import logging
from enum import Enum, auto
from functools import cached_property

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String

from shared.errors import forbidden

from .common import BaseTable


class UserTable(BaseTable):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    phone = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    # year-month-day
    birth_date = Column(String, nullable=False)
    national_id = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)
    address = Column(String, nullable=False)
    email = Column(String, nullable=False)
    token = Column(String, unique=True)  # hashed token
    admin = Column(String)


class AdminPerms(int, Enum):
    def _generate_next_value_(name, start, count, last_values):
        return 1 << count

    MASTER = auto()

    V_USER = auto()  # VISION ~ VIEW
    A_USER = auto()  # APPEND ~ ADD
    C_USER = auto()  # CHANGE ~ CHANGE
    D_USER = auto()  # DELETE ~ DELETE

    V_TRANSACTION = auto()
    A_TRANSACTION = auto()
    C_TRANSACTION = auto()
    D_TRANSACTION = auto()

    V_WALLET = auto()
    A_WALLET = auto()
    C_WALLET = auto()
    D_WALLET = auto()

    V_GENERAL = auto()
    C_GENERAL = auto()

    V_MESSAGE = auto()
    A_MESSAGE = auto()
    C_MESSAGE = auto()
    D_MESSAGE = auto()

    V_SCHEMA = auto()
    A_SCHEMA = auto()
    C_SCHEMA = auto()
    D_SCHEMA = auto()


class UserPublic(BaseModel):
    user_id: int
    phone: str
    first_name: str
    last_name: str


class UserModel(UserPublic):
    birth_date: str
    national_id: str
    postal_code: str
    address: str
    email: str
    admin: str | None = None
    token: str | None

    @property
    def birth_jdate(self):
        pass

    @cached_property
    def perms(self) -> int:
        return int(self.admin or '0')

    @cached_property
    def is_admin(self) -> bool:
        return bool(self.perms)

    def admin_check(self, required_perms: int, log=False) -> bool:
        if self.admin is None:
            if log:
                logging.warn(
                    f'<User {self.user.gene}> tried {required_perms}'
                )
            return False

        admin_perms = self.perms
        is_master = admin_perms & AdminPerms.MASTER

        if not is_master and not (admin_perms & required_perms):
            if log:
                logging.warn(
                    f'<Admin {self.user.gene}> tried {required_perms}'
                )
            return False

        return True

    def admin_assert(self, required_perms: int):
        if not self.admin_check(required_perms, log=True):
            raise forbidden

    # def __init__(self, birth_date, **data) -> None:
    #     if isinstance(birth_date, str):
    #         birth_date = tuple(map(lambda d: int(d), birth_date.split('-')))
    #     super().__init__(birth_date=birth_date, **data)
