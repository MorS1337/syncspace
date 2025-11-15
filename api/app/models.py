from __future__ import annotations

import enum
from typing import List, Optional

from sqlalchemy import TIMESTAMP, Enum, ForeignKey, String, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


# Роли в спейсе
class Role(enum.Enum):
    member = "member"
    organizer = "organizer"
    mentor = "mentor"


# Статусы задач
class TaskStatus(enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), unique=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(512))
    created_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())


class Space(Base):
    __tablename__ = "spaces"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    invite_code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    created_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())

    pages: Mapped[List["Page"]] = relationship(back_populates="space", cascade="all, delete-orphan")
    tasks: Mapped[List["Task"]] = relationship(back_populates="space", cascade="all, delete-orphan")


class SpaceMember(Base):
    __tablename__ = "space_members"
    space_id: Mapped[int] = mapped_column(
        ForeignKey("spaces.id", ondelete="CASCADE"), primary_key=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    role: Mapped[Role] = mapped_column(
        Enum(Role, native_enum=False), nullable=False, default=Role.member
    )
    joined_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())


class Page(Base):
    __tablename__ = "pages"
    id: Mapped[int] = mapped_column(primary_key=True)
    space_id: Mapped[int] = mapped_column(ForeignKey("spaces.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    md_content: Mapped[str] = mapped_column(Text, default="")
    locked_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))
    updated_at: Mapped[str] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    space: Mapped["Space"] = relationship(back_populates="pages")


class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    space_id: Mapped[int] = mapped_column(ForeignKey("spaces.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, native_enum=False), default=TaskStatus.todo, index=True
    )
    priority: Mapped[int] = mapped_column(default=0)
    due_at: Mapped[Optional[str]] = mapped_column(TIMESTAMP(timezone=True))
    assignee_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))
    created_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at: Mapped[str] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    space: Mapped["Space"] = relationship(back_populates="tasks")


class Message(Base):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(primary_key=True)
    space_id: Mapped[int] = mapped_column(ForeignKey("spaces.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
