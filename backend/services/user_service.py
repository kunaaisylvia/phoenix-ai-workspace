from fastapi import HTTPException
from sqlmodel import Session, select

from backend.models.user import User
from backend.models.workspace import Workspace
from backend.schemas.user import UserCreate, UserUpdate
from backend.core.security import hash_password


def create_user(
    session: Session,
    user: UserCreate,
):
    """
    Create a new user and automatically create
    a default workspace for them.
    """

    # Check if email already exists
    existing_user = session.exec(
        select(User).where(User.email == user.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    # Create the user
    db_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role,
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Create a default workspace
    default_workspace = Workspace(
        name=f"{db_user.full_name}'s Workspace",
        description="Default workspace",
        owner_id=db_user.id,
    )

    session.add(default_workspace)
    session.commit()
    session.refresh(default_workspace)

    return db_user


def get_users(
    session: Session,
):
    return session.exec(
        select(User)
    ).all()


def get_user(
    session: Session,
    user_id: int,
):
    user = session.get(
        User,
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


def update_user(
    session: Session,
    user_id: int,
    updated_user: UserUpdate,
):
    user = session.get(
        User,
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if updated_user.full_name is not None:
        user.full_name = updated_user.full_name

    if updated_user.email is not None:
        user.email = updated_user.email

    if updated_user.role is not None:
        user.role = updated_user.role

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


def delete_user(
    session: Session,
    user_id: int,
):
    user = session.get(
        User,
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    session.delete(user)
    session.commit()

    return {
        "message": "User deleted successfully"
    }