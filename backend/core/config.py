from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Phoenix AI Workspace"
    VERSION: str = "0.1.0"

    SECRET_KEY: str
    ALGORITHM: str
    GROQ_API_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()
