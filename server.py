"""Plant fertilizer advisor.

Upload a plant photo -> identify it via the free Pl@ntNet API ->
look up fertilizer recommendations in the local database.

Run:  python server.py   (then open http://localhost:5000)

API key: put PLANTNET_API_KEY=... in a .env file next to this script
(get a free key at https://my.plantnet.org). Without a key the app
runs in demo mode and returns a sample identification.
"""

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


def lookup_fertilizer(scientific_name: str, genus: str, family: str) -> dict:
    """Most specific match wins: species -> genus -> family -> default."""
    for level, name in (
        ("species", scientific_name),
        ("genus", genus),
        ("family", family),
    ):
        entry = FERT_DB.get(level, {}).get(name)
        if entry:
            return {**entry, "match_level": level, "matched_on": name}
    return {**FERT_DB["default"], "match_level": "default", "matched_on": ""}


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


@app.get("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.get("/api/status")
def status():
    return jsonify({"has_key": bool(load_api_key())})


@app.post("/api/identify")
def identify():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded."}), 400

    image = request.files["image"]
    organ = request.form.get("organ", "auto")
    api_key = load_api_key()

    if not api_key:
        payload = {**DEMO_RESULT}
    else:
        try:
            resp = requests.post(
                PLANTNET_URL,
                params={"api-key": api_key, "lang": "en"},
                files={"images": (image.filename, image.stream, image.mimetype)},
                data={"organs": organ},
                timeout=30,
            )
        except requests.RequestException as exc:
            return jsonify({"error": f"Could not reach Pl@ntNet: {exc}"}), 502

        if resp.status_code == 401:
            return jsonify({"error": "Pl@ntNet rejected the API key. Check your .env file."}), 502
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
        r["fertilizer"] = lookup_fertilizer(r["scientific_name"], r["genus"], r["family"])

    return jsonify(payload)


if __name__ == "__main__":
    has_key = bool(load_api_key())
    print(f"Pl@ntNet API key: {'found' if has_key else 'NOT set - running in DEMO mode'}")
    if not has_key:
        print("Get a free key at https://my.plantnet.org and put it in .env (see .env.example)")
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="127.0.0.1", port=port, debug=False)
