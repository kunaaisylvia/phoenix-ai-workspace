from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel


class FileCreate(SQLModel):

    workspace_id: int
    conversation_id: Optional[int] = None


class FileRead(SQLModel):

    id: int

    filename: str

    original_name: str

    content_type: str

    size: int

    workspace_id: int

    conversation_id: Optional[int]

    created_at: datetime