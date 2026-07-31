from fastapi import APIRouter, Depends, File as FastAPIFile, UploadFile, Form
from sqlmodel import Session

from backend.database.database import get_session
from backend.dependencies.auth import get_current_user
from backend.models.user import User
from backend.schemas.file import FileRead
from backend.services.file import save_file

router = APIRouter(
    prefix="/files",
    tags=["Files"],
)


@router.post(
    "/upload",
    response_model=FileRead,
)
def upload_file(
    workspace_id: int = Form(...),
    conversation_id: int | None = Form(None),
    file: UploadFile = FastAPIFile(...),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):

    return save_file(
        db=session,
        upload=file,
        workspace_id=workspace_id,
        conversation_id=conversation_id,
    )