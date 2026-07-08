from fastapi import HTTPException
from sqlmodel import Session, select

from backend.models.user import User
from backend.schemas.user import UserCreate, UserUpdate


def create_user(session: Session, user: UserCreate):
    db_user = User(
        full_name=user.full_name,
        email=user.email,
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


def get_users(session: Session):
    return session.exec(select(User)).all()


def get_user(session: Session, user_id: int):
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


def update_user(
    session: Session,
    user_id: int,
    updated_user: UserUpdate,
):
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if updated_user.full_name is not None:
        user.full_name = updated_user.full_name

    if updated_user.email is not None:
        user.email = updated_user.email

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


def delete_user(session: Session, user_id: int):
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    session.delete(user)
    session.commit()

    return {
        "message": "User deleted successfully"
    }