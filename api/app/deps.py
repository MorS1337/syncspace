from typing import Generator

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .db import SessionLocal
from .models import SpaceMember


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
    """Check if user is a member of space."""
    row = db.scalar(
        select(SpaceMember).where(SpaceMember.space_id == space_id, SpaceMember.user_id == user_id)
    )
    return row is not None
