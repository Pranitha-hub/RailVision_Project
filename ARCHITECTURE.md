# 🚆 RailVision – Full Stack Technical Architecture (CTO-Level)

## 🔭 1. System Vision
RailVision is a real-time + predictive data platform for unreserved train travel under Indian Railways.
👉 It combines:
- Live data ingestion
- AI prediction
- Decision support
- User-facing application

## 🧱 2. Full Stack Overview
| Layer | Technology |
|---|---|
| Frontend | React.js / Flutter (Currently Vanilla JS + Vite) |
| Backend | Python (FastAPI) |
| Database | PostgreSQL |
| AI/ML | Python (Scikit-learn, Pandas) |
| APIs | Railway APIs + GPS |
| Hosting | AWS / Render / Railway.app |

## 💻 3. Frontend (User & Admin Interface)
**Tech Stack:** React.js (Web) / Vanilla JS SPA
**Libraries:**
- Axios → API calls
- Chart.js / Recharts → graphs
- Leaflet.js → maps

**👤 Passenger UI Features:**
- Train search
- Crowd status (🟢🟡🔴)
- AI prediction display
- Suggestions (best train)
- Report crowd button

**🧑‍💼 Admin Dashboard:**
- Crowd heatmap
- Peak hour analytics
- Route congestion
- Prediction insights

## ⚙️ 4. Backend (Core System)
**Tech Stack:** Python + FastAPI
**Key Libraries:**
- FastAPI → API framework
- SQLAlchemy → DB ORM
- Pandas → data processing
- NumPy → numerical operations
- Scikit-learn → ML models
- Pydantic → data validation
- Uvicorn → server

**Core APIs:**
- `GET /trains`
- `GET /crowd/{train_id}`
- `POST /report`
- `GET /predict/{train_id}`

## 🗄️ 5. Database (PostgreSQL Setup)
**Recommended Setup:**
- Database: `railvision_db`
- Connection String: `postgresql://postgres:270806@localhost:5432/railvision_db`
*(Use .env file for production)*

**Tables Design:**
- **Users**: id (PK), name, email, password, role
- **Trains**: train_id (PK), train_name, source, destination, departure_time
- **Crowd_Data**: id (PK), train_id (FK), timestamp, crowd_level, source (user/system)
- **Predictions**: id (PK), train_id (FK), predicted_level, confidence, time
- **Reports**: id (PK), user_id (FK), train_id (FK), crowd_input, timestamp

## 🤖 6. AI / Machine Learning Layer
**Libraries:** Pandas, Scikit-learn, Statsmodels (for time-series)
**Models Used:**
1. Time Series (Core) - Predict crowd over time
2. Regression Model - Based on time, day, location

## 🔗 7. APIs Integration
**🚆 Railway APIs:** NTES (Train Data), CRIS Systems
**🌍 Other APIs:** Maps API (Google Maps/OpenStreetMap), GPS Data, Weather API

## 🔐 8. Security Architecture
**Must Implement:** JWT Authentication, HTTPS, Password hashing (bcrypt)

## 🔄 9. End-to-End Data Flow
User searches train → Backend fetches data from APIs → DB stores historical + live data → AI predicts crowd → Backend sends result → UI displays insights

## 📊 10. Deployment Strategy
- **Backend:** Render / AWS / Railway.app
- **Database:** PostgreSQL (Cloud or Local)
- **Frontend:** Vercel / Netlify

## ⚠️ 11. CTO-Level Advice
🔴 **Do NOT:** Hardcode DB password in code, Depend only on real railway APIs.
🟢 **DO:** Mock API data initially, Build AI using sample datasets, Focus on working prototype.

## 🏁 12. Implementation Roadmap
- **Phase 1 (Week 1–2):** UI + basic backend, DB setup
- **Phase 2 (Week 3–4):** Crowd reporting system, APIs
- **Phase 3 (Week 5–6):** AI prediction
- **Phase 4 (Week 7+):** Dashboard + optimization
