

# from enum import Enum, auto

from sqlalchemy import JSON, Column, Integer, String, text

# from pydantic import BaseModel
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
