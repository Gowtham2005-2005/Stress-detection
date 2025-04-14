from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Union, Dict
import pandas as pd
import numpy as np
from app.models.signal_model import PhysiologicalStressDetector
from app.core.config import settings

router = APIRouter()
signal_detector = PhysiologicalStressDetector(settings.SIGNAL_MODEL_PATH)

class SignalData(BaseModel):
    signals: Union[List[List[float]], dict]  # Can be a 2D array or a dictionary of signals

class SignalResponse(BaseModel):
    prediction: int
    confidence: dict
    message: Optional[str] = None

@router.post("/detect", response_model=SignalResponse)
async def detect_stress(data: SignalData):
    try:
        # Convert input data to the format expected by PhysiologicalStressDetector
        if isinstance(data.signals, dict):
            # If signals is a dictionary, convert to DataFrame
            signals_df = pd.DataFrame(data.signals)
        else:
            # If signals is a 2D list, convert to numpy array then to DataFrame
            signals_np = np.array(data.signals)
            # Make sure we have at least one row
            if len(signals_np) == 0:
                raise ValueError("Empty signals array provided")
            
            # Use default column names based on the number of channels
            num_features = signals_np.shape[1] if signals_np.ndim > 1 else 1
            if signals_np.ndim == 1:
                # Single feature, reshape to 2D
                signals_np = signals_np.reshape(-1, 1)
                
            # Create column names based on the actual number of features
            signal_names = [f"Signal_{i+1}" for i in range(num_features)]
            signals_df = pd.DataFrame(signals_np, columns=signal_names)
        
        # Log the shape for debugging
        print(f"Input signal shape: {signals_df.shape}")
        
        result = signal_detector.predict(signals_df)
        message = "Stress detected" if result["prediction"] == 1 else "No stress detected"
        return SignalResponse(
            prediction=result["prediction"],
            confidence=result["confidence"],
            message=message
        )
    except Exception as e:
        print(f"Error in signal endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 