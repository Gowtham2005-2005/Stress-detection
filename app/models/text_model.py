from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from typing import Dict, Any
import os

class TextStressDetector:
    def __init__(self, model_path: str = "arpanghoshal/EmoRoBERTa"):
        """
        Initialize text-based stress detector using EmoRoBERTa, a RoBERTa model fine-tuned for emotion detection.
        This model can identify emotions like "anger", "fear", "sadness" which are correlated with stress.
        
        Args:
            model_path: Path to the pretrained model. Default is EmoRoBERTa.
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Check for Hugging Face credentials in environment
        use_auth_token = os.environ.get("HUGGINGFACE_TOKEN", None)
        
        try:
            # Try to load the model with authentication if available
            self.tokenizer = AutoTokenizer.from_pretrained(model_path, use_auth_token=use_auth_token)
            self.model = AutoModelForSequenceClassification.from_pretrained(model_path, use_auth_token=use_auth_token)
        except Exception as e:
            # If authentication fails or token is not available, fallback to a public model
            print(f"Error loading {model_path}: {str(e)}")
            print("Falling back to public emotion detection model...")
            backup_model = "j-hartmann/emotion-english-distilroberta-base"
            self.tokenizer = AutoTokenizer.from_pretrained(backup_model)
            self.model = AutoModelForSequenceClassification.from_pretrained(backup_model)
            
        self.model.to(self.device)
        self.model.eval()
        
        # Map of emotion labels
        self.id2label = self.model.config.id2label
        
        # Stress-related emotions (can be customized based on your specific needs)
        # Check the model's label set and adjust accordingly
        potential_stress_emotions = ["anger", "fear", "sadness", "disgust", "nervousness", 
                                     "angry", "sad", "fearful"]
        
        # Filter to only emotions that exist in this model's label set
        self.stress_emotions = [e for e in potential_stress_emotions 
                               if e in self.id2label.values()]

    def predict(self, text: str) -> Dict[str, Any]:
        """
        Predict if the text indicates stress based on emotional content.
        
        Args:
            text: Input text to analyze
            
        Returns:
            Dictionary containing prediction and confidence scores
        """
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=512
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1)
            
            # Get the emotion with highest probability
            emotion_idx = torch.argmax(probabilities, dim=1).item()
            emotion = self.id2label[emotion_idx]
            confidence = probabilities[0][emotion_idx].item()
            
            # Determine if the emotion indicates stress
            is_stress = emotion in self.stress_emotions
            
            # Calculate stress probability based on stress-related emotions
            stress_prob = 0.0
            for idx, label in self.id2label.items():
                if label in self.stress_emotions:
                    stress_prob += probabilities[0][idx].item()
            
            no_stress_prob = 1.0 - stress_prob
            
            return {
                "prediction": 1 if is_stress else 0,
                "emotion": emotion,
                "emotion_confidence": confidence,
                "confidence": {
                    "stress": stress_prob,
                    "no_stress": no_stress_prob
                }
            } 