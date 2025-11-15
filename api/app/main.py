from fastapi import FastAPI

from .routers import health

app = FastAPI(title="Hack Platform API", version="0.1.0")


@app.get("/api")
def root():
    return {"ok": True, "service": "hack-platform"}


app.include_router(health.router, prefix="/api")
