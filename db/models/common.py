

from enum import Enum, auto

from pydantic import BaseModel
from sqlalchemy import MetaData
from sqlalchemy.ext.declarative import declarative_base

metadata = MetaData()
BaseTable = declarative_base(metadata=metadata)


class NetworkType(str, Enum):
    ethereum = 'eth'
    bitcoin = 'btc'
    tezos = 'xtz'


class BaseCoin(BaseModel):
    name: str
    display: str
    network: NetworkType
