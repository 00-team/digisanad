
import sqlite3

from databases import Database
# from redis.asyncio import Redis
from sqlalchemy import Column as _Column
from sqlalchemy import MetaData

from shared.settings import DATABASE_URL


class Connection(sqlite3.Connection):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.execute('pragma foreign_keys=1')


def Column(*args, **kwargs):
    kwargs.setdefault('nullable', False)
    return _Column(*args, **kwargs)


database = Database(DATABASE_URL, factory=Connection)
metadata = MetaData()

# redis = Redis(
#     host='localhost', port=6979,
#     password=REDIS_PASSWORD
# )


__all__ = [
    'database',
    'metadata',
    'Column',
    # 'redis',
]
