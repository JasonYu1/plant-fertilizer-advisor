# 🌱 Plant Fertilizer Advisor

Upload a photo of a plant → it gets identified (free, via the
[Pl@ntNet API](https://my.plantnet.org)) → you get a fertilizer plan:
N-P-K ratio, what product to use, feeding schedule, soil pH, and care tips.

Available in **six languages** — English, 繁體中文, 简体中文, Español,
Français, Português — via the picker in the header (auto-detected from
the browser on first visit). Everything is translated: interface,
fertilizer database, symptom checklist, disease names and advice
(`static/i18n.js` for UI strings, `data/i18n/<lang>/` for content), and
Pl@ntNet returns plant common names in the chosen language.

## Setup

```
pip install -r requirements.txt
```

### Get a free Pl@ntNet API key (one-time, ~2 minutes)

1. Go to <https://my.plantnet.org> and create a free account.
2. Open **Settings → API** (or "My API") and copy your API key.
3. Paste it in the app: click **"🔑 Set your Pl@ntNet API key"** on the
   page. The key is stored only in that browser (localStorage) and sent
   only with your own identification requests — so every user of the
   app brings their own free quota.

The free tier allows **500 identifications per day per key**.

Alternatively (or additionally), the server operator can set a shared
fallback key: copy `.env.example` to `.env` and paste a key there. A
personal key set in the browser always takes priority over the server
key. Without any key the app runs in **demo mode** (returns a sample
tomato identification) so you can try the interface.

## Run

```
python server.py
```

Then open <http://localhost:5000>. On your phone (same Wi-Fi), change the
last line of `server.py` to `host="0.0.0.0"` and browse to your PC's IP.

## Health check

Two layers, both free:

- **AI disease check** — a MobileNetV2 model trained on the PlantVillage
  dataset runs locally (no API, no quota) via onnxruntime. It knows 38
  conditions across 14 crops: apple, blueberry, cherry, corn, grape,
  orange/citrus, peach, bell pepper, potato, raspberry, soybean, squash,
  strawberry and tomato. Its verdict only shows when the identified plant
  is one of those crops. Model files live in `models/` (downloaded from
  [onnx-community on Hugging Face](https://huggingface.co/onnx-community/mobilenet_v2_1.0_224-plant-disease-identification-ONNX)).
  Best results: a sharp close-up of a single leaf.
- **Symptom checklist** — for every plant: tap what you see (yellow
  leaves, brown tips, spots, wilting…) and get likely causes and fixes
  from `data/symptoms.json`.

## How it works

- `server.py` — small Flask app. Receives the photo, forwards it to
  Pl@ntNet, then matches the identified species/genus/family against the
  local fertilizer database (most specific match wins).
- `data/fertilizers.json` — the fertilizer knowledge base: ~75 entries
  covering vegetables, fruit, herbs, garden flowers, shrubs, trees,
  houseplants, succulents, orchids, and family-level fallbacks. Edit it
  to add plants — no code changes needed.
- `static/` — the web page (plain HTML/CSS/JS, no build step).

## Deploying (free public link)

The repo includes `render.yaml` for [Render](https://render.com)'s free
tier: create a Render account, click **New → Blueprint**, pick this
GitHub repo, and Render builds and serves the app at
`https://<name>.onrender.com` over HTTPS. Free instances sleep after
~15 minutes idle (first visit afterwards takes up to a minute to wake).
Each visitor supplies their own Pl@ntNet key in the browser, so no
server key is needed; optionally set a `PLANTNET_API_KEY` environment
variable in Render as a shared fallback.

## Disclaimer

Fertilizer guidance is general gardening advice. Always follow the label
of the specific product you use.
