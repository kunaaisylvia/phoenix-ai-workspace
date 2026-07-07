from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.database.database import get_session
from backend.models.user import User

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/")
def create_user(
    user: User,
    session: Session = Depends(get_session)
):
    session.add(user)
    session.commit()
    session.refresh(user)
    return user