from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db, is_member
from app.models import Task, TaskStatus, User
from app.schemas import TaskCreate, TaskOut, TaskPatch

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
def create_task(
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
        created_by=user.id,
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@router.patch("/{task_id}", response_model=TaskOut)
def patch_task(
    task_id: int,
    payload: TaskPatch,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    t = db.get(Task, task_id)
    if not t:
        raise HTTPException(404, "Task not found")
    ensure_member(db, t.space_id, user.id)
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
    db.commit()
    db.refresh(t)
    return t
