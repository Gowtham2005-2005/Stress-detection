from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from pydantic import BaseModel
from typing import Optional, List, Union, Dict, Any
import os
import tempfile
import json
import pandas as pd
import numpy as np
from app.models.combined_detector import CombinedStressDetector
from app.core.config import settings

router = APIRouter()
combined_detector = CombinedStressDetector(
    text_model_path=settings.TEXT_MODEL_PATH,
    signal_model_path=settings.SIGNAL_MODEL_PATH
)

class CombinedResponse(BaseModel):
    prediction: int
    confidence: dict
    individual_results: Dict[str, Optional[Dict[str, Any]]]
    message: Optional[str] = None

async def process_signals_data(signals_json: Optional[str] = Form(None)) -> Optional[pd.DataFrame]:
    """Process signals data from JSON string."""
    if not signals_json:
        return None
    
    try:
        signals_data = json.loads(signals_json)
        if isinstance(signals_data, dict):
            # If signals is a dictionary, convert to DataFrame
            return pd.DataFrame(signals_data)
        elif isinstance(signals_data, list):
            # If signals is a 2D list, convert to numpy array then to DataFrame
            signals_np = np.array(signals_data)
            
            # Make sure we have at least one row
            if len(signals_np) == 0:
                raise ValueError("Empty signals array provided")
            
            # Handle different dimensions
            num_features = signals_np.shape[1] if signals_np.ndim > 1 else 1
            if signals_np.ndim == 1:
                # Single feature, reshape to 2D
                signals_np = signals_np.reshape(-1, 1)
            
            # Create column names based on the actual number of features
            column_names = [f"Signal_{i+1}" for i in range(num_features)]
            
            # Log the shape for debugging
            print(f"Processing signals with shape: {signals_np.shape}, features: {num_features}")
            
            return pd.DataFrame(signals_np, columns=column_names)
        else:
            raise ValueError("Invalid signals data format")
    except Exception as e:
        print(f"Error processing signals data: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid signals data: {str(e)}")

@router.post("/detect", response_model=CombinedResponse)
async def detect_stress(
    text: Optional[str] = Form(None),
    audio_file: Optional[UploadFile] = File(None),
    signals: Optional[pd.DataFrame] = Depends(process_signals_data)
):
    """
    Detect stress using a combination of text, audio, and physiological signals.
    
    - text: Text content to analyze
    - audio_file: Audio file for voice analysis
    - signals: JSON string containing physiological signals data
    
    At least one of these inputs must be provided.
    """
    if not any([text, audio_file, signals]):
        raise HTTPException(
            status_code=400, 
            detail="At least one of text, audio_file, or signals must be provided"
        )
    
    temp_file_path = None
    try:
        # Process audio file if provided
        if audio_file:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
                content = await audio_file.read()
                temp_file.write(content)
                temp_file_path = temp_file.name
        
        # Make prediction using combined detector
        result = combined_detector.predict_combined(
            text=text,
            audio_file=temp_file_path,
            signals=signals
        )
        
        message = "Stress detected" if result["prediction"] == 1 else "No stress detected"
        return CombinedResponse(
            prediction=result["prediction"],
            confidence=result["confidence"],
            individual_results=result["individual_results"],
            message=message
        )
    except Exception as e:
        print(f"Error in combined endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temporary file if created
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path) 