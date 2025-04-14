from fastapi import APIRouter
from app.api.v1.endpoints import text, voice, signal, combined

api_router = APIRouter()

api_router.include_router(text.router, prefix="/text", tags=["text"])
api_router.include_router(voice.router, prefix="/voice", tags=["voice"])
api_router.include_router(signal.router, prefix="/signal", tags=["signal"])
api_router.include_router(combined.router, prefix="/combined", tags=["combined"]) 