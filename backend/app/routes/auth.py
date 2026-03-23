"""
Authentication routes: Register, Login, Profile.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, UserRole
from ..schemas.user import UserCreate, UserLogin
from ..utils.security import hash_password, verify_password, create_access_token
from ..deps import get_current_user

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
    # Check if email already exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Validate role
    try:
        role = UserRole(user_data.role)
    except ValueError:
        role = UserRole.passenger

    # Create user with hashed password
    user = User(
        name=user_data.name,
        email=user_data.email,
        password=hash_password(user_data.password),
        role=role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate JWT token
    token = create_access_token({
        "sub": str(user.id),
        "role": role.value
    })

    return {
        "token": token,
        "user": _user_to_dict(user),
        "message": "Account created successfully"
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
