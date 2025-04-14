from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Stress Detection API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"  # Change in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Model paths (updated to use verified public models)
    TEXT_MODEL_PATH: str = "j-hartmann/emotion-english-distilroberta-base"  # Public emotion model
    SIGNAL_MODEL_PATH: str = ""  # Empty string for default TimeSeriesTransformer
    
    class Config:
        case_sensitive = True

settings = Settings() 