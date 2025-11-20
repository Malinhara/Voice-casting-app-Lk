from fastapi import FastAPI, UploadFile, File
import io
import librosa
import parselmouth
import numpy as np
from typing import List
import torch
from transformers import AutoModelForAudioClassification, AutoFeatureExtractor
import tempfile
import os
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor

app = FastAPI()

# ======== Load Emotion Model ========
model_id = "firdhokk/speech-emotion-recognition-with-openai-whisper-large-v3"
model = AutoModelForAudioClassification.from_pretrained(model_id)
feature_extractor = AutoFeatureExtractor.from_pretrained(model_id, do_normalize=True)
id2label = model.config.id2label

# Move model to device once
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Thread pool for CPU-bound tasks
executor = ThreadPoolExecutor(max_workers=os.cpu_count())

# ======== Feature extraction functions ========
def get_pitch_parselmouth(sound):
    pitch = sound.to_pitch()
    pitch_values = pitch.selected_array['frequency']
    voiced = pitch_values[pitch_values > 0]
    return float(np.median(voiced)) if len(voiced) > 0 else 0.0

def get_energy(y, frame_length=2048, hop_length=512):
    rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)
    return float(rms.mean())

def get_tone(y, sr):
    centroid = librosa.feature.spectral_centroid(y=y, sr=sr).mean()
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr).mean()
    return float((centroid + rolloff) / 2)

def get_speech_rate(sound):
    intensity = sound.to_intensity()
    threshold = intensity.values.mean()
    peaks = [t for t in intensity.xs() if intensity.get_value(t) > threshold]
    duration = sound.get_total_duration()
    return len(peaks) / duration if duration > 0 else 0.0

# ======== Label functions ========
def pitch_label(p): return "Low" if p<100 else "Medium" if p<200 else "High"
def energy_label(e): return "Low" if e<0.02 else "Medium" if e<0.05 else "High"
def tone_label(t): return "Warm" if t<2000 else "Neutral" if t<4000 else "Bright"
def speech_rate_label(s): return "Slow" if s<2 else "Normal" if s<4 else "Fast"

# ======== Emotion analysis ========
def preprocess_audio(audio_path, feature_extractor, max_duration=30.0):
    audio_array, _ = librosa.load(audio_path, sr=feature_extractor.sampling_rate, duration=max_duration)
    max_length = int(feature_extractor.sampling_rate * max_duration)
    if len(audio_array) > max_length:
        audio_array = audio_array[:max_length]
    else:
        audio_array = np.pad(audio_array, (0, max_length - len(audio_array)))
    inputs = feature_extractor(
        audio_array,
        sampling_rate=feature_extractor.sampling_rate,
        max_length=max_length,
        truncation=True,
        return_tensors="pt",
    )
    return inputs

def predict_emotion(audio_path):
    inputs = preprocess_audio(audio_path, feature_extractor)
    inputs = {k: v.to(device) for k,v in inputs.items()}
    with torch.no_grad():
        outputs = model(**inputs)
    predicted_id = torch.argmax(outputs.logits, dim=-1).item()
    return id2label[predicted_id]

# ======== CPU-bound file processing ========
def _sync_process_file(contents):
    # Load audio (limit duration to 30s)
    y, sr = librosa.load(io.BytesIO(contents), sr=None, duration=30)
    sound = parselmouth.Sound(y, sampling_frequency=sr)

    pitch_value = get_pitch_parselmouth(sound)
    energy_value = get_energy(y)
    tone_value = get_tone(y, sr)
    speech_rate_value = get_speech_rate(sound)

    # Save temp file for emotion
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    emotion = predict_emotion(tmp_path)
    os.remove(tmp_path)

    result = {
        "pitch": {"value": round(pitch_value,2), "unit":"Hz", "label": pitch_label(pitch_value)},
        "energy": {"value": round(energy_value,4), "unit":"RMS (relative)", "label": energy_label(energy_value)},
        "tone": {"value": round(tone_value,2), "unit":"Hz", "label": tone_label(tone_value)},
        "speech_rate": {"value": round(speech_rate_value,2), "unit":"syllables/sec", "label": speech_rate_label(speech_rate_value)},
        "emotion": {"label": emotion}
    }
    return result

# ======== Async wrapper ========
async def process_file(file: UploadFile):
    contents = await file.read()
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, _sync_process_file, contents)

# ======== FastAPI endpoint (parallelized) ========
@app.post("/analyze")
async def analyze(files: List[UploadFile] = File(...)):
    if not files:
        return {"error": "Please upload at least 1 audio file"}

    # Run all files concurrently
    tasks = [process_file(file) for file in files]
    results_list = await asyncio.gather(*tasks)
    results = {f"voice{i+1}": r for i,r in enumerate(results_list)}
    return results

# ======== Run server ========
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
