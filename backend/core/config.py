from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME = "Phoenix AI Workspace"
    VERSION = "0.1.0"


settings = Settings()


