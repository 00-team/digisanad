

from sqlalchemy import MetaData
from sqlalchemy.ext.declarative import declarative_base

metadata = MetaData()
BaseTable = declarative_base(metadata=metadata)
