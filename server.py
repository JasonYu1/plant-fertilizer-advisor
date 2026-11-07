"""Plant fertilizer advisor.

Upload a plant photo -> identify it via the free Pl@ntNet API ->
look up fertilizer recommendations in the local database.

Run:  python server.py   (then open http://localhost:5000)

API key: put PLANTNET_API_KEY=... in a .env file next to this script
(get a free key at https://my.plantnet.org). Without a key the app
runs in demo mode and returns a sample identification.
"""

import io
import json
import os
from pathlib import Path

import requests
from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
PLANTNET_URL = "https://my-api.plantnet.org/v2/identify/all"

app = Flask(__name__, static_folder=str(BASE_DIR / "static"), static_url_path="")

with open(BASE_DIR / "data" / "fertilizers.json", encoding="utf-8") as f:
    FERT_DB = json.load(f)

with open(BASE_DIR / "data" / "symptoms.json", encoding="utf-8") as f:
    SYMPTOMS = json.load(f)

# --- Internationalization ---
SUPPORTED_LANGS = ("en", "zh-TW", "zh-CN", "es", "fr", "pt")
PLANTNET_LANG = {"en": "en", "zh-TW": "zh", "zh-CN": "zh", "es": "es", "fr": "fr", "pt": "pt"}
I18N_DIR = BASE_DIR / "data" / "i18n"
_i18n_cache = {}


def get_lang(value) -> str:
    return value if value in SUPPORTED_LANGS else "en"


def load_i18n(lang: str) -> dict:
    """Translated content files for a language ({} for English/missing)."""
    if lang == "en" or lang not in SUPPORTED_LANGS:
        return {}
    if lang not in _i18n_cache:
        data = {}
        folder = I18N_DIR / lang
        for name in ("fertilizers", "symptoms", "health"):
            path = folder / (name + ".json")
            if path.exists():
                with open(path, encoding="utf-8") as f:
                    data[name] = json.load(f)
        _i18n_cache[lang] = data
    return _i18n_cache[lang]

try:
    import health

    HEALTH_OK = health.available()
except Exception:  # onnxruntime/numpy/Pillow missing or model absent
    health = None
    HEALTH_OK = False


