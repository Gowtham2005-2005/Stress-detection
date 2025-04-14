import os
import numpy as np
import pandas as pd
from models.text_model import TextStressDetector
from models.audio_model import AudioStressDetector
from models.signal_model import PhysiologicalStressDetector
from models.combined_detector import CombinedStressDetector

def demo_text_stress_detection():
    """
    Demonstrates text-based stress detection.
    """
    print("="*80)
    print("Text-based Stress Detection Demo")
    print("="*80)
    
    # Initialize text stress detector
    text_detector = TextStressDetector()
    
    # Example texts
    texts = [
        "I'm feeling so overwhelmed with all this work and I don't know how to cope.",
        "I'm scared I won't be able to finish everything on time, my heart is racing.",
        "I had a great day at the beach, really enjoyed the sunshine and relaxation.",
        "Just finished my project ahead of schedule and everything worked perfectly!"
    ]
    
    # Make predictions
    for text in texts:
        result = text_detector.predict(text)
        print(f"\nText: {text}")
        print(f"Prediction: {'Stressed' if result['prediction'] == 1 else 'Not Stressed'}")
        print(f"Emotion: {result.get('emotion', 'N/A')}")
        print(f"Confidence: Stress = {result['confidence']['stress']:.4f}, No Stress = {result['confidence']['no_stress']:.4f}")
        print("-"*80)

def demo_audio_stress_detection():
    """
    Demonstrates audio-based stress detection.
    """
    print("="*80)
    print("Audio-based Stress Detection Demo")
    print("="*80)
    
    # Check if audio files exist
    audio_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "audio_samples")
    if not os.path.exists(audio_dir):
        print(f"Audio directory not found. Please create a directory at {audio_dir} with audio samples.")
        print("Skipping audio demo.")
        return
    
    # Initialize audio stress detector
    audio_detector = AudioStressDetector()
    
    # Find audio samples
    audio_files = [os.path.join(audio_dir, f) for f in os.listdir(audio_dir) if f.endswith(('.wav', '.mp3'))]
    
    if not audio_files:
        print(f"No audio files found in {audio_dir}. Please add .wav or .mp3 files.")
        print("Skipping audio demo.")
        return
    
    # Make predictions
    for audio_file in audio_files:
        try:
            result = audio_detector.predict(audio_file)
            print(f"\nAudio: {os.path.basename(audio_file)}")
            print(f"Prediction: {'Stressed' if result['prediction'] == 1 else 'Not Stressed'}")
            print(f"Emotion: {result.get('emotion', 'N/A')}")
            print(f"Confidence: Stress = {result['confidence']['stress']:.4f}, No Stress = {result['confidence']['no_stress']:.4f}")
        except Exception as e:
            print(f"Error processing {os.path.basename(audio_file)}: {str(e)}")
        print("-"*80)

def demo_signal_stress_detection():
    """
    Demonstrates physiological signal-based stress detection.
    """
    print("="*80)
    print("Physiological Signal-based Stress Detection Demo")
    print("="*80)
    
    # Check if signal files exist
    signal_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "signal_samples")
    if not os.path.exists(signal_dir):
        print(f"Signal directory not found. Creating a synthetic example...")
        
        # Create a synthetic signal dataset
        time = np.linspace(0, 60, 1000)  # 60 seconds of data at 16.67 Hz
        
        # Normal condition (relaxed)
        heart_rate_normal = 70 + 5 * np.sin(2 * np.pi * 0.1 * time) + np.random.normal(0, 1, size=len(time))
        eda_normal = 2 + 0.1 * np.sin(2 * np.pi * 0.05 * time) + np.random.normal(0, 0.05, size=len(time))
        
        # Stress condition
        heart_rate_stress = 90 + 10 * np.sin(2 * np.pi * 0.2 * time) + np.random.normal(0, 2, size=len(time))
        eda_stress = 5 + 0.5 * np.sin(2 * np.pi * 0.1 * time) + np.random.normal(0, 0.2, size=len(time))
        
        # Create dataframes
        normal_signals = pd.DataFrame({
            'HRV': heart_rate_normal,
            'EDA': eda_normal,
            'ECG': np.random.normal(0, 1, size=len(time)),
            'RESP': 12 + 2 * np.sin(2 * np.pi * 0.2 * time) + np.random.normal(0, 0.5, size=len(time)),
            'TEMP': 36.5 + 0.1 * np.sin(2 * np.pi * 0.01 * time) + np.random.normal(0, 0.05, size=len(time))
        })
        
        stress_signals = pd.DataFrame({
            'HRV': heart_rate_stress,
            'EDA': eda_stress,
            'ECG': np.random.normal(0, 2, size=len(time)),
            'RESP': 18 + 4 * np.sin(2 * np.pi * 0.3 * time) + np.random.normal(0, 1, size=len(time)),
            'TEMP': 37.0 + 0.2 * np.sin(2 * np.pi * 0.02 * time) + np.random.normal(0, 0.1, size=len(time))
        })
        
        # Initialize signal stress detector
        signal_detector = PhysiologicalStressDetector()
        
        # Make predictions
        print("\nSynthetic Normal Signal:")
        result_normal = signal_detector.predict(normal_signals)
        print(f"Prediction: {'Stressed' if result_normal['prediction'] == 1 else 'Not Stressed'}")
        print(f"Confidence: Stress = {result_normal['confidence']['stress']:.4f}, No Stress = {result_normal['confidence']['no_stress']:.4f}")
        
        print("\nSynthetic Stress Signal:")
        result_stress = signal_detector.predict(stress_signals)
        print(f"Prediction: {'Stressed' if result_stress['prediction'] == 1 else 'Not Stressed'}")
        print(f"Confidence: Stress = {result_stress['confidence']['stress']:.4f}, No Stress = {result_stress['confidence']['no_stress']:.4f}")
        
        print("\nNote: This is using a non-trained model on synthetic data for demonstration.")
        print("For real applications, the model should be trained on labeled physiological data.")
        print("-"*80)
        return
    
    # Find signal samples
    signal_files = [os.path.join(signal_dir, f) for f in os.listdir(signal_dir) if f.endswith('.csv')]
    
    if not signal_files:
        print(f"No signal files found in {signal_dir}. Please add .csv files.")
        print("Skipping signal demo.")
        return
    
    # Initialize signal stress detector
    signal_detector = PhysiologicalStressDetector()
    
    # Make predictions
    for signal_file in signal_files:
        try:
            result = signal_detector.predict(signal_file)
            print(f"\nSignal file: {os.path.basename(signal_file)}")
            print(f"Prediction: {'Stressed' if result['prediction'] == 1 else 'Not Stressed'}")
            print(f"Confidence: Stress = {result['confidence']['stress']:.4f}, No Stress = {result['confidence']['no_stress']:.4f}")
        except Exception as e:
            print(f"Error processing {os.path.basename(signal_file)}: {str(e)}")
        print("-"*80)

