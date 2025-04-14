import torch
import torch.nn as nn
import numpy as np
from typing import Dict, Any, List, Union
import pandas as pd

class SimpleSignalClassifier(nn.Module):
    """A simple feedforward neural network for signal classification"""
    def __init__(self, input_dim):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(input_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 2)  # Binary classification: stress/no stress
        )
        
    def forward(self, x):
        return self.model(x)

class PhysiologicalStressDetector:
    def __init__(self, model_path: str = ""):
        """
        Initialize a simplified physiological signal-based stress detector.
        
        Args:
            model_path: Not used in this simplified version.
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # We'll initialize the model the first time we process data
        self.model = None
        self.initialized = False
        
        # Signal preprocessing parameters
        self.signal_names = ["HRV", "EDA", "ECG", "RESP", "TEMP", "BVP"]
        
        print("Using simplified PhysiologicalStressDetector (no TimeSeriesTransformer)")

    def initialize_model(self, num_features: int):
        """Initialize the model with the given number of features"""
        print(f"Initializing simple classifier with {num_features} features")
        self.model = SimpleSignalClassifier(num_features)
        self.model.to(self.device)
        self.model.eval()
        self.initialized = True

    def preprocess_signals(self, signals: Union[str, pd.DataFrame, np.ndarray]) -> torch.Tensor:
        """
        Preprocess physiological signals for the model.
        
        Args:
            signals: Either a path to a CSV file containing signals, a pandas DataFrame, or a numpy array
            
        Returns:
            Preprocessed signals as a tensor
        """
        # Load signals if file path is provided
        if isinstance(signals, str):
            signals_df = pd.read_csv(signals)
        elif isinstance(signals, pd.DataFrame):
            signals_df = signals
        elif isinstance(signals, np.ndarray):
            # Convert numpy array to DataFrame
            column_names = [f"Signal_{i+1}" for i in range(signals.shape[1])]
            signals_df = pd.DataFrame(signals, columns=column_names)
        else:
            raise ValueError("Signals must be a file path, DataFrame, or numpy array")
        
        # Basic preprocessing
        signals_np = signals_df.values
        
        # Normalize each signal
        for i in range(signals_np.shape[1]):
            if np.std(signals_np[:, i]) > 0:
                signals_np[:, i] = (signals_np[:, i] - np.mean(signals_np[:, i])) / np.std(signals_np[:, i])
        
        # We'll use the average of each signal as features
        features = np.mean(signals_np, axis=0)
        
        # Convert to tensor
        tensor_features = torch.FloatTensor(features).to(self.device)
        
        return tensor_features

    def predict(self, signals: Union[str, pd.DataFrame, np.ndarray]) -> Dict[str, Any]:
        """
        Predict stress from physiological signals.
        
        Args:
            signals: Either a path to a CSV file containing signals, a pandas DataFrame, or a numpy array
            
        Returns:
            Dictionary containing prediction and confidence scores
        """
        # Preprocess signals
        features = self.preprocess_signals(signals)
        
        # Initialize model if not already done
        if not self.initialized or self.model is None:
            self.initialize_model(features.shape[0])
        
        with torch.no_grad():
            # Get the feature values
            feature_vals = features.cpu().numpy()
            
            # Initialize default logits
            logits = torch.tensor([[0, 0]], device=self.device)
            
            # Get indices for all signals (handle cases with fewer signals)
            max_idx = len(feature_vals) - 1
            
            # Map indices to our expected signal order: HRV, EDA, ECG, RESP, TEMP, BVP
            hrv_idx = min(0, max_idx)  # Heart rate variability (lower during stress)
            eda_idx = min(1, max_idx)  # Electrodermal activity (higher during stress)
            ecg_idx = min(2, max_idx)  # ECG (can be elevated during stress)
            resp_idx = min(3, max_idx) # Respiration (can be faster/shallower during stress)
            temp_idx = min(4, max_idx) # Temperature (can increase during stress)
            bvp_idx = min(5, max_idx)  # Blood Volume Pulse (can increase during stress)
            
            # Get signal values if available
            hrv_val = feature_vals[hrv_idx] if hrv_idx <= max_idx else 0
            eda_val = feature_vals[eda_idx] if eda_idx <= max_idx else 0
            ecg_val = feature_vals[ecg_idx] if ecg_idx <= max_idx else 0
            resp_val = feature_vals[resp_idx] if resp_idx <= max_idx else 0
            temp_val = feature_vals[temp_idx] if temp_idx <= max_idx else 0
            bvp_val = feature_vals[bvp_idx] if bvp_idx <= max_idx else 0
            
            # Define stress indicators for each signal
            low_hrv = hrv_val < 0      # Low HRV indicates stress
            high_eda = eda_val > 0.5   # High EDA indicates stress
            high_ecg = ecg_val > 0.3   # Elevated ECG indicates stress
            low_resp = resp_val < 0    # Reduced respiration indicates stress
            high_temp = temp_val > 0.3 # Elevated temperature indicates stress
            high_bvp = bvp_val > 0.5   # Elevated BVP indicates stress
            
            # Count stress indicators
            stress_indicators = sum([low_hrv, high_eda, high_ecg, low_resp, high_temp, high_bvp])
            
            # Calculate stress probability based on number of stress indicators
            # More sophisticated weighting could be implemented here
            if stress_indicators >= 4:
                # Strong stress indicators (66% or more of signals indicate stress)
                logits = torch.tensor([[0.2, 0.8]], device=self.device)
            elif stress_indicators >= 3:
                # Moderate stress indicators (50% of signals indicate stress)
                logits = torch.tensor([[0.3, 0.7]], device=self.device)
            elif stress_indicators >= 2:
                # Mild stress indicators (33% of signals indicate stress)
                logits = torch.tensor([[0.4, 0.6]], device=self.device)
            elif stress_indicators >= 1:
                # Minimal stress indicators
                logits = torch.tensor([[0.6, 0.4]], device=self.device)
            else:
                # No stress indicators
                logits = torch.tensor([[0.8, 0.2]], device=self.device)
            
            # Calculate probabilities
            probabilities = torch.softmax(logits, dim=1)
            
            # Get probabilities
            no_stress_prob = probabilities[0][0].item()
            stress_prob = probabilities[0][1].item()
            
            # Make prediction
            prediction = 1 if stress_prob > no_stress_prob else 0
            
            return {
                "prediction": prediction,
                "confidence": {
                    "stress": stress_prob,
                    "no_stress": no_stress_prob
                },
                "indicators": {
                    "HRV": {"value": float(hrv_val), "indicates_stress": bool(low_hrv)},
                    "EDA": {"value": float(eda_val), "indicates_stress": bool(high_eda)},
                    "ECG": {"value": float(ecg_val), "indicates_stress": bool(high_ecg)},
                    "RESP": {"value": float(resp_val), "indicates_stress": bool(low_resp)},
                    "TEMP": {"value": float(temp_val), "indicates_stress": bool(high_temp)},
                    "BVP": {"value": float(bvp_val), "indicates_stress": bool(high_bvp)}
                }
            }
    
    def train(self, signals: List[Union[str, pd.DataFrame, np.ndarray]], labels: List[int],
              learning_rate: float = 1e-4, epochs: int = 10) -> None:
        """
        Train the model on physiological signals.
        
        Args:
            signals: List of signal data (file paths, DataFrames, or arrays)
            labels: List of corresponding labels (0: no stress, 1: stress)
            learning_rate: Learning rate for optimization
            epochs: Number of training epochs
        """
        print("Training not implemented in the simplified model. Using rule-based classification.") 