"""Application configuration"""
try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings

from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""
    APP_NAME: str = "LogicPuse API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    PORT: int = 5000
    
    # Database settings (if needed)
    DATABASE_URL: str = ""
    
    # Security settings
    SECRET_KEY: str = "your-secret-key-here"
    
    # CORS settings
    CORS_ORIGINS: list = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings"""
    return Settings()

