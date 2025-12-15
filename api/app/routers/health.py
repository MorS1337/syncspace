from fastapi import APIRouter

router = APIRouter(tags=["health"])


# НЕ ТРОГАТЬ
@router.get("/health")
def health():
    return {"status": "ok"}
