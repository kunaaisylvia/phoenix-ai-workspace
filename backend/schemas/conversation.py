from typing import Optional

from sqlmodel import SQLModel


class ConversationCreate(SQLModel):
    title: Optional[str] = "New Conversation"
    workspace_id: int


class ConversationRead(SQLModel):
    id: int
    title: str
    workspace_id: int


class ConversationUpdate(SQLModel):
    title: Optional[str] = None