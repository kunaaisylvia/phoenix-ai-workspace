from typing import Optional
from sqlmodel import SQLModel


class UserCreate(SQLModel):
    full_name: str
    email: str
    password: str


class UserRead(SQLModel):
    id: int
    full_name: str
    email: str


class UserUpdate(SQLModel):
    full_name: Optional[str] = None
    email: Optional[str] = None