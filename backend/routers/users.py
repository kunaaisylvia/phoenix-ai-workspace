from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.database.database import get_session
from backend.dependencies.auth import get_current_user
from backend.models.user import User
from backend.schemas.user import UserCreate, UserRead, UserUpdate
from backend.services.user_service import (
    create_user,
    get_users,
    get_user,
    update_user,
    delete_user,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


# ==========================
# Register User (Public)
# ==========================
@router.post("/", response_model=UserRead)
def create_new_user(
    user: UserCreate,
    session: Session = Depends(get_session),
):
    return create_user(session, user)


# ==========================
# Current Logged-in User
# ==========================
@router.get("/me", response_model=UserRead)
def read_current_user(
    current_user: User = Depends(get_current_user),
):
    return current_user


# ==========================
# Get All Users
# ==========================
@router.get("/", response_model=list[UserRead])
def read_users(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return get_users(session)


# ==========================
# Get User By ID
# ==========================
@router.get("/{user_id}", response_model=UserRead)
def read_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return get_user(session, user_id)


# ==========================
# Update User
# ==========================
@router.put("/{user_id}", response_model=UserRead)
def update_existing_user(
    user_id: int,
    updated_user: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return update_user(
        session,
        user_id,
        updated_user,
    )


# ==========================
# Delete User
# ==========================
@router.delete("/{user_id}")
def delete_existing_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return delete_user(session, user_id)