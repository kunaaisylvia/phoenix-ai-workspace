from fastapi import HTTPException
from sqlmodel import Session, select

from backend.models.workspace import Workspace
from backend.models.user import User
from backend.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceUpdate,
)


def create_workspace(
    session: Session,
    workspace: WorkspaceCreate,
    current_user: User,
):
    db_workspace = Workspace(
        name=workspace.name,
        description=workspace.description,
        owner_id=current_user.id,
    )

    session.add(db_workspace)
    session.commit()
    session.refresh(db_workspace)

    return db_workspace


def get_workspaces(
    session: Session,
    current_user: User,
):
    return session.exec(
        select(Workspace).where(
            Workspace.owner_id == current_user.id
        )
    ).all()


def get_workspace(
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

    return workspace


def update_workspace(
    session: Session,
    workspace_id: int,
    updated_workspace: WorkspaceUpdate,
    current_user: User,
):
    workspace = get_workspace(
        session,
        workspace_id,
        current_user,
    )

    if updated_workspace.name is not None:
        workspace.name = updated_workspace.name

    if updated_workspace.description is not None:
        workspace.description = updated_workspace.description

    session.add(workspace)
    session.commit()
    session.refresh(workspace)

    return workspace


def delete_workspace(
    session: Session,
    workspace_id: int,
    current_user: User,
):
    workspace = get_workspace(
        session,
        workspace_id,
        current_user,
    )

    session.delete(workspace)
    session.commit()

    return {
        "message": "Workspace deleted successfully"
    }