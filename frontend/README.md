# ⟁ TERRAYIELD — Smart Crop Predictor Platform

AI-powered agricultural intelligence. Enter coordinates, get crop predictions.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your backend URL
cp .env.example .env.local
# Edit .env.local → VITE_API_URL=https://your-django-backend.com/api

# 3. Run dev server
npm run dev

# 4. Build for production
npm run build
```

---

## Project Structure

```
terrayield/
├── src/
│   ├── App.jsx                    # Root — view switcher (home ↔ predictor)
│   ├── main.jsx                   # Vite entrypoint
│   ├── index.css                  # All styles (CSS variables, component classes)
│   ├── components/
│   │   ├── Navbar.jsx             # Sticky top navigation
│   │   ├── Dashboard.jsx          # Landing / hero page
│   │   └── PredictorWorkspace.jsx # Core predictor UI
│   └── services/
│       └── api.js                 # All backend calls (fetch-based)
├── index.html
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

---

## Django Backend API Contract

### `POST /api/predict/`

**Request body:**
```json
{ "latitude": 0.6667, "longitude": 36.0 }
```

**Expected response:**
```json
{
  "region_name": "Rift Valley, Kenya",
  "analysis_date": "2025-06-01T10:30:00Z",
  "weather": {
    "temperature": 22.4,
    "humidity": 68,
    "precipitation": 4.2,
    "wind_speed": 14,
    "condition": "Partly Cloudy"
  },
  "predictions": [
    {
      "crop": "Maize",
      "icon": "🌽",
      "confidence": 91,
      "optimal_temp": "18–30°C",
      "optimal_rainfall": "500–800mm/season",
      "soil_type": "Well-drained loamy",
      "planting_window": "March – May",
      "season": "Long Rains",
      "tips": [
        "Apply nitrogenous fertiliser at planting and 4–6 weeks after emergence.",
        "Space rows 75 cm apart; thin to one plant per station at 25 cm."
      ]
    }
  ]
}
```

### `GET /api/regions/`
Returns list of pre-defined agricultural regions:
```json
[
  { "id": "rift-valley", "name": "Rift Valley, Kenya", "lat": 0.6667, "lng": 36.0, "country": "KE" }
]
```

---

## Demo Mode

The app ships with a **Demo Mode toggle** in the predictor sidebar. When enabled (default), it returns rich mock data so you can test the UI without a live backend. Disable it once your Django API is running.

---

## Deployment

Works out-of-the-box on **Vercel**, **Netlify**, or **Render** (static site).

Set the `VITE_API_URL` environment variable in your hosting provider's dashboard to point at your live Django backend.

For Django: ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL.
