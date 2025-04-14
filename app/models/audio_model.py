import torch
import numpy as np
from typing import Dict, Any
import librosa
import os
from transformers import Wav2Vec2FeatureExtractor, Wav2Vec2Model, AutoConfig
import torch.nn as nn

class AudioTransformerClassifier(nn.Module):
    """Transformer-based audio classifier for stress detection"""
    def __init__(self, base_model='facebook/wav2vec2-base', num_classes=2):
        super().__init__()
        self.config = AutoConfig.from_pretrained(base_model)
        self.wav2vec = Wav2Vec2Model.from_pretrained(base_model)
        # Freeze base model params for efficiency
        for param in self.wav2vec.parameters():
            param.requires_grad = False
        
        # Create classifier on top of transformer output
        self.classifier = nn.Sequential(
            nn.Linear(self.config.hidden_size, 256),
            nn.Dropout(0.1),
            nn.ReLU(),
            nn.Linear(256, num_classes)
        )
        
    def forward(self, x):
        # Get transformer features
        with torch.no_grad():
            outputs = self.wav2vec(x)
            # Use the mean of last hidden state as features
            features = torch.mean(outputs.last_hidden_state, dim=1)
        
        # Pass through classifier
        return self.classifier(features)

class AudioStressDetector:
    def __init__(self, model_path: str = None):
        """
        Initialize audio-based stress detector using Wav2Vec2 transformer.
        
        Args:
            model_path: Not used directly, we use a public Wav2Vec2 model.
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Load public Wav2Vec2 model
        base_model = 'facebook/wav2vec2-base'
        
        try:
            # Load model and feature extractor
            self.feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(base_model)
            self.model = AudioTransformerClassifier(base_model=base_model)
            self.model.to(self.device)
            self.model.eval()
            print(f"Successfully loaded transformer-based audio model using {base_model}")
        except Exception as e:
            raise RuntimeError(f"Failed to load audio transformer model: {str(e)}")
        
        # Default sampling rate for audio processing
        self.sampling_rate = 16000
        
        # Define emotion categories for stress detection
        self.emotions = ["neutral", "calm", "happy", "sad", "angry", "fearful", "disgust", "surprised"]
        
        # Define which emotions typically indicate stress
        self.stress_emotions = ["angry", "fearful", "sad", "disgust"]

    def preprocess_audio(self, audio_file: str) -> np.ndarray:
        """
        Preprocess audio file for the model.
        
        Args:
            audio_file: Path to the audio file
            
        Returns:
            Preprocessed audio array
        """
        # Load audio with librosa
        audio_data, sr = librosa.load(audio_file, sr=self.sampling_rate)
        
        # If audio is stereo, convert to mono
        if len(audio_data.shape) > 1:
            audio_data = librosa.to_mono(audio_data)
            
        return audio_data

    def extract_features(self, audio_data: np.ndarray) -> torch.Tensor:
        """Extract features from audio using Wav2Vec2"""
        inputs = self.feature_extractor(
            audio_data, 
            sampling_rate=self.sampling_rate, 
            return_tensors="pt", 
            padding=True
        ).input_values.to(self.device)
        
        return inputs

    def predict(self, audio_file: str) -> Dict[str, Any]:
        """
        Predict stress from audio file.
        
        Args:
            audio_file: Path to the audio file
            
        Returns:
            Dictionary containing prediction and confidence scores
        """
        # Preprocess the audio
        audio_data = self.preprocess_audio(audio_file)
        
        # Extract features using transformer
        features = self.extract_features(audio_data)
        
        # Make prediction using transformer model
        with torch.no_grad():
            # Get model output
            logits = self.model(features)
            probabilities = torch.softmax(logits, dim=1)
            
            # Get stress probabilities (binary classification: 0=no stress, 1=stress)
            no_stress_prob = probabilities[0][0].item()
            stress_prob = probabilities[0][1].item()
            
            # Map to an emotion for better interpretability
            emotion_index = 3 if stress_prob > 0.6 else (2 if stress_prob > 0.3 else 4)  # Map to sad, happy, or neutral
            emotion = self.emotions[emotion_index]
            
            # Create final prediction
            return {
                "prediction": 1 if stress_prob > no_stress_prob else 0,
                "emotion": emotion,
                "emotion_confidence": max(stress_prob, no_stress_prob),
                "confidence": {
                    "stress": stress_prob,
                    "no_stress": no_stress_prob
                }
            } 