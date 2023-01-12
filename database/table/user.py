from sqlalchemy import Integer, String, Table, text

from database.shared import Column, metadata

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

    Column('token', String(128), nullable=True, unique=True),  # hashed token
)
