# 🚆 RailVision — AI-Powered Crowd Intelligence Platform

<div align="center">

**Know how busy your train is before you board.**

*A warm, human-centric full-stack platform providing real-time crowd intelligence, interactive maps, and smart predictions for Indian Railways passengers and station authorities.*

![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet.js-1.9.4-199900?logo=leaflet&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Data Sources & APIs](#-data-sources--apis)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup-fastapi)
  - [Frontend Setup](#frontend-setup-vite--react)
  - [Running the App](#running-the-full-stack-app)
- [API Reference](#-api-reference)
- [Application Architecture](#-application-architecture)
- [Design System](#-design-system--human-edition)
- [AI & Prediction Engine](#-ai--prediction-engine)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

## 🌟 Overview

**RailVision** addresses a real problem faced by millions of Indian railway passengers every day — **not knowing how crowded the train will be before you board**.

By combining a live PostgreSQL database, a FastAPI backend, time-based crowd prediction, and an interactive Leaflet.js map, RailVision gives both passengers and railway authorities the tools they need to make smarter decisions:

- **Passengers** can check live crowd levels, see carriage-by-carriage breakdowns, view 8-hour forecasts, and book directly on IRCTC.
- **Station Authorities & Admins** get a real-time command dashboard with KPIs, weekly rhythm heatmaps, route analytics, and team management tools.

> **Human Edition Design Philosophy**: The entire UI is built on warmth and clarity — soft cream tones, terracotta accents, rounded surfaces, and copy written for real humans rather than machines.

---

## ✨ Key Features

### For Passengers 🧑‍💼
| Feature | Description |
|---|---|
| **Live Train Search** | Search trains by origin, destination across 20+ major Indian stations |
| **Real-Time Crowd Badges** | Colour-coded `Calm / Filling / Very Busy` indicators from live backend data |
| **Interactive Route Map** | Leaflet.js map with all station markers and a drawn route polyline, free CartoDB tiles |
| **8-Hour Forecast** | Chart.js line chart with gradient fill showing predicted busyness for the next 8 hours |
| **Carriage Breakdown** | Per-class crowd levels (General, Sleeper, 3A, 2A, 1A) from the `/crowd/{id}` endpoint |
| **IRCTC Booking Link** | One-click "Book on IRCTC" button inside each train detail modal |
| **Service Updates** | Curated sidebar showing real-world alerts and smart travel tips |

### For Railway Authorities 🏛️
| Feature | Description |
|---|---|
| **KPI Cards** | Live total passengers, average busyness %, active crowding alerts, submitted reports |
| **Busy Routes Chart** | Toggleable Bar / Trend (line) chart for the top 10 highest-density routes |
| **Weekly Rhythm Heatmap** | 7-day × 24-hour crowd density grid from the `/dashboard/heatmap` API |
| **Trains Table** | Sortable table with current load, average load, peak hour, and status badge |
| **AI Recommendations** | Surfaces trains with `Alert` status and suggests actionable crowd relief measures |
| **Team Management** | Admin-only form to invite colleagues with role-based access (Admin / Controller) |
| **Auto-refresh** | Dashboard polls the backend every 60 seconds for fresh data |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + Vite 6 | Component-based SPA with fast HMR |
| **Frontend Routing** | React Router 7 | Hash-based SPA navigation |
| **Styling** | Vanilla CSS (Human Edition) | CSS custom properties, warm palette, zero frameworks |
| **Maps** | Leaflet.js 1.9.4 (CDN) | Interactive station maps, free CartoDB tiles |
| **Charts** | Chart.js 4.x | Bar, line, gradient-fill charts |
| **Icons** | Lucide React | Consistent, minimal icon set |
| **Fonts** | Bricolage Grotesque + Plus Jakarta Sans | Warm, humanistic typography from Google Fonts |
| **Backend API** | FastAPI (Python 3.10+) | Async REST API with automatic OpenAPI docs |
| **Auth** | JWT (Bearer tokens) | Role-based: `passenger`, `admin`, `controller` |
| **Database** | PostgreSQL 15+ | Trains, crowd data, predictions, reports, users |
| **ORM** | SQLAlchemy 2.x | Pythonic schema definitions and query building |
| **Password Hashing** | bcrypt (passlib) | Secure credential storage |

---

## 📡 Data Sources & APIs

### Live Backend Endpoints (Custom FastAPI)
These endpoints are served by the backend running at `http://localhost:8000`:

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/auth/login` | POST | ❌ | Email + password → JWT token |
| `/auth/register` | POST | ❌ | Create new passenger account |
| `/auth/staff/register` | POST | ✅ Admin | Add admin/controller team member |
| `/trains` | GET | ❌ | All trains, filter by `source` / `destination` |
| `/trains/{id}` | GET | ❌ | Single train detail |
| `/crowd/{train_id}` | GET | ❌ | Live crowd level, compartment breakdown, history |
| `/predict/{train_id}` | GET | ❌ | 8-hour crowd prediction with confidence intervals |
| `/report` | POST | ✅ Passenger | Submit crowd report |
| `/dashboard/kpis` | GET | ✅ Admin/Controller | KPI metrics |
| `/dashboard/heatmap` | GET | ✅ Admin/Controller | 7 × 24 crowd heatmap |
| `/dashboard/routes` | GET | ✅ Admin/Controller | High-density route table |

**Interactive API docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Map Tiles
- **Provider**: [CartoDB](https://carto.com/) — `light_all` tile layer
- **URL**: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png`
- **Licence**: Free, no API key required. Attribution to OpenStreetMap contributors.

### Future Integration (Not Yet Active)
| Source | Purpose |
|---|---|
| [IndianRailAPI](https://indianrailapi.com) | Live train running status, real schedules |
| [CRIS API (Project Pravah)](https://crisapis.indianrail.gov.in/) | Official NTES, PRS, FOIS data (requires registration) |
| [MapMyIndia](https://apis.mapmyindia.com/) | India-specific mapping with better rail coverage |
| Browser `navigator.geolocation` | Passenger GPS for nearest-station detection |

---

## 📁 Project Structure

```
Railway Project/
├── backend/                        # 🐍 FastAPI Backend
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py             # Login, register, JWT
│   │   │   ├── trains.py           # GET /trains, /trains/{id}
│   │   │   ├── crowd.py            # GET /crowd/{id}, POST /report
│   │   │   ├── predictions.py      # GET /predict/{id}
│   │   │   └── dashboard.py        # GET /dashboard/kpis|heatmap|routes
│   │   ├── models.py               # SQLAlchemy ORM (User, Train, CrowdData, etc.)
│   │   ├── schemas/                # Pydantic request/response models
│   │   ├── database.py             # PostgreSQL engine + session factory
│   │   ├── deps.py                 # JWT auth dependency + role checker
│   │   ├── utils/                  # Password hashing and helpers
│   │   └── main.py                 # FastAPI app + CORS + router mounting
│   ├── venv/                       # Python virtual environment (git-ignored)
│   ├── requirements.txt            # Python dependencies
│   ├── init_db.py                  # Creates the PostgreSQL database
│   └── seed_data.py                # Seeds trains, users, and 30-day crowd data
│
├── frontend/                       # ⚛️ React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Floating nav bar with user avatar pill
│   │   │   ├── StatCard.jsx        # Animated count-up KPI card
│   │   │   ├── TrainCard.jsx       # Train result card (real API shape)
│   │   │   ├── CrowdBadge.jsx      # Calm / Filling / Very Busy pill badge
│   │   │   ├── Modal.jsx           # Overlay modal with blurred backdrop
│   │   │   ├── AlertBanner.jsx     # Coloured info/warning/danger banners
│   │   │   └── PredictionChart.jsx # Chart.js gradient line chart
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Public homepage
│   │   │   ├── Login.jsx           # Sign in / Register with tab switcher
│   │   │   ├── Passenger.jsx       # Train search + Leaflet map + modal detail
│   │   │   └── Dashboard.jsx       # Authority live dashboard (admin only)
│   │   ├── data/
│   │   │   ├── apiClient.js        # Single API client (all fetch calls)
│   │   │   ├── stations.js         # Static station reference data + coordinates
│   │   │   ├── mockData.js         # ⚠️ DEPRECATED — tombstoned
│   │   │   └── predictionEngine.js # ⚠️ DEPRECATED — tombstoned
│   │   ├── styles/
│   │   │   └── index.css           # Human Edition design system (CSS variables)
│   │   ├── App.jsx                 # Root router + auth state + RBAC guards
│   │   └── main.jsx                # React DOM entry point
│   ├── index.html                  # App shell (Leaflet CDN + Google Fonts)
│   └── package.json                # Dependencies and npm scripts
│
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Download |
|---|---|---|
| Python | 3.10+ | [python.org](https://www.python.org/downloads/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| PostgreSQL | 15+ | [postgresql.org](https://www.postgresql.org/download/) |

---

### Backend Setup (FastAPI)

```bash
# 1. Enter the backend directory
cd backend

# 2. Create and activate Python virtual environment
python -m venv venv
venv\Scripts\activate          # Windows (PowerShell/cmd)
# source venv/bin/activate     # macOS / Linux

# 3. Install all Python dependencies
pip install -r requirements.txt

# 4. Create the PostgreSQL database (ensure Postgres is running first)
python init_db.py

# 5. Seed the database with trains, users, and 30 days of crowd history
python seed_data.py
```

> **Default test credentials seeded by `seed_data.py`:**
> | Email | Password | Role |
> |---|---|---|
> | `admin@railvision.in` | `admin123` | Admin (Dashboard access) |
> | `passenger@railvision.in` | `pass123` | Passenger (Train search) |

---

### Frontend Setup (Vite + React)

```bash
# 1. Enter the frontend directory
cd frontend

# 2. Install Node.js dependencies
npm install
```

---

### Running the Full-Stack App

You need **two terminal windows** running simultaneously:

**Terminal 1 — Backend API**
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```
- API base URL: **http://localhost:8000**
- Swagger docs: **http://localhost:8000/docs**

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```
- App URL: **http://localhost:5173**

---

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (React + Vite)                   │
│                                                             │
│  Landing → Login → [Passenger | Dashboard]                  │
│                                                             │
│  ┌──────────────┐  ┌────────────────────────────────────┐  │
│  │  Leaflet Map │  │  Chart.js (Bar / Line / Gradient)  │  │
│  │  CartoDB OSM │  │  Real crowd data from /dashboard   │  │
│  └──────────────┘  └────────────────────────────────────┘  │
│                                                             │
│  apiClient.js  →  fetch() with JWT Bearer token            │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP (localhost:8000)
┌────────────────────────────▼────────────────────────────────┐
│                FastAPI Backend (Python)                     │
│                                                             │
│  /auth        → JWT authentication & RBAC                  │
│  /trains      → Train list & search                        │
│  /crowd       → Live crowd level + compartment breakdown   │
│  /predict     → 8-hour sinusoidal time-based prediction    │
│  /dashboard   → KPIs, heatmap, route analytics             │
│  /report      → Passenger crowd submissions                │
└────────────────────────────┬────────────────────────────────┘
                             │ SQLAlchemy ORM
┌────────────────────────────▼────────────────────────────────┐
│                PostgreSQL Database                          │
│                                                             │
│  users  │  trains  │  crowd_data  │  predictions  │ reports │
└─────────────────────────────────────────────────────────────┘
```

### Auth & Role-Based Access Control (RBAC)

| Role | Can Access |
|---|---|
| `passenger` | Landing, Login, Passenger (train search, crowd reports) |
| `admin` | Dashboard (full), including Team Management panel |
| `controller` | Dashboard (KPIs, heatmap, routes — no team management) |

---

## 🎨 Design System — Human Edition

The UI is built on the **"Human Edition"** design philosophy — warm, organic, and approachable rather than cold or technical.

### Colour Palette

| Token | Value | Use |
|---|---|---|
| `--cream` | `#FBF8F3` | Page background |
| `--cream-dark` | `#F5EFE6` | Card surfaces, inputs |
| `--cream-deep` | `#EDE4D8` | Borders, dividers |
| `--ink` | `#1C1917` | Primary text |
| `--ink-soft` | `#44403C` | Secondary text |
| `--terra` | `#C2502A` | Primary accent (CTA, links, badges) |
| `--terra-light` | `#F5A07B` | Soft accent |
| `--sage` | `#4A7C59` | Success / Calm crowd status |
| `--amber` | `#B45309` | Warning / Filling crowd status |
| `--rose` | `#BE123C` | Danger / Very Busy crowd status |

### Typography

| Font | Weight | Role |
|---|---|---|
| **Bricolage Grotesque** | 400–800 | Display headings (H1, H2, H3) |
| **Plus Jakarta Sans** | 400–700 | Body text, labels, UI copy |
| **JetBrains Mono** | 400–500 | Code, IDs, monospaced data |

### Radius Scale
All UI elements use soft, rounded corners: `8px → 14px → 20px → 28px → 40px → full`

---

## 🧠 AI & Prediction Engine

Predictions are generated server-side by the `/predict/{train_id}` endpoint (`backend/app/routes/predictions.py`):

### Time-Based Sinusoidal Model

The model divides the day into four bands with realistic crowd curves:

```python
# Morning peak  07:00–10:00
base = 70 + 15 * sin((hour - 7) * π / 3)

# Evening peak  17:00–20:00
base = 72 + 13 * sin((hour - 17) * π / 3)

# Midday        11:00–16:00
base = 45 + 10 * sin((hour - 11) * π / 5)

# Night / early 22:00–06:00
base = 25 + 8  * sin(hour * π / 12)
```

**Day-of-week adjustments**: Friday +15%, Sunday +10%, Saturday −15%

**Historical bias**: The most recent `crowd_data` record creates a ±30% offset, anchoring predictions to current reality.

**Confidence score**: Starts at 95% and decays by 5% per hour of forecast, floored at 55%.

### Crowd Level Thresholds

| Level | Density Range | Badge |
|---|---|---|
| **Calm** | 0–40% | 🟢 sage green |
| **Filling Up** | 41–70% | 🟡 amber |
| **Very Busy** | 71–100% | 🔴 rose red |

---

## 🔮 Future Enhancements

- [ ] **Live Train Status** — Integrate [IndianRailAPI](https://indianrailapi.com) for real running status and PNR info
- [ ] **GPS Live Tracking** — Plot moving train icons on the Leaflet map via `setLatLng()` polling
- [ ] **CRIS API Integration** — Official NTES/PRS data from [crisapis.indianrail.gov.in](https://crisapis.indianrail.gov.in/) after registration
- [ ] **MapMyIndia Maps** — Switch to [MapMyIndia](https://apis.mapmyindia.com/) for better Indian rail coverage
- [ ] **PWA / Offline Mode** — Service worker caching to handle spotty mobile data
- [ ] **LSTM Prediction Model** — Replace sinusoidal model with a deep learning sequence model trained on historical crowd data
- [ ] **Push Alerts** — Notify passengers when a specific train reaches high crowd thresholds
- [ ] **Community Reports** — Gamified passenger crowd reporting with trust scoring

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for Indian Railways**

*RailVision — Making unreserved railway travel smarter, calmer, and more human.*

🚆 🗺️ 🚉

</div>
