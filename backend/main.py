from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database.database import create_db_and_tables

from backend.routers.auth import router as auth_router
from backend.routers.users import router as users_router
from backend.routers.conversation import router as conversation_router
from backend.routers.messages import router as messages_router
from backend.routers.chat import router as chat_router
from backend.routers.workspace import router as workspace_router
from backend.routers.health import router as health_router

app = FastAPI(
    title="Phoenix AI Workspace API",
    version="1.0.0",
)

# -------------------------------
# CORS
# -------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Startup
# -------------------------------

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# -------------------------------
# Root
# -------------------------------

@app.get("/")
def root():
    return {
        "message": "Phoenix AI Workspace API is running 🚀"
    }

# -------------------------------
# Routers
# -------------------------------

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(conversation_router)
app.include_router(messages_router)
app.include_router(chat_router)
app.include_router(workspace_router)
app.include_router(health_router)