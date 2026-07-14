from fastapi import HTTPException
from sqlmodel import Session, select

from backend.models.conversation import Conversation
from backend.models.message import Message
from backend.models.workspace import Workspace
from backend.models.user import User
from backend.schemas.message import (
    MessageCreate,
    MessageUpdate,
)


def create_message(
    session: Session,
    message: MessageCreate,
    current_user: User,
):
    conversation = session.get(
        Conversation,
        message.conversation_id,
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

    db_message = Message(
        role=message.role,
        content=message.content,
        conversation_id=message.conversation_id,
    )

    session.add(db_message)
    session.commit()
    session.refresh(db_message)

    return db_message


def get_messages(
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

    return session.exec(
        select(Message).where(
            Message.conversation_id == conversation_id
        )
    ).all()


def get_message(
    session: Session,
    message_id: int,
    current_user: User,
):
    message = session.get(
        Message,
        message_id,
    )

    if not message:
        raise HTTPException(
            status_code=404,
            detail="Message not found",
        )

    conversation = session.get(
        Conversation,
        message.conversation_id,
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

    return message


def update_message(
    session: Session,
    message_id: int,
    updated_message: MessageUpdate,
    current_user: User,
):
    message = get_message(
        session,
        message_id,
        current_user,
    )

    if updated_message.content is not None:
        message.content = updated_message.content

    session.add(message)
    session.commit()
    session.refresh(message)

    return message


def delete_message(
    session: Session,
    message_id: int,
    current_user: User,
):
    message = get_message(
        session,
        message_id,
        current_user,
    )

    session.delete(message)
    session.commit()

    return {
        "message": "Message deleted successfully"
    }