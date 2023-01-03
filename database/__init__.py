
# importing the table is necessary for creating the tables
import database.table
from settings import DATABASE_URL
from sqlalchemy import create_engine

from .models import UserModel, VerificationModel
from .shared import database, metadata, redis

engine = create_engine(
    DATABASE_URL,
    connect_args={'check_same_thread': False},
)
metadata.create_all(engine)


__all__ = [
    'database',
    'redis',

    'VerificationModel',
    'UserModel',
]
