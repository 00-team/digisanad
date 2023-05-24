from sqlalchemy import ForeignKey, Integer, String, Table, UniqueConstraint
from sqlalchemy import text

from db.shared import Column, metadata

user_table = Table(
    'user', metadata,
    Column('user_id', Integer, primary_key=True, autoincrement=True),
    Column('phone', String, unique=True),
    Column('first_name', String),
    Column('last_name', String),
    # year-month-day
    Column('birth_date', String),
    Column('national_id', String),
    Column('postal_code', String),
    Column('address', String),
    Column('email', String),
    Column('wallet', Integer, server_default=text('0')),
    Column('token', String, nullable=True, unique=True),  # hashed token
)


transaction_table = Table(
    'transaction', metadata,
    Column('transaction_id', Integer, primary_key=True, autoincrement=True),
    Column(
        'user_id', Integer,
        ForeignKey(user_table.c.user_id, ondelete='CASCADE'),
    ),
    Column('amount', Integer),
    Column('authority', String),
    Column('ref_id', Integer),
    UniqueConstraint('user_id', 'authority'),
)
