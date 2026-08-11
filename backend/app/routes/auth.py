from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.user import UserRegister, UserResponse, UserLogin, Token
from app.services.auth_services import register_user, login_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    new_user = register_user(user, db)

    if not new_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    return new_user


@router.post("/login", response_model=Token)
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    result = login_user(
        credentials.email,
        credentials.password,
        db
    )

    if not result:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "access_token": result["access_token"],
        "token_type": result["token_type"],
        "user_id": result["user"].id,
        "username": result["user"].username
    }