from datetime import datetime, timezone

import pytest
from app.deps import get_db
from app.main import app
from app.models import Base
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

TEST_DATABASE_URL = "sqlite+pysqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def prepare_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


@pytest.fixture
def db_session(prepare_database):
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.pop(get_db, None)


def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_space_pages_tasks_flow(client):
    space_response = client.post(
        "/api/spaces",
        json={"title": "Demo space", "description": "Test description"},
    )
    assert space_response.status_code == 200
    space = space_response.json()
    space_id = space["id"]
    assert space["title"] == "Demo space"
    assert space["invite_code"]

    list_spaces = client.get("/api/spaces")
    assert list_spaces.status_code == 200
    assert any(row["id"] == space_id for row in list_spaces.json())

    get_space = client.get(f"/api/spaces/{space_id}")
    assert get_space.status_code == 200
    assert get_space.json()["id"] == space_id

    page_response = client.post(
        "/api/pages",
        json={"space_id": space_id, "title": "Overview"},
    )
    assert page_response.status_code == 200
    page = page_response.json()
    assert page["title"] == "Overview"
    assert page["space_id"] == space_id

    get_page = client.get(f"/api/pages/{page['id']}")
    assert get_page.status_code == 200
    assert get_page.json()["id"] == page["id"]

    list_pages = client.get(f"/api/pages/by-space/{space_id}")
    assert list_pages.status_code == 200
    assert len(list_pages.json()) == 1

    due_at = datetime(2025, 1, 1, tzinfo=timezone.utc).isoformat()
    task_response = client.post(
        "/api/tasks",
        json={
            "space_id": space_id,
            "title": "Ship MVP",
            "description": "Finish the core features",
            "due_at": due_at,
            "assignee_id": 1,
        },
    )
    assert task_response.status_code == 200
    task = task_response.json()
    task_id = task["id"]
    assert task["title"] == "Ship MVP"
    assert task["status"] == "todo"
    assert task["assignee_id"] == 1

    patch_response = client.patch(
        f"/api/tasks/{task_id}",
        json={"status": "in_progress", "priority": 5},
    )
    assert patch_response.status_code == 200
    patched_task = patch_response.json()
    assert patched_task["status"] == "in_progress"
    assert patched_task["priority"] == 5

    list_tasks = client.get(f"/api/tasks/by-space/{space_id}?status=in_progress")
    assert list_tasks.status_code == 200
    tasks = list_tasks.json()
    assert len(tasks) == 1
    assert tasks[0]["id"] == task_id
