import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.deps import get_db, is_member
from app.models import Role, Space, SpaceMember, User
from app.schemas import SpaceCreate, SpaceOut

router = APIRouter(prefix="/api/spaces", tags=["spaces"])


def _invite() -> str:
    return secrets.token_urlsafe(6)


# ВРЕМЕННО: user_id берём как 1 (автор), потом прикрутим auth
def current_user_id() -> int:
    return 1


@router.post("", response_model=SpaceOut)
def create_space(
    payload: SpaceCreate, db: Session = Depends(get_db), uid: int = Depends(current_user_id)
):
    user = db.get(User, uid) or User(name="Owner")
    db.add(user)
    db.flush()
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
    return sp


@router.post("/join/{code}", response_model=SpaceOut)
def join_space(code: str, db: Session = Depends(get_db)):
    sp = db.scalar(select(Space).where(Space.invite_code == code))
    if not sp:
        raise HTTPException(404, "Invite not found")
    member = db.get(User, 2) or User(name="Member")
    db.add(member)
    db.flush()
    if not is_member(db, sp.id, member.id):
        db.add(SpaceMember(space_id=sp.id, user_id=member.id, role=Role.member))
        db.commit()
    return sp


@router.get("/{space_id}", response_model=SpaceOut)
def get_space(space_id: int, db: Session = Depends(get_db), uid: int = Depends(current_user_id)):
    if not db.get(Space, space_id):
        raise HTTPException(404, "Space not found")
    if not is_member(db, space_id, uid):
        raise HTTPException(403, "Not a member")
    return db.get(Space, space_id)
