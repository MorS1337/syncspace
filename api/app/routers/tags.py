from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db
from app.models import Tag, User

router = APIRouter(prefix="/tags", tags=["tags"])


class TagCreate(BaseModel):
    space_id: int
    name: str
    color: str = "#3b82f6"


class TagResponse(BaseModel):
    id: int
    space_id: int
    name: str
    color: str

    class Config:
        from_attributes = True


@router.get("/space/{space_id}", response_model=List[TagResponse])
def get_space_tags(
    space_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    stmt = select(Tag).where(Tag.space_id == space_id)
    tags = db.execute(stmt).scalars().all()
    return tags


@router.post("/", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
def create_tag(
    tag_data: TagCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    tag = Tag(space_id=tag_data.space_id, name=tag_data.name, color=tag_data.color)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(tag_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tag = db.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    db.delete(tag)
    db.commit()
    return None
