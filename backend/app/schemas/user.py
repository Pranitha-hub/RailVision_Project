from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "passenger"


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    token: str
    user: UserResponse
    message: str = "Success"


class CrowdReportCreate(BaseModel):
    train_id: str
    station: str = ""
    crowd_level: str  # Low, Moderate, High
    notes: str = ""
