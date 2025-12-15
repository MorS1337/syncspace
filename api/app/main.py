from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from .routers import auth, health, members, pages, spaces, tags, tasks
from .ws import manager

app = FastAPI(title="Hack Platform API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(auth.router)
app.include_router(spaces.router)
app.include_router(pages.router)
app.include_router(tasks.router)
app.include_router(members.router)
app.include_router(tags.router)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Message: {data}")
    except Exception:
        manager.disconnect(websocket)


@app.get("/api")
def root():
    return {"ok": True}
