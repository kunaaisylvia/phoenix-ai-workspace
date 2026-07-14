from typing import Optional

from sqlmodel import SQLModel, Field


class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(
        default=None,
        primary_key=True,
    )

    title: str = "New Conversation"

    workspace_id: int = Field(
        foreign_key="workspace.id",
    )