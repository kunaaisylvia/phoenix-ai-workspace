from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.database.database import get_session
from backend.dependencies.auth import get_current_user
from backend.models.user import User
from backend.schemas.conversation import (
    ConversationCreate,
    ConversationRead,
    ConversationUpdate,
)
from backend.services.conversation_service import (
    create_conversation,
    get_conversations,
    get_conversation,
    update_conversation,
    delete_conversation,
)

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


@router.post(
    "/",
    response_model=ConversationRead,
)
def create_new_conversation(
    conversation: ConversationCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return create_conversation(
        session,
        conversation,
        current_user,
    )


@router.get(
    "/workspace/{workspace_id}",
    response_model=list[ConversationRead],
)
def read_conversations(
    workspace_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return get_conversations(
        session,
        workspace_id,
        current_user,
    )


@router.get(
    "/{conversation_id}",
    response_model=ConversationRead,
)
def read_conversation(
    conversation_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return get_conversation(
        session,
        conversation_id,
        current_user,
    )


@router.put(
    "/{conversation_id}",
    response_model=ConversationRead,
)
def update_existing_conversation(
    conversation_id: int,
    updated_conversation: ConversationUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return update_conversation(
        session,
        conversation_id,
        updated_conversation,
        current_user,
    )


@router.delete("/{conversation_id}")
def delete_existing_conversation(
    conversation_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return delete_conversation(
        session,
        conversation_id,
        current_user,
    )