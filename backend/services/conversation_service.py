from fastapi import HTTPException
from sqlmodel import Session, select

from backend.models.conversation import Conversation
from backend.models.workspace import Workspace
from backend.models.user import User
from backend.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
)


def create_conversation(
    session: Session,
    conversation: ConversationCreate,
    current_user: User,
):
    workspace = session.get(
        Workspace,
        conversation.workspace_id,
    )

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found",
        )

    if workspace.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    db_conversation = Conversation(
        title=conversation.title,
        workspace_id=conversation.workspace_id,
    )

    session.add(db_conversation)
    session.commit()
    session.refresh(db_conversation)

    return db_conversation


def get_conversations(
    session: Session,
    workspace_id: int,
    current_user: User,
):
    workspace = session.get(
        Workspace,
        workspace_id,
    )

    if not workspace:
        raise HTTPException(
            status_code=404,
            detail="Workspace not found",
        )

    if workspace.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    return session.exec(
        select(Conversation).where(
            Conversation.workspace_id == workspace_id
        )
    ).all()


def get_conversation(
    session: Session,
    conversation_id: int,
    current_user: User,
):
    conversation = session.get(
        Conversation,
        conversation_id,
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    workspace = session.get(
        Workspace,
        conversation.workspace_id,
    )

    if workspace.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    return conversation


def update_conversation(
    session: Session,
    conversation_id: int,
    updated_conversation: ConversationUpdate,
    current_user: User,
):
    conversation = get_conversation(
        session,
        conversation_id,
        current_user,
    )

    if updated_conversation.title is not None:
        conversation.title = updated_conversation.title

    session.add(conversation)
    session.commit()
    session.refresh(conversation)

    return conversation


def delete_conversation(
    session: Session,
    conversation_id: int,
    current_user: User,
):
    conversation = get_conversation(
        session,
        conversation_id,
        current_user,
    )

    session.delete(conversation)
    session.commit()

    return {
        "message": "Conversation deleted successfully"
    }