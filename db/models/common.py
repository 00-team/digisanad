

from enum import Enum, auto

from sqlalchemy import MetaData
from sqlalchemy.ext.declarative import declarative_base

metadata = MetaData()
BaseTable = declarative_base(metadata=metadata)


class NetworkType(int, Enum):
    ethereum = 0
    bitcoin = auto()
    tezos = auto()
