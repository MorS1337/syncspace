from typing import Generator, Optional

from fastapi import Cookie, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .db import SessionLocal
from .models import SpaceMember, User


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_membership(space_id: int, user_id: int, db: Session):
    row = db.scalar(
        select(SpaceMember).where(SpaceMember.space_id == space_id, SpaceMember.user_id == user_id)
    )
    if not row:
        raise HTTPException(403, "Not a member of this space")


def is_member(db: Session, space_id: int, user_id: int) -> bool:
    """Проверка на то, является ли пользователь членом пространства"""
    row = db.scalar(
        select(SpaceMember).where(SpaceMember.space_id == space_id, SpaceMember.user_id == user_id)
    )
    return row is not None


# я сделал, семен
def get_current_user(
    db: Session = Depends(get_db),
    uid: Optional[str] = Cookie(default=None, alias="uid"),
) -> User:
    if uid is None:
        raise HTTPException(401, "Not authenticated")
    try:
        user_id = int(uid)
    except ValueError as exc:
        raise HTTPException(401, "Bad session") from exc
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(401, "Session user not found")
    return user
