from fastapi import HTTPException
from sqlmodel import Session, select

from backend.models.user import User
from backend.core.security import (
    verify_password,
    create_access_token,
)


def authenticate_user(
    session: Session,
    email: str,
    password: str,
):
    user = session.exec(
        select(User).where(User.email == email)
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(
        password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    return user


def login_user(
    session: Session,
    email: str,
    password: str,
):
    user = authenticate_user(
        session,
        email,
        password,
    )

    access_token = create_access_token(
        data={"sub": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }