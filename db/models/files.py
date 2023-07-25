
from hashlib import sha3_256

from pydantic import BaseModel
from sqlalchemy import BLOB, Column, Integer, String, text

from .common import BaseTable


class FileTable(BaseTable):
    __tablename__ = 'files'

    file_id = Column(
        Integer, primary_key=True,
        index=True, autoincrement=True
    )
    salt = Column(BLOB, nullable=False)
    owner = Column(
        Integer, nullable=False,
        index=True, server_default=text('-1')
    )
    size = Column(Integer, nullable=False, server_default=text('0'))
    mime = Column(String, nullable=False, server_default='unknown')
    contract = Column(Integer, index=True)
    # readers = Column(JSON, nullable=False, server_default='[]')


class FileModel(BaseModel):
    file_id: int
    salt: bytes
    owner: int
    size: int
    mime: str
    contract: int | None = None

    @property
    def name(self) -> str:
        return sha3_256(
            self.file_id.to_bytes(12, byteorder='little') + self.salt
        ).hexdigest()
