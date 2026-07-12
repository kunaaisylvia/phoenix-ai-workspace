from typing import Optional

from sqlmodel import SQLModel


class UserCreate(SQLModel):
    full_name: str
    email: str
    password: str
    role: str = "user"


class UserRead(SQLModel):
    id: int
    full_name: str
    email: str
    role: str


class UserUpdate(SQLModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None