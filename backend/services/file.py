import os
import uuid
import shutil

from fastapi import UploadFile
from sqlmodel import Session

from backend.models.file import File


UPLOAD_DIRECTORY = "uploads"

os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)


def save_file(
    db: Session,
    upload: UploadFile,
    workspace_id: int,
    conversation_id: int | None = None,
):

    extension = os.path.splitext(
        upload.filename
    )[1]

    filename = (
        f"{uuid.uuid4()}{extension}"
    )

    filepath = os.path.join(
        UPLOAD_DIRECTORY,
        filename,
    )

    with open(filepath, "wb") as buffer:

        shutil.copyfileobj(
            upload.file,
            buffer,
        )

    size = os.path.getsize(filepath)

    file = File(

        filename=filename,

        original_name=upload.filename,

        content_type=upload.content_type,

        size=size,

        path=filepath,

        workspace_id=workspace_id,

        conversation_id=conversation_id,

    )

    db.add(file)

    db.commit()

    db.refresh(file)

    return file