def demo_combined_stress_detection():
    """
    Demonstrates combined stress detection using multiple modalities.
    """
    print("="*80)
    print("Combined Stress Detection Demo")
    print("="*80)
    
    # Initialize combined stress detector
    combined_detector = CombinedStressDetector()
    
    # Example texts
    text = "I'm feeling so overwhelmed with all this work and I don't know how to cope."
    
    # Synthetic signals
    time = np.linspace(0, 60, 1000)
    stress_signals = pd.DataFrame({
        'HRV': 90 + 10 * np.sin(2 * np.pi * 0.2 * time) + np.random.normal(0, 2, size=len(time)),
        'EDA': 5 + 0.5 * np.sin(2 * np.pi * 0.1 * time) + np.random.normal(0, 0.2, size=len(time)),
        'ECG': np.random.normal(0, 2, size=len(time)),
        'RESP': 18 + 4 * np.sin(2 * np.pi * 0.3 * time) + np.random.normal(0, 1, size=len(time)),
        'TEMP': 37.0 + 0.2 * np.sin(2 * np.pi * 0.02 * time) + np.random.normal(0, 0.1, size=len(time))
    })
    
    # Check if audio files exist
    audio_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "audio_samples")
    audio_file = None
    if os.path.exists(audio_dir):
        audio_files = [os.path.join(audio_dir, f) for f in os.listdir(audio_dir) if f.endswith(('.wav', '.mp3'))]
        if audio_files:
            audio_file = audio_files[0]
    
    # Make predictions using different combinations
    print("\nText-only prediction:")
    result_text = combined_detector.predict_combined(text=text)
    print(f"Prediction: {'Stressed' if result_text['prediction'] == 1 else 'Not Stressed'}")
    print(f"Confidence: Stress = {result_text['confidence']['stress']:.4f}, No Stress = {result_text['confidence']['no_stress']:.4f}")
    
    print("\nSignal-only prediction:")
    result_signal = combined_detector.predict_combined(signals=stress_signals)
    print(f"Prediction: {'Stressed' if result_signal['prediction'] == 1 else 'Not Stressed'}")
    print(f"Confidence: Stress = {result_signal['confidence']['stress']:.4f}, No Stress = {result_signal['confidence']['no_stress']:.4f}")
    
    if audio_file:
        print(f"\nAudio-only prediction (using {os.path.basename(audio_file)}):")
        result_audio = combined_detector.predict_combined(audio_file=audio_file)
        print(f"Prediction: {'Stressed' if result_audio['prediction'] == 1 else 'Not Stressed'}")
        print(f"Confidence: Stress = {result_audio['confidence']['stress']:.4f}, No Stress = {result_audio['confidence']['no_stress']:.4f}")
        
        print("\nMultimodal prediction (text + audio + signals):")
        result_combined = combined_detector.predict_combined(text=text, audio_file=audio_file, signals=stress_signals)
    else:
        print("\nMultimodal prediction (text + signals):")
        result_combined = combined_detector.predict_combined(text=text, signals=stress_signals)
    
    print(f"Prediction: {'Stressed' if result_combined['prediction'] == 1 else 'Not Stressed'}")
    print(f"Confidence: Stress = {result_combined['confidence']['stress']:.4f}, No Stress = {result_combined['confidence']['no_stress']:.4f}")
    
    print("\nNote: For a real application, you should fine-tune these models on your specific stress detection datasets.")
    print("-"*80)

if __name__ == "__main__":
    print("\nStress Detection Demo using Pretrained Models\n")
    
    # Run demos
    demo_text_stress_detection()
    demo_audio_stress_detection()
    demo_signal_stress_detection()
    demo_combined_stress_detection()
    
    print("\nDemo completed. All models use transformers specialized for stress/emotion detection.")