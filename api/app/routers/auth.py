from fastapi import APIRouter, Depends, HTTPException, Response
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


@router.post("/register", response_model=UserOut)
def register(payload: UserCreate, resp: Response, db: Session = Depends(get_db)):
    payload.name = payload.name.strip()
    if not payload.name:
        raise HTTPException(400, "Name is required")
    if not payload.password:
        raise HTTPException(400, "Password is required")

    if len(payload.password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters long")
    if not any(c.isalpha() for c in payload.password):
        raise HTTPException(400, "Password must contain at least one letter")
    if not any(c.isdigit() for c in payload.password):
        raise HTTPException(400, "Password must contain at least one digit")
    if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?/" for c in payload.password):
        raise HTTPException(400, "Password must contain at least one special character")

    existing = db.scalar(select(User).where(User.name == payload.name))
    if existing:
        raise HTTPException(400, "User with this name already exists")

    user = User(
        name=payload.name, email=payload.email, hashed_password=get_password_hash(payload.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    resp.set_cookie(
        key="uid",
        value=str(user.id),
        httponly=True,
        samesite="Lax",
        max_age=14 * 24 * 3600,
    )
    return user


@router.post("/login", response_model=UserOut)
def login(payload: UserLogin, resp: Response, db: Session = Depends(get_db)):
    name = payload.name.strip()
    user = db.scalar(select(User).where(User.name == name))
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")

    resp.set_cookie(
        key="uid",
        value=str(user.id),
        httponly=True,
        samesite="Lax",
        max_age=14 * 24 * 3600,
    )
    return user


@router.post("/logout")
def logout(resp: Response):
    resp.delete_cookie("uid")
    return {"ok": True}


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user
