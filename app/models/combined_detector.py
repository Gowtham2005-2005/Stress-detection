from typing import Dict, Any, Union, Optional, List
import numpy as np
import pandas as pd
from .text_model import TextStressDetector
from .audio_model import AudioStressDetector
from .signal_model import PhysiologicalStressDetector

class CombinedStressDetector:
    def __init__(self, 
                 text_model_path: Optional[str] = None,
                 audio_model_path: Optional[str] = None,
                 signal_model_path: Optional[str] = "",
                 weights: Optional[List[float]] = None):
        """
        Initialize a combined stress detector that integrates text, audio, and physiological signal models.
        
        Args:
            text_model_path: Path to the pretrained text model
            audio_model_path: Not used for audio model (simplified version)
            signal_model_path: Path to the pretrained signal model
            weights: Weights for each model in the ensemble [text, audio, signal]
        """
        # Initialize the individual models with fallbacks
        text_model = text_model_path if text_model_path else "j-hartmann/emotion-english-distilroberta-base"
        
        print(f"Initializing Text Model: {text_model}")
        self.text_detector = TextStressDetector(model_path=text_model)
        
        print("Initializing Audio Model (simplified version)")
        self.audio_detector = AudioStressDetector()
        
        print(f"Initializing Signal Model: {signal_model_path}")
        self.signal_detector = PhysiologicalStressDetector(model_path=signal_model_path)
        
        # Set weights for ensemble (default: equal weights)
        self.weights = weights if weights else [1/3, 1/3, 1/3]
        print(f"Using weights: {self.weights}")
        
    def predict_from_text(self, text: str) -> Dict[str, Any]:
        """
        Predict stress from text.
        
        Args:
            text: Input text to analyze
            
        Returns:
            Prediction results
        """
        return self.text_detector.predict(text)
    
    def predict_from_audio(self, audio_file: str) -> Dict[str, Any]:
        """
        Predict stress from audio.
        
        Args:
            audio_file: Path to the audio file
            
        Returns:
            Prediction results
        """
        return self.audio_detector.predict(audio_file)
    
    def predict_from_signals(self, signals: Union[str, pd.DataFrame, np.ndarray]) -> Dict[str, Any]:
        """
        Predict stress from physiological signals.
        
        Args:
            signals: Signal data (file path, DataFrame, or array)
            
        Returns:
            Prediction results
        """
        return self.signal_detector.predict(signals)
    
    def predict_combined(self, 
                         text: Optional[str] = None,
                         audio_file: Optional[str] = None,
                         signals: Optional[Union[str, pd.DataFrame, np.ndarray]] = None) -> Dict[str, Any]:
        """
        Make a combined prediction using available modalities.
        
        Args:
            text: Input text (optional)
            audio_file: Path to audio file (optional)
            signals: Signal data (optional)
            
        Returns:
            Combined prediction results
        """
        results = []
        active_weights = []
        
        # Collect available predictions
        if text is not None:
            text_result = self.predict_from_text(text)
            results.append(text_result)
            active_weights.append(self.weights[0])
        
        if audio_file is not None:
            audio_result = self.predict_from_audio(audio_file)
            results.append(audio_result)
            active_weights.append(self.weights[1])
        
        if signals is not None:
            signal_result = self.predict_from_signals(signals)
            results.append(signal_result)
            active_weights.append(self.weights[2])
        
        if not results:
            raise ValueError("At least one input modality must be provided.")
        
        # Normalize weights
        active_weights = [w / sum(active_weights) for w in active_weights]
        
        # Calculate weighted stress probability
        stress_prob = sum(r["confidence"]["stress"] * w for r, w in zip(results, active_weights))
        no_stress_prob = sum(r["confidence"]["no_stress"] * w for r, w in zip(results, active_weights))
        
        # Make final prediction
        prediction = 1 if stress_prob > no_stress_prob else 0
        
        # Prepare detailed results
        combined_result = {
            "prediction": prediction,
            "confidence": {
                "stress": stress_prob,
                "no_stress": no_stress_prob
            },
            "individual_results": {
                "text": results[0] if text is not None else None,
                "audio": results[1] if audio_file is not None and text is not None else 
                         results[0] if audio_file is not None and text is None else None,
                "physiological": results[-1] if signals is not None else None
            }
        }
        
        return combined_result 