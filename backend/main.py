from contextlib import asynccontextmanager

from fastapi import FastAPI
from backend.models.user import User
from backend.models.workspace import Workspace
from backend.routers.workspace import router as workspace_router
from backend.models.conversation import Conversation
from backend.routers.conversation import (
    router as conversation_router,
)

from backend.core.config import settings
from backend.database.database import create_db_and_tables
from backend.models.user import User
from backend.routers.health import router as health_router
from backend.routers.users import router as users_router
from backend.routers.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
)

app.include_router(health_router)
app.include_router(users_router)
app.include_router(auth_router)
app.include_router(workspace_router)
app.include_router(conversation_router)


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}"
    }