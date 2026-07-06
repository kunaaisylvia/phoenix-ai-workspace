from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Phoenix AI Workspace"
    VERSION: str = "0.1.0"


settings = Settings()

