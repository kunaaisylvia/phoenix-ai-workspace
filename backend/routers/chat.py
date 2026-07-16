from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlmodel import Session

from backend.database.database import get_session
from backend.dependencies.auth import get_current_user
from backend.models.user import User
from backend.services.chat_service import chat, stream_chat

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


class ChatRequest(BaseModel):
    prompt: str


@router.post("/{conversation_id}")
def chat_with_phoenix(
    conversation_id: int,
    request: ChatRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return chat(
        session=session,
        conversation_id=conversation_id,
        prompt=request.prompt,
        current_user=current_user,
    )


@router.post("/stream/{conversation_id}")
def stream_with_phoenix(
    conversation_id: int,
    request: ChatRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return StreamingResponse(
        stream_chat(
            session=session,
            conversation_id=conversation_id,
            prompt=request.prompt,
            current_user=current_user,
        ),
        media_type="text/plain",
    )