from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.database.database import get_session
from backend.dependencies.auth import get_current_user
from backend.models.user import User
from backend.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceRead,
    WorkspaceUpdate,
)
from backend.services.workspace_service import (
    create_workspace,
    get_workspaces,
    get_workspace,
    update_workspace,
    delete_workspace,
)

router = APIRouter(
    prefix="/workspaces",
    tags=["Workspaces"],
)


@router.post(
    "/",
    response_model=WorkspaceRead,
)
def create_new_workspace(
    workspace: WorkspaceCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return create_workspace(
        session,
        workspace,
        current_user,
    )


@router.get(
    "/",
    response_model=list[WorkspaceRead],
)
def read_workspaces(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return get_workspaces(
        session,
        current_user,
    )


@router.get(
    "/{workspace_id}",
    response_model=WorkspaceRead,
)
def read_workspace(
    workspace_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return get_workspace(
        session,
        workspace_id,
        current_user,
    )


@router.put(
    "/{workspace_id}",
    response_model=WorkspaceRead,
)
def update_existing_workspace(
    workspace_id: int,
    updated_workspace: WorkspaceUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return update_workspace(
        session,
        workspace_id,
        updated_workspace,
        current_user,
    )


@router.delete("/{workspace_id}")
def delete_existing_workspace(
    workspace_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return delete_workspace(
        session,
        workspace_id,
        current_user,
    )