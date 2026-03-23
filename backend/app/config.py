import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:270806@localhost:5432/railvision_db"
    )
    JWT_SECRET: str = os.getenv(
        "JWT_SECRET",
        "railvision-super-secret-key-change-in-production-2026"
    )
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_HOURS: int = 24


settings = Settings()
