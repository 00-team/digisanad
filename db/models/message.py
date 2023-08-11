

from enum import Enum

from pydantic import BaseModel
from sqlalchemy import JSON, Boolean, Column, Integer, String
from sqlalchemy import text as _text

from .common import BaseTable


class MessageTable(BaseTable):
    __tablename__ = 'messages'

    message_id = Column(
        Integer, primary_key=True, autoincrement=True
    )
    text = Column(String, nullable=False)
    seen = Column(Boolean, nullable=False, server_default=_text('0'))
    sender = Column(
        'sender', Integer,
        nullable=False, index=True, server_default=_text('-1')
    )
    receiver = Column(
        'receiver', Integer,
        nullable=False, index=True, server_default=_text('-1')
    )
    timestamp = Column(Integer, nullable=False, server_default=_text('0'))
    level = Column(String, nullable=False, server_default='info')
    data = Column(JSON, nullable=False, server_default='{}')


class MessageLevel(str, Enum):
    NOTIFICATION = 'notification'
    INFO = 'info'
    URGENT = 'urgent'


class MessageModel(BaseModel):
    message_id: int
    text: str
    seen: bool
    sender: int
    receiver: int
    timestamp: int
    level: MessageLevel
    data: dict
