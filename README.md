# Multimodal Stress Detection System

This repository contains a comprehensive multimodal stress detection system that uses pretrained transformer models to detect stress from text, audio, and physiological signals.

## Features

- **Text-based Stress Detection**: Using EmoRoBERTa, a RoBERTa model fine-tuned for emotion detection
- **Audio-based Stress Detection**: Using Wav2Vec 2.0 fine-tuned for speech emotion recognition
- **Physiological Signal-based Stress Detection**: Using Time Series Transformer for processing physiological signals like HRV, EDA, etc.
- **Combined Multimodal Detection**: Weighted ensemble of all three modalities for more robust stress detection

## Installation

1. Clone this repository:

   ```
   git clone https://github.com/yourusername/stress-detection.git
   cd stress-detection
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Pretrained Models

The system uses the following pretrained models:

- **Text**: `j-hartmann/emotion-english-distilroberta-base` - DistilRoBERTa model fine-tuned on emotion datasets
- **Audio**: Uses a simplified rule-based approach with acoustic feature extraction (no external model)
- **Physiological Signals**: Uses a Time Series Transformer model that can be fine-tuned on physiological datasets like WESAD or SWELL-KW

## Using Gated Hugging Face Models

This project attempts to use high-quality Hugging Face models like `arpanghoshal/EmoRoBERTa` which may be gated (require authentication). To use these models:

1. Create a Hugging Face account at https://huggingface.co/
2. Generate an access token at https://huggingface.co/settings/tokens
3. Set the token as an environment variable:

```bash
# On Windows
set HUGGINGFACE_TOKEN=your_token_here

# On Linux/MacOS
export HUGGINGFACE_TOKEN=your_token_here
```

If authentication fails or the token is not provided, the system will automatically fall back to publicly available models.

## Usage

### Running the Demo

To run the demonstration of all stress detection models:

```
python app/demo.py
```

The demo will:

1. Show text-based stress detection on example texts
2. Attempt audio-based detection if audio samples are available
3. Run physiological signal detection on synthetic data or provided signal files
4. Demonstrate multimodal fusion of all available modalities

### Using Individual Models

#### Text-based Detection

```python
from app.models.text_model import TextStressDetector

# Initialize the detector
text_detector = TextStressDetector()

# Make a prediction
result = text_detector.predict("I'm feeling so overwhelmed with all this work.")
print(f"Prediction: {'Stressed' if result['prediction'] == 1 else 'Not Stressed'}")
print(f"Emotion: {result.get('emotion')}")
print(f"Confidence: {result['confidence']}")
```

#### Audio-based Detection

```python
from app.models.audio_model import AudioStressDetector

# Initialize the detector
audio_detector = AudioStressDetector()

# Make a prediction
result = audio_detector.predict("path/to/audio/file.wav")
print(f"Prediction: {'Stressed' if result['prediction'] == 1 else 'Not Stressed'}")
print(f"Emotion: {result.get('emotion')}")
print(f"Confidence: {result['confidence']}")
```

#### Physiological Signal-based Detection

```python
from app.models.signal_model import PhysiologicalStressDetector
import pandas as pd

# Initialize the detector
signal_detector = PhysiologicalStressDetector()

# Load signal data (CSV with columns like HRV, EDA, ECG, RESP, TEMP)
signals_df = pd.read_csv("path/to/signals.csv")

# Make a prediction
result = signal_detector.predict(signals_df)
print(f"Prediction: {'Stressed' if result['prediction'] == 1 else 'Not Stressed'}")
print(f"Confidence: {result['confidence']}")
```

#### Combined Multimodal Detection

```python
from app.models.combined_detector import CombinedStressDetector
import pandas as pd

# Initialize the combined detector
combined_detector = CombinedStressDetector()

# Load signal data
signals_df = pd.read_csv("path/to/signals.csv")

# Make a prediction using multiple modalities
result = combined_detector.predict_combined(
    text="I'm feeling anxious about the deadline",
    audio_file="path/to/audio.wav",
    signals=signals_df
)
print(f"Prediction: {'Stressed' if result['prediction'] == 1 else 'Not Stressed'}")
print(f"Confidence: {result['confidence']}")
```

## Running the Next.js Dashboard

A modern dashboard interface is included to visualize stress detection results in real-time:

1. Start the backend server:

   ```bash
   # Make sure you have installed requirements first
   pip install -r requirements.txt

   # Run the FastAPI backend
   python -m app.main
   ```

2. Start the Next.js frontend:

   ```bash
   # Navigate to the dashboard directory
   cd stress-detection-dashboard

   # Install dependencies
   npm install
   # or using pnpm
   pnpm install

   # Run development server
   npm run dev
   # or using pnpm
   pnpm dev
   ```

3. Access the dashboard at http://localhost:3000

### Dashboard Features

- **Multimodal Input**: Analyze stress through text, voice, physiological signals, or a combination
- **Real-time Analysis**: See stress detection results in real-time
- **Detailed Metrics**: View comprehensive breakdown of stress indicators
- **Signal Visualization**: Visualize physiological signals and their correlation with stress

### Configuring the Dashboard

The dashboard connects to the backend API by default at `http://localhost:8000`. You can modify this by editing the `.env.local` file in the `stress-detection-dashboard` directory:

```
NEXT_PUBLIC_API_URL=http://your-custom-backend-url
```

## Data Directory Structure

The system expects data in the following structure:

```
data/
├── audio_samples/          # Audio files (.wav, .mp3)
└── signal_samples/         # Signal CSV files
```

## Fine-tuning for Better Performance

For optimal performance, you should fine-tune these models on domain-specific stress detection datasets:

1. For text: CLPsych, Dreaddit, or SMHD datasets
2. For audio: DEAP, MAHNOB-HCI, or Emo-DB
3. For physiological signals: WESAD or SWELL-KW

## License

This project is licensed under the MIT License - see the LICENSE file for details.
