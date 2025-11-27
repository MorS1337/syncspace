from .db import SessionLocal
from .models import Page, Role, Space, SpaceMember, Task, TaskStatus, User


def run():
    db = SessionLocal()
    try:
        owner = db.query(User).filter_by(name="Owner").first()
        if not owner:
            owner = User(name="Owner", email=None)
            db.add(owner)
            db.flush()

        member = db.query(User).filter_by(name="Member").first()
        if not member:
            member = User(name="Member", email=None)
            db.add(member)
            db.flush()

        sp = db.query(Space).filter_by(title="Demo Hack").first()
        if not sp:
            sp = Space(
                title="Demo Hack",
                description="demo",
                invite_code="DEMO123",
                created_by=owner.id,
            )
            db.add(sp)
            db.flush()
            db.add_all(
                [
                    SpaceMember(space_id=sp.id, user_id=owner.id, role=Role.organizer),
                    SpaceMember(space_id=sp.id, user_id=member.id, role=Role.member),
                ]
            )
            db.add_all(
                [
                    Page(space_id=sp.id, title="Brief", md_content="# Идея\nОписание..."),
                    Page(
                        space_id=sp.id, title="Plan", md_content="- [ ] API\n- [ ] UI"
                    ),  # хонер дранный хуесос
                ]
            )
            db.add_all(
                [
                    Task(space_id=sp.id, title="Setup repo", status=TaskStatus.todo),
                    Task(space_id=sp.id, title="Design schema", status=TaskStatus.in_progress),
                    Task(space_id=sp.id, title="Implement pages", status=TaskStatus.todo),
                ]
            )
        db.commit()
        print("Seed OK")
    finally:
        db.close()


if __name__ == "__main__":
    run()
