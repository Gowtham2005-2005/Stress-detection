from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
import os
import tempfile
from app.models.audio_model import AudioStressDetector
from app.core.config import settings

router = APIRouter()

# Initialize the voice detector with error handling
try:
    print("Initializing voice detector...")
    voice_detector = AudioStressDetector()
    print("Voice detector initialized successfully")
except Exception as e:
    print(f"Error initializing voice detector: {str(e)}")
    voice_detector = None  # Will be initialized on first request

class VoiceResponse(BaseModel):
    prediction: int
    confidence: dict
    emotion: Optional[str] = None
    emotion_confidence: Optional[float] = None
    message: Optional[str] = None

@router.post("/detect", response_model=VoiceResponse)
async def detect_stress(file: UploadFile = File(...)):
    # Initialize voice detector if not already done
    global voice_detector
    if voice_detector is None:
        try:
            voice_detector = AudioStressDetector()
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to initialize voice stress detector: {str(e)}"
            )
    
    try:
        # Create a temporary file to store the uploaded audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        try:
            result = voice_detector.predict(temp_file_path)
            message = "Stress detected" if result["prediction"] == 1 else "No stress detected"
            return VoiceResponse(
                prediction=result["prediction"],
                confidence=result["confidence"],
                emotion=result.get("emotion"),
                emotion_confidence=result.get("emotion_confidence"),
                message=message
            )
        finally:
            # Clean up the temporary file
            os.unlink(temp_file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 