def load_api_key() -> str:
    """Read the key from the environment or a simple .env file."""
    key = os.environ.get("PLANTNET_API_KEY", "").strip()
    if key:
        return key
    env_path = BASE_DIR / ".env"
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("PLANTNET_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return ""


def lookup_fertilizer(scientific_name: str, genus: str, family: str, lang: str = "en") -> dict:
    """Most specific match wins: species -> genus -> family -> default.
    Translated database first, English as fallback."""
    translated = load_i18n(lang).get("fertilizers")
    databases = [db for db in (translated, FERT_DB) if db]
    for db in databases:
        for level, name in (
            ("species", scientific_name),
            ("genus", genus),
            ("family", family),
        ):
            entry = db.get(level, {}).get(name)
            if entry:
                return {**entry, "match_level": level, "matched_on": name}
    default = (translated or {}).get("default") or FERT_DB["default"]
    return {**default, "match_level": "default", "matched_on": ""}


DEMO_RESULT = {
    "demo": True,
    "results": [
        {
            "score": 0.91,
            "scientific_name": "Solanum lycopersicum",
            "common_names": ["Tomato", "Garden tomato"],
            "genus": "Solanum",
            "family": "Solanaceae",
        },
        {
            "score": 0.04,
            "scientific_name": "Solanum melongena",
            "common_names": ["Eggplant", "Aubergine"],
            "genus": "Solanum",
            "family": "Solanaceae",
        },
    ],
}


DEMO_COMMON = {
    "en": (["Tomato", "Garden tomato"], ["Eggplant", "Aubergine"]),
    "zh-TW": (["番茄"], ["茄子"]),
    "zh-CN": (["番茄"], ["茄子"]),
    "es": (["Tomate"], ["Berenjena"]),
    "fr": (["Tomate"], ["Aubergine"]),
    "pt": (["Tomate"], ["Berinjela"]),
}


@app.get("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.get("/api/status")
def status():
    return jsonify({"has_key": bool(load_api_key()), "health_model": HEALTH_OK})


@app.get("/api/symptoms")
def symptoms():
    lang = get_lang(request.args.get("lang"))
    return jsonify(load_i18n(lang).get("symptoms") or SYMPTOMS)


@app.post("/api/identify")
def identify():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded."}), 400

    image = request.files["image"]
    image_bytes = image.read()
    organ = request.form.get("organ", "auto")
    lang = get_lang(request.form.get("lang"))
    # Per-user key sent by the browser wins; server .env key is the fallback.
    api_key = (request.form.get("api_key") or "").strip() or load_api_key()

    if not api_key:
        demo_names = DEMO_COMMON.get(lang, DEMO_COMMON["en"])
        payload = {"demo": True, "results": [dict(r) for r in DEMO_RESULT["results"]]}
        for r, names in zip(payload["results"], demo_names):
            r["common_names"] = names
    else:
        try:
            resp = requests.post(
                PLANTNET_URL,
                params={"api-key": api_key, "lang": PLANTNET_LANG[lang]},
                files={"images": (image.filename, io.BytesIO(image_bytes), image.mimetype)},
                data={"organs": organ},
                timeout=30,
            )
        except requests.RequestException as exc:
            return jsonify({"error": f"Could not reach Pl@ntNet: {exc}"}), 502

        if resp.status_code == 401:
            return jsonify({"error": "Pl@ntNet rejected the API key. Check the key you entered (or the server's .env file)."}), 502
        if resp.status_code == 429:
            return jsonify({"error": "Daily Pl@ntNet quota reached for this API key (500/day on the free tier). Try again tomorrow."}), 502
        if resp.status_code == 404:
            return jsonify({"error": "Pl@ntNet could not recognize a plant in this photo. Try a closer shot of a leaf or flower."}), 404
        if resp.status_code != 200:
            return jsonify({"error": f"Pl@ntNet error (HTTP {resp.status_code})."}), 502

        data = resp.json()
        results = []
        for r in data.get("results", [])[:5]:
            sp = r.get("species", {})
            results.append(
                {
                    "score": r.get("score", 0),
                    "scientific_name": sp.get("scientificNameWithoutAuthor", ""),
                    "common_names": sp.get("commonNames", [])[:3],
                    "genus": (sp.get("genus") or {}).get("scientificNameWithoutAuthor", ""),
                    "family": (sp.get("family") or {}).get("scientificNameWithoutAuthor", ""),
                }
            )
        payload = {"demo": False, "results": results}

    for r in payload["results"]:
        r["fertilizer"] = lookup_fertilizer(r["scientific_name"], r["genus"], r["family"], lang)

    payload["health"] = assess_health(payload["results"], image_bytes, lang)
    return jsonify(payload)


def assess_health(results: list, image_bytes: bytes, lang: str = "en") -> dict:
    """Run the local disease model when the identified plant is a crop
    it was trained on; otherwise report that only the checklist applies."""
    out = {"model_available": HEALTH_OK, "covered_crop": None, "predictions": None, "error": None}
    if not HEALTH_OK or not results:
        return out
    crop = health.genus_covered(results[0].get("genus", ""))
    out["covered_crop"] = crop
    if not crop:
        return out
    try:
        out["predictions"] = health.predict(image_bytes)
    except Exception as exc:
        out["error"] = f"Disease model failed: {exc}"
        return out
    translations = load_i18n(lang).get("health")
    if translations:
        labels = translations.get("labels", {})
        advice = translations.get("advice", {})
        for p in out["predictions"]:
            p["label"] = labels.get(p["label"], p["label"])
            if p.get("advice_key"):
                p["advice"] = advice.get(p["advice_key"], p["advice"])
    return out


if __name__ == "__main__":
    has_key = bool(load_api_key())
    print(f"Pl@ntNet API key: {'found' if has_key else 'NOT set - running in DEMO mode'}")
    if not has_key:
        print("Get a free key at https://my.plantnet.org and put it in .env (see .env.example)")
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="127.0.0.1", port=port, debug=False)
