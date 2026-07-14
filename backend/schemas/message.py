from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel


class MessageCreate(SQLModel):
    role: str
    content: str
    conversation_id: int


class MessageRead(SQLModel):
    id: int
    role: str
    content: str
    created_at: datetime
    conversation_id: int


class MessageUpdate(SQLModel):
    content: Optional[str] = None