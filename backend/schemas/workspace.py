from typing import Optional

from sqlmodel import SQLModel


class WorkspaceCreate(SQLModel):
    name: str
    description: Optional[str] = None


class WorkspaceRead(SQLModel):
    id: int
    name: str
    description: Optional[str] = None
    owner_id: int


class WorkspaceUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None