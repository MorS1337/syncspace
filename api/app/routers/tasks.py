from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db, is_member
from app.models import Tag, Task, TaskStatus, User
from app.schemas import TaskCreate, TaskOut, TaskPatch
from app.ws import manager

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


def ensure_member(db: Session, space_id: int, uid: int):
    if not is_member(db, space_id, uid):
        raise HTTPException(403, "Not a member")


@router.get("/by-space/{space_id}", response_model=list[TaskOut])
def list_tasks(
    space_id: int,
    status: str | None = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ensure_member(db, space_id, user.id)
    stmt = select(Task).where(Task.space_id == space_id)
    if status:
        stmt = stmt.where(Task.status == TaskStatus(status))
    return db.execute(stmt.order_by(Task.created_at.desc())).scalars().all()


@router.post("", response_model=TaskOut)
async def create_task(
    payload: TaskCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    ensure_member(db, payload.space_id, user.id)
    if payload.assignee_id:
        # исполняющий должен быть членом space
        if not is_member(db, payload.space_id, payload.assignee_id):
            raise HTTPException(400, "Assignee must be a space member")
    t = Task(
        space_id=payload.space_id,
        title=payload.title,
        description=payload.description,
        due_at=payload.due_at,
        assignee_id=payload.assignee_id,
        priority=payload.priority,
        created_by=user.id,
    )

    # Handle tags
    if payload.tag_ids:
        tags = db.execute(select(Tag).where(Tag.id.in_(payload.tag_ids))).scalars().all()
        t.tags = tags

    db.add(t)
    db.commit()
    db.refresh(t)
    await manager.broadcast(f"task_created:{t.space_id}")
    return t


@router.patch("/{task_id}", response_model=TaskOut)
async def patch_task(
    task_id: int,
    payload: TaskPatch,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    t = db.get(Task, task_id)
    if not t:
        raise HTTPException(404, "Task not found")
    ensure_member(db, t.space_id, user.id)

    if payload.title is not None:
        t.title = payload.title
    if payload.description is not None:
        t.description = payload.description
    if payload.status is not None:
        t.status = TaskStatus(payload.status)
    if payload.assignee_id is not None:
        if not is_member(db, t.space_id, payload.assignee_id):
            raise HTTPException(400, "Assignee must be a space member")
        t.assignee_id = payload.assignee_id
    if payload.due_at is not None:
        t.due_at = payload.due_at
    if payload.priority is not None:
        t.priority = payload.priority
    if payload.tag_ids is not None:
        tags = db.execute(select(Tag).where(Tag.id.in_(payload.tag_ids))).scalars().all()
        t.tags = tags

    db.commit()
    db.refresh(t)
    await manager.broadcast(f"task_updated:{t.space_id}")
    return t


@router.delete("/{task_id}")
async def delete_task(
    task_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    t = db.get(Task, task_id)
    if not t:
        raise HTTPException(404, "Task not found")
    ensure_member(db, t.space_id, user.id)
    db.delete(t)
    db.commit()
    await manager.broadcast(f"task_deleted:{t.space_id}")
    return {"ok": True}
