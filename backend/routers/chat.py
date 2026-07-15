from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session

from backend.database.database import get_session
from backend.dependencies.auth import get_current_user
from backend.models.user import User
from backend.services.chat_service import chat

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