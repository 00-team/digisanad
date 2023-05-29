
import sqlite3

from databases import Database
from redis.asyncio import Redis
from sqlalchemy import Column as _Column
from sqlalchemy import MetaData

from shared import settings


class Connection(sqlite3.Connection):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.execute('pragma foreign_keys=1')


def Column(*args, **kwargs):
    kwargs.setdefault('nullable', False)
    return _Column(*args, **kwargs)


database = Database(settings.sql_url, factory=Connection)
metadata = MetaData()

redis = Redis(
    password=settings.redis_pass,
    unix_socket_path='/run/redis/digisanad.sock'
)


__all__ = [
    'database',
    'metadata',
    'Column',
    'redis',
]
