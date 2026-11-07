# 🌱 Plant Fertilizer Advisor

Upload a photo of a plant → it gets identified (free, via the
[Pl@ntNet API](https://my.plantnet.org)) → you get a fertilizer plan:
N-P-K ratio, what product to use, feeding schedule, soil pH, and care tips.

## Setup

```
pip install -r requirements.txt
```

### Get a free Pl@ntNet API key (one-time, ~2 minutes)

1. Go to <https://my.plantnet.org> and create a free account.
2. Open **Settings → API** (or "My API") and copy your API key.
3. Copy `.env.example` to `.env` and paste the key:
   ```
   PLANTNET_API_KEY=your_key_here
   ```

The free tier allows about **500 identifications per day** — plenty.

Without a key the app still runs in **demo mode** (returns a sample
tomato identification) so you can try the interface.

## Run

```
python server.py
```

Then open <http://localhost:5000>. On your phone (same Wi-Fi), change the
last line of `server.py` to `host="0.0.0.0"` and browse to your PC's IP.

## How it works

- `server.py` — small Flask app. Receives the photo, forwards it to
  Pl@ntNet, then matches the identified species/genus/family against the
  local fertilizer database (most specific match wins).
- `data/fertilizers.json` — the fertilizer knowledge base: ~75 entries
  covering vegetables, fruit, herbs, garden flowers, shrubs, trees,
  houseplants, succulents, orchids, and family-level fallbacks. Edit it
  to add plants — no code changes needed.
- `static/` — the web page (plain HTML/CSS/JS, no build step).

## Disclaimer

Fertilizer guidance is general gardening advice. Always follow the label
of the specific product you use.
