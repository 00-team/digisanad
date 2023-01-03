
from fastapi import HTTPException

DATABASE_ERROR = HTTPException(500, 'Database Error!')
