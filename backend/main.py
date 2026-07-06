from fastapi import FastAPI

from backend.core.config import settings
from backend.database.database import create_db
from backend.models.user import User
from backend.routers.health import router as health_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)


@app.on_event("startup")
def on_startup():
    create_db()


app.include_router(health_router)


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}"
    }