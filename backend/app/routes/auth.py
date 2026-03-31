"""
Authentication routes: Register, Login, Profile.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, UserRole
from ..schemas.user import UserCreate, UserLogin
from ..utils.security import hash_password, verify_password, create_access_token
from ..deps import get_current_user, RoleChecker
import uuid
from datetime import timedelta, datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _user_to_dict(user: User) -> dict:
    """Convert User ORM object to a serializable dict."""
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role.value if hasattr(user.role, "value") else str(user.role)
    }


@router.post("/register", status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Public registration for passengers only."""
    # Force role to passenger for public registration
    role = UserRole.passenger
    
    # Check if email already exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Account already exists.")

    user = User(
        name=user_data.name,
        email=user_data.email,
        password=hash_password(user_data.password),
        role=role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": role.value})
    return {"token": token, "user": _user_to_dict(user), "message": "Account created"}


@router.post("/staff/register", status_code=201)
def create_staff_user(
    staff_data: UserCreate, 
    db: Session = Depends(get_db), 
    admin: User = Depends(RoleChecker([UserRole.admin]))
):
    """Admin-only registration for privileged roles."""
    existing = db.query(User).filter(User.email == staff_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already taken.")

    # Use the requested role from staff_data
    try:
        role = UserRole(staff_data.role)
    except ValueError:
        role = UserRole.passenger

    user = User(
        name=staff_data.name,
        email=staff_data.email,
        password=hash_password(staff_data.password),
        role=role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "user": _user_to_dict(user),
        "message": f"Successfully created {role.value} account."
    }


@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    role_value = user.role.value if hasattr(user.role, "value") else str(user.role)
    token = create_access_token({
        "sub": str(user.id),
        "role": role_value
    })

    return {
        "token": token,
        "user": _user_to_dict(user),
        "message": "Login successful"
    }


@router.get("/me")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "user": _user_to_dict(current_user),
        "message": "Profile retrieved"
    }


@router.post("/forgot-password")
def forgot_password(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Don't reveal if user exists or not for security
        return {"message": "If this email is registered, you will receive a reset code."}

    token = str(uuid.uuid4())[:8].upper()  # Short code for simplicity
    user.reset_token = token
    user.reset_expiry = datetime.utcnow() + timedelta(minutes=30)
    db.commit()

    # MOCK: In production, send email here.
    return {
        "message": "If this email is registered, you will receive a reset code.",
        "debug_token": token  # For demo purposes
    }


@router.post("/reset-password")
def reset_password(data: dict, db: Session = Depends(get_db)):
    token = data.get("token")
    new_password = data.get("password")
    email = data.get("email")

    user = db.query(User).filter(User.email == email, User.reset_token == token).first()
    
    if not user or (user.reset_expiry and user.reset_expiry < datetime.utcnow()):
        raise HTTPException(status_code=400, detail="Invalid or expired reset code.")

    user.password = hash_password(new_password)
    user.reset_token = None
    user.reset_expiry = None
    db.commit()

    return {"message": "Password successfully reset."}
