

from pydantic import BaseModel
from sqlalchemy import JSON, Column, Integer, String, text

from .common import BaseTable


class UsersTable(BaseTable):
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

    # block_list = Column(JSON, server_default='{}')


class UserModel(BaseModel):
    user_id: int
    phone: str
    first_name: str
    last_name: str
    birth_date: str
    national_id: str
    postal_code: str
    address: str
    email: str
    # wallet: int

    token: str | None

    @property
    def birth_jdate(self):
        pass

    # def __init__(self, birth_date, **data) -> None:
    #     if isinstance(birth_date, str):
    #         birth_date = tuple(map(lambda d: int(d), birth_date.split('-')))
    #     super().__init__(birth_date=birth_date, **data)


'''
user_table = Table(
    'user', metadata,
    Column('user_id', Integer, primary_key=True, autoincrement=True),
)

transaction_table = Table(
    'transaction', metadata,
    Column('transaction_id', Integer, primary_key=True, autoincrement=True),
    Column(
        'user_id', Integer,
        ForeignKey(user_table.c.user_id, ondelete='CASCADE'),
    ),
    UniqueConstraint('user_id', 'authority'),
)
'''
