from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.deps import get_db, is_member
from app.models import Page
from app.schemas import PageCreate, PageOut, PageUpdate

from .spaces import current_user_id

router = APIRouter(prefix="/api/pages", tags=["pages"])


def ensure_member(db: Session, space_id: int, uid: int):
    if not is_member(db, space_id, uid):
        raise HTTPException(403, "Not a member")


@router.get("/by-space/{space_id}", response_model=list[PageOut])
def list_pages(space_id: int, db: Session = Depends(get_db), uid: int = Depends(current_user_id)):
    ensure_member(db, space_id, uid)
    rows = (
        db.execute(select(Page).where(Page.space_id == space_id).order_by(Page.updated_at.desc()))
        .scalars()
        .all()
    )
    return rows


@router.post("", response_model=PageOut)
def create_page(
    payload: PageCreate, db: Session = Depends(get_db), uid: int = Depends(current_user_id)
):
    ensure_member(db, payload.space_id, uid)
    page = Page(space_id=payload.space_id, title=payload.title, md_content="")
    db.add(page)
    db.commit()
    db.refresh(page)
    return page


@router.get("/{page_id}", response_model=PageOut)
def get_page(page_id: int, db: Session = Depends(get_db), uid: int = Depends(current_user_id)):
    page = db.get(Page, page_id)
    if not page:
        raise HTTPException(404, "Page not found")
    ensure_member(db, page.space_id, uid)
    return page


@router.put("/{page_id}", response_model=PageOut)
def update_page(
    page_id: int,
    payload: PageUpdate,
    db: Session = Depends(get_db),
    uid: int = Depends(current_user_id),
):
    page = db.get(Page, page_id)
    if not page:
        raise HTTPException(404, "Page not found")
    ensure_member(db, page.space_id, uid)
    page.md_content = payload.md_content
    db.commit()
    db.refresh(page)
    return page
