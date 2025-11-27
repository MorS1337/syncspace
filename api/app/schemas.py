from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel


class UserOut(BaseModel):
    id: int
    name: str
    email: Optional[str] = None

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    name: str
    password: str
    email: Optional[str] = None


class UserLogin(BaseModel):
    name: str
    password: str


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
    priority: int = 0
    tag_ids: list[int] = []


class TaskPatch(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal["todo", "in_progress", "done"]] = None
    assignee_id: Optional[int] = None
    due_at: Optional[datetime] = None
    priority: Optional[int] = None
    tag_ids: Optional[list[int]] = None


class TaskOut(BaseModel):
    id: int
    space_id: int
    title: str
    description: str
    status: str
    priority: int
    assignee_id: Optional[int]
    due_at: Optional[datetime]
    tag_ids: list[int] = []

    class Config:
        from_attributes = True
