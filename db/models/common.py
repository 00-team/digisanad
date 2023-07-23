

from enum import Enum

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


def model_dict(data: BaseModel | dict) -> dict:
    if isinstance(data, BaseModel):
        return data.dict()

    return data
