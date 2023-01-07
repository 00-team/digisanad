from sqlalchemy import Integer, String, Table, text

from database.shared import Column, metadata

user_table = Table(
    'user', metadata,
    Column('user_id', Integer, primary_key=True, autoincrement=True),
    Column('phone', String(25), unique=True),
    Column('wallet', Integer, server_default=text('0')),
    Column('picture', String, nullable=True),
    Column('nickname', String(50), nullable=True),
    Column('token', String(128), nullable=True, unique=True),  # hashed token
)
