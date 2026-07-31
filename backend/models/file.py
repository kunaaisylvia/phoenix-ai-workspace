from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel, Field


class File(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)

    filename: str

    original_name: str

    content_type: str

    size: int

    path: str

    workspace_id: int

    conversation_id: Optional[int] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)