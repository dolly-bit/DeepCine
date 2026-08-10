from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.user import UserRegister, UserResponse
from app.services.auth_services import register_user
from app.schemas.user import UserLogin, Token
from app.services.auth_services import login_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register(user: UserRegister, db: Session = Depends(get_db)):
    new_user = register_user(user, db)

    if not new_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    return new_user

@router.post("/login", response_model=Token)
def login(
    credentials:LoginRequest,
    db:Session=Depends(get_db)):
    result=login_user(
        db,
        credentials.email,
        credentials.password
    )
    

    return {
        "access_token": result["access_token"],
        "token_type": result["token_type"],
        "user_id":result["user"].id,
        "username":result["user"].username
    }