import torch
import torchaudio
from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2FeatureExtractor
import numpy as np
from typing import Dict, Any

class VoiceStressDetector:
    def __init__(self, model_path: str = "facebook/wav2vec2-base-960h"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(model_path)
        self.model = Wav2Vec2ForSequenceClassification.from_pretrained(model_path, num_labels=2)
        self.model.to(self.device)
        self.model.eval()

    def preprocess_audio(self, audio_path: str) -> torch.Tensor:
        waveform, sample_rate = torchaudio.load(audio_path)
        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(sample_rate, 16000)
            waveform = resampler(waveform)
        return waveform.squeeze()

    def predict(self, audio_path: str) -> Dict[str, Any]:
        try:
            # Load and preprocess audio
            waveform = self.preprocess_audio(audio_path)
            
            # Extract features
            inputs = self.feature_extractor(
                waveform,
                sampling_rate=16000,
                return_tensors="pt",
                padding=True
            ).to(self.device)

            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                probabilities = torch.softmax(logits, dim=1)
                
                stress_prob = probabilities[0][1].item()
                no_stress_prob = probabilities[0][0].item()
                
                prediction = 1 if stress_prob > no_stress_prob else 0
                
                return {
                    "prediction": prediction,
                    "confidence": {
                        "stress": stress_prob,
                        "no_stress": no_stress_prob
                    }
                }
        except Exception as e:
            raise Exception(f"Error processing audio: {str(e)}") 