import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db, is_member
from app.models import Role, Space, SpaceMember, User
from app.schemas import SpaceCreate, SpaceOut

router = APIRouter(prefix="/api/spaces", tags=["spaces"])


def _invite() -> str:
    return secrets.token_urlsafe(6)


@router.post("", response_model=SpaceOut)
def create_space(
    payload: SpaceCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    sp = Space(
        title=payload.title,
        description=payload.description,
        invite_code=_invite(),
        created_by=user.id,
    )
    db.add(sp)
    db.flush()
    db.add(SpaceMember(space_id=sp.id, user_id=user.id, role=Role.organizer))
    db.commit()
    db.refresh(sp)
    return sp


@router.get("", response_model=list[SpaceOut])
def list_spaces(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    stmt = (
        select(Space)
        .join(SpaceMember, SpaceMember.space_id == Space.id)
        .where(SpaceMember.user_id == user.id)
        .order_by(Space.created_at.desc())
    )
    return db.scalars(stmt).all()


@router.post("/join/{code}", response_model=SpaceOut)
def join_space(code: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    sp = db.scalar(select(Space).where(Space.invite_code == code))
    if not sp:
        raise HTTPException(404, "Invite not found")
    if not is_member(db, sp.id, user.id):
        db.add(SpaceMember(space_id=sp.id, user_id=user.id, role=Role.member))
        db.commit()
    return sp


@router.get("/{space_id}", response_model=SpaceOut)
def get_space(space_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    sp = db.get(Space, space_id)
    if not sp:
        raise HTTPException(404, "Space not found")
    if not is_member(db, space_id, user.id):
        raise HTTPException(403, "Not a member")
    return sp
