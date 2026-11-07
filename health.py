"""Local plant disease detection.

Runs a MobileNetV2 classifier trained on the PlantVillage dataset
(38 classes, 14 crops) via onnxruntime - fully offline and free.
Model: onnx-community/mobilenet_v2_1.0_224-plant-disease-identification-ONNX

The model only knows certain crops, so callers should gate its verdict
on the identified plant (see genus_covered / CROP_GENERA).
"""

import io
import json
from pathlib import Path

import numpy as np
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "plant_disease.onnx"
LABELS_PATH = BASE_DIR / "models" / "plant_disease_labels.json"

# Which identified genera the PlantVillage model actually covers.
CROP_GENERA = {
    "Malus": "apple",
    "Vaccinium": "blueberry",
    "Prunus": "cherry / peach",
    "Zea": "corn",
    "Vitis": "grape",
    "Citrus": "orange",
    "Capsicum": "bell pepper",
    "Solanum": "potato / tomato",
    "Rubus": "raspberry",
    "Glycine": "soybean",
    "Cucurbita": "squash",
    "Fragaria": "strawberry",
}

_ADVICE = [
    ("mildew", "Improve airflow, remove the worst leaves, and treat with sulfur or potassium bicarbonate spray. Avoid wetting the foliage."),
    ("rust", "Remove and bin (don't compost) affected leaves, improve airflow, and consider a copper-based fungicide."),
    ("blight", "Remove affected foliage immediately, mulch to stop soil splash, water at the base only, and use a copper fungicide early. Late blight spreads fast - act quickly."),
    ("black rot", "Prune out infected parts well below the damage, clean up fallen debris, and apply fungicide at bud break next season."),
    ("rot", "Prune out infected parts, clean up fallen fruit and leaves, and improve airflow."),
    ("scab", "Rake up fallen leaves in autumn, prune for airflow, and choose resistant varieties; fungicide helps if applied early in spring."),
    ("esca", "No cure exists - prune out dead wood in dry weather and keep the vine unstressed. Severely affected vines may need replacing."),
    ("leaf spot", "Remove spotted leaves, avoid overhead watering, and rotate crops. Copper or chlorothalonil sprays slow it down."),
    ("spot", "Remove affected leaves, avoid overhead watering, and don't work among wet plants. Copper sprays help with bacterial spot."),
    ("greening", "Citrus greening is incurable and spread by psyllids - control the insects, remove badly infected trees, and consult local agricultural guidance."),
    ("virus", "Viruses are incurable - remove and destroy infected plants, control the insects that spread them, and wash hands/tools between plants."),
    ("mites", "Spray undersides of leaves hard with water, then treat with insecticidal soap or horticultural oil. Raise humidity - mites love dry air."),
]

_session = None
_labels = None


def available() -> bool:
    return MODEL_PATH.exists() and LABELS_PATH.exists()


def _load():
    global _session, _labels
    if _session is None:
        import onnxruntime as ort

        _session = ort.InferenceSession(str(MODEL_PATH), providers=["CPUExecutionProvider"])
        with open(LABELS_PATH, encoding="utf-8") as f:
            _labels = json.load(f)["id2label"]
    return _session, _labels


def _preprocess(image_bytes: bytes) -> np.ndarray:
    """Match the model's preprocessor: shortest edge 256, center crop 224,
    scale to [0,1], normalize mean/std 0.5."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    w, h = img.size
    scale = 256 / min(w, h)
    img = img.resize((round(w * scale), round(h * scale)), Image.BILINEAR)
    w, h = img.size
    left, top = (w - 224) // 2, (h - 224) // 2
    img = img.crop((left, top, left + 224, top + 224))
    arr = np.asarray(img, dtype=np.float32) / 255.0
    arr = (arr - 0.5) / 0.5
    return arr.transpose(2, 0, 1)[np.newaxis, ...]


def advice_for(label: str) -> str:
    low = label.lower()
    for key, text in _ADVICE:
        if key in low:
            return text
    return "Remove affected parts, improve airflow, and avoid overhead watering."


def predict(image_bytes: bytes, top_k: int = 3) -> list:
    """Return top predictions: [{label, score, healthy, advice}, ...]."""
    session, labels = _load()
    inputs = _preprocess(image_bytes)
    logits = session.run(None, {session.get_inputs()[0].name: inputs})[0][0]
    exp = np.exp(logits - logits.max())
    probs = exp / exp.sum()
    order = probs.argsort()[::-1][:top_k]
    out = []
    for i in order:
        label = labels[str(i)]
        healthy = label.lower().startswith("healthy")
        out.append(
            {
                "label": label,
                "score": round(float(probs[i]), 4),
                "healthy": healthy,
                "advice": "" if healthy else advice_for(label),
            }
        )
    return out


def genus_covered(genus: str):
    """Return the crop name if this genus is in the model's training set."""
    return CROP_GENERA.get(genus)
