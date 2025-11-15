from fastapi import FastAPI

from .routers import health, pages, spaces, tasks

app = FastAPI(title="Hack Platform API", version="0.1.0")

app.include_router(health.router, prefix="/api")
app.include_router(spaces.router)
app.include_router(pages.router)
app.include_router(tasks.router)


@app.get("/api")
def root():
    return {"ok": True}
