from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel


class SpaceCreate(BaseModel):
    title: str
    description: Optional[str] = None


class SpaceOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    invite_code: str

    class Config:
        from_attributes = True


class PageCreate(BaseModel):
    space_id: int
    title: str


class PageUpdate(BaseModel):
    md_content: str


class PageOut(BaseModel):
    id: int
    space_id: int
    title: str
    md_content: str

    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    space_id: int
    title: str
    description: str = ""
    due_at: Optional[datetime] = None
    assignee_id: Optional[int] = None


class TaskPatch(BaseModel):
    status: Optional[Literal["todo", "in_progress", "done"]] = None
    assignee_id: Optional[int] = None
    due_at: Optional[datetime] = None
    priority: Optional[int] = None


class TaskOut(BaseModel):
    id: int
    space_id: int
    title: str
    description: str
    status: str
    priority: int
    assignee_id: Optional[int]
    due_at: Optional[datetime]

    class Config:
        from_attributes = True
