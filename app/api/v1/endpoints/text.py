from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.models.text_model import TextStressDetector
from app.core.config import settings

router = APIRouter()
text_detector = TextStressDetector(settings.TEXT_MODEL_PATH)

class TextRequest(BaseModel):
    text: str

class TextResponse(BaseModel):
    prediction: int
    confidence: dict
    emotion: Optional[str] = None
    emotion_confidence: Optional[float] = None
    message: Optional[str] = None

@router.post("/detect", response_model=TextResponse)
async def detect_stress(request: TextRequest):
    try:
        result = text_detector.predict(request.text)
        message = "Stress detected" if result["prediction"] == 1 else "No stress detected"
        return TextResponse(
            prediction=result["prediction"],
            confidence=result["confidence"],
            emotion=result.get("emotion"),
            emotion_confidence=result.get("emotion_confidence"),
            message=message
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 