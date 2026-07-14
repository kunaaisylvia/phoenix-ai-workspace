from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.database.database import get_session
from backend.dependencies.auth import get_current_user
from backend.models.user import User
from backend.schemas.message import (
    MessageCreate,
    MessageRead,
    MessageUpdate,
)
from backend.services.message_service import (
    create_message,
    get_messages,
    get_message,
    update_message,
    delete_message,
)

router = APIRouter(
    prefix="/messages",
    tags=["Messages"],
)


@router.post(
    "/",
    response_model=MessageRead,
)
def create_new_message(
    message: MessageCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return create_message(
        session,
        message,
        current_user,
    )


@router.get(
    "/conversation/{conversation_id}",
    response_model=list[MessageRead],
)
def read_messages(
    conversation_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return get_messages(
        session,
        conversation_id,
        current_user,
    )


@router.get(
    "/{message_id}",
    response_model=MessageRead,
)
def read_message(
    message_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return get_message(
        session,
        message_id,
        current_user,
    )


@router.put(
    "/{message_id}",
    response_model=MessageRead,
)
def update_existing_message(
    message_id: int,
    updated_message: MessageUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return update_message(
        session,
        message_id,
        updated_message,
        current_user,
    )


@router.delete("/{message_id}")
def delete_existing_message(
    message_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return delete_message(
        session,
        message_id,
        current_user,
    )