from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db
from app.models import SpaceMember, User

router = APIRouter(prefix="/api/spaces", tags=["members"])


def is_member(db: Session, space_id: int, user_id: int) -> bool:
    """Check if user is a member of the space"""
    stmt = select(SpaceMember).where(
        SpaceMember.space_id == space_id, SpaceMember.user_id == user_id
    )
    return db.scalar(stmt) is not None


@router.get("/{space_id}/members")
def list_members(
    space_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    """Get all members of a space with their roles"""
    # Check if user is a member
    if not is_member(db, space_id, user.id):
        raise HTTPException(403, "Not a member of this space")

    # Get all members with user info
    stmt = (
        select(SpaceMember, User)
        .join(User, SpaceMember.user_id == User.id)
        .where(SpaceMember.space_id == space_id)
        .order_by(SpaceMember.joined_at)
    )

    results = db.execute(stmt).all()

    members = []
    for member_row, user_row in results:
        members.append(
            {
                "user_id": user_row.id,
                "name": user_row.name,
                "email": user_row.email,
                "avatar_url": user_row.avatar_url,
                "role": member_row.role.value,
                "joined_at": member_row.joined_at,
            }
        )

    return members


@router.delete("/{space_id}/members/{user_id}")
def remove_member(
    space_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Remove a member from space (organizer only)"""
    # Check if current user is organizer
    current_member = db.scalar(
        select(SpaceMember).where(SpaceMember.space_id == space_id, SpaceMember.user_id == user.id)
    )

    if not current_member or current_member.role.value != "organizer":
        raise HTTPException(403, "Only organizers can remove members")

    # Can't remove yourself
    if user_id == user.id:
        raise HTTPException(400, "Cannot remove yourself from space")

    # Remove the member
    member_to_remove = db.scalar(
        select(SpaceMember).where(SpaceMember.space_id == space_id, SpaceMember.user_id == user_id)
    )

    if not member_to_remove:
        raise HTTPException(404, "Member not found")

    db.delete(member_to_remove)
    db.commit()

    return {"message": "Member removed"}


@router.patch("/{space_id}/members/{user_id}")
def update_member_role(
    space_id: int,
    user_id: int,
    payload: dict,  # {"role": "member" | "organizer" | "mentor"}
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Change member role (organizer only)"""
    from app.models import Role

    # Check if current user is organizer
    current_member = db.scalar(
        select(SpaceMember).where(SpaceMember.space_id == space_id, SpaceMember.user_id == user.id)
    )

    if not current_member or current_member.role.value != "organizer":
        raise HTTPException(403, "Only organizers can change roles")

    new_role = payload.get("role")
    if new_role not in ["member", "organizer", "mentor"]:
        raise HTTPException(400, "Invalid role")

    # Update the member
    member_to_update = db.scalar(
        select(SpaceMember).where(SpaceMember.space_id == space_id, SpaceMember.user_id == user_id)
    )

    if not member_to_update:
        raise HTTPException(404, "Member not found")

    member_to_update.role = Role[new_role]
    db.commit()

    return {"message": "Role updated"}
