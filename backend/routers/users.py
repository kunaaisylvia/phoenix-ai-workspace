from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from backend.database.database import get_session
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


@router.post("/", response_model=UserRead)
def create_new_user(
    user: UserCreate,
    session: Session = Depends(get_session),
):
    return create_user(session, user)


@router.get("/", response_model=list[UserRead])
def read_users(
    session: Session = Depends(get_session),
):
    return get_users(session)


@router.get("/{user_id}", response_model=UserRead)
def read_user(
    user_id: int,
    session: Session = Depends(get_session),
):
    return get_user(session, user_id)


@router.put("/{user_id}", response_model=UserRead)
def update_existing_user(
    user_id: int,
    updated_user: UserUpdate,
    session: Session = Depends(get_session),
):
    return update_user(session, user_id, updated_user)


@router.delete("/{user_id}")
def delete_existing_user(
    user_id: int,
    session: Session = Depends(get_session),
):
    return delete_user(session, user_id)