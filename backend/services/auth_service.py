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
    print("\n==============================")
    print("LOGIN ATTEMPT")
    print("==============================")
    print("EMAIL RECEIVED:", repr(email))
    print("PASSWORD RECEIVED:", repr(password))

    user = session.exec(
        select(User).where(User.email == email)
    ).first()

    print("USER FOUND:", user is not None)

    if user:
        print("DB EMAIL:", user.email)
        print("HASH:", user.hashed_password)

        valid = verify_password(
            password,
            user.hashed_password,
        )

        print("PASSWORD VALID:", valid)

        if valid:
            return user

    raise HTTPException(
        status_code=401,
        detail="Invalid email or password",
    )


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
        {"sub": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }