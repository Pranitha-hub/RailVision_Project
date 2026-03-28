# 🚆 RailVision — AI-Powered Crowd Intelligence Platform

<div align="center">

**Predict crowd levels • Find the best travel time • Receive AI-powered recommendations**

*A modern, premium full-stack application providing real-time crowd intelligence and AI predictions for unreserved Indian railway travel.*

![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Backend Setup (FastAPI)](#backend-setup-fastapi)
  - [Frontend Setup (Vite)](#frontend-setup-vite)
  - [Startup Instructions](#startup-instructions-critical)
- [Application Architecture](#-application-architecture)
- [AI Algorithms](#-ai-algorithms)
- [User Walkthrough](#-user-walkthrough)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**RailVision** addresses a critical challenge faced by millions of Indian railway passengers daily — **unpredictable crowd levels on unreserved trains**. By combining real-time database management with AI prediction algorithms, RailVision empowers:

- **Passengers** to make informed travel decisions by checking crowd density, viewing AI-powered predictions, and discovering less crowded alternatives.
- **Railway Authorities** to monitor crowd patterns, analyze peak hours, and make data-driven decisions about coach deployment and crowd management.

Originally a prototype, RailVision has evolved into a **Full-Stack Platform** featuring a robust Python backend, PostgreSQL database, and a high-performance interactive frontend.

---

## ✨ Key Features

### For Passengers 🧑‍💼
- **Train Search**: Real-time lookup of trains across 30+ major Indian stations.
- **Crowd Indicators**: Color-coded badges (🟢 Low / 🟡 Moderate / 🔴 High) with animated density bars.
- **AI Analytics**: Line charts forecasting crowd levels based on historical patterns and real-time reports.
- **Smart Recommendations**: Suggests alternative trains and optimal travel times to avoid peak hours.
- **Crowd Reporting**: Community-driven reporting to update crowd levels in real-time.

### For Railway Authorities 🏛️
- **KPI Dashboard**: Real-time stats on total passengers, avg density, and active overcrowding alerts.
- **Heatmap Analysis**: 24/7 crowd density visualizations to identify bottleneck times.
- **Route Analytics**: Toggleable bar/line charts comparing density across major routes.
- **Coach Deployment AI**: Automatic identification of trains requiring additional capacity.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React.js 19 + Vite 6.0 | Modern UI development with fast HMR |
| **Backend API** | FastAPI (Python) | High-performance asynchronous API |
| **Database** | PostgreSQL | Relational storage for trains, users, and reports |
| **ORM** | SQLAlchemy | Pythonic database management |
| **Styling** | Vanilla CSS (Glassmorphism) | Modern, premium UI design system |
| **Charts** | Chart.js 4.x | Interactive data visualizations |
| **Routing** | React Router 7.0 | Component-based navigation |

---

## 📁 Project Structure

```
RailVision Project/
├── backend/                            # 🐍 PYTHON BACKEND
│   ├── app/                            # FastAPI application core
│   │   ├── routes/                     # API endpoints (Auth, Trains, Crowd, etc.)
│   │   ├── models.py                   # SQLAlchemy database schemas
│   │   ├── database.py                 # DB connection logic
│   │   └── main.py                     # API Entry point
│   ├── venv/                           # Python virtual environment
│   ├── .env                            # Backend environment variables
│   ├── requirements.txt                # Python dependencies
│   ├── init_db.py                      # Database initialization script
│   └── server.js                       # Legacy Node.js backend (Backup)
│
├── frontend/                           # ⚛️ VITE FRONTEND (React)
│   ├── src/                            # Frontend source code
│   │   ├── components/                 # Reusable UI components
│   │   ├── pages/                      # SPA Page components
│   │   ├── styles/                     # Design system (index.css)
│   │   ├── data/                       # API Client & Mock Data
│   │   ├── App.jsx                     # Root component & Routing
│   │   └── main.jsx                    # Frontend entry point
│   ├── public/                         # Static assets
│   ├── index.html                      # App shell
│   ├── package.json                    # Dependencies & Scripts
│   └── node_modules/                   # Frontend modules
│
└── README.md                           # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL 15+** (Running locally)

### Backend Setup (FastAPI)
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Initialize the database:
   ```bash
   python init_db.py
   ```

### Frontend Setup (Vite)
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Startup Instructions (Critical)

To run the full-stack application, you must start **two separate terminals** (one for the backend and one for the frontend):

#### 1. Start Backend API
```bash
cd backend
venv\Scripts\activate  # If on Windows/cmd
# OR
source venv/bin/activate # If on Linux/Mac/bash

# Start the FastAPI server using uvicorn
uvicorn app.main:app --reload
```
- **API URL**: [http://localhost:8000](http://localhost:8000)
- **Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Start Frontend App
```bash
cd frontend
npm run dev
```
- **App URL**: [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Application Architecture

### Backend (Python/FastAPI)
The backend is built with a modular router pattern:
- **Auth**: JWT-based login and registration.
- **Trains**: Management of station data and train schedules.
- **Crowd**: Real-time processing of passenger reports.
- **Predictions**: Logic for calculating future density based on historical trends.

### Frontend (React + Vite)
- **UI Framework**: React 19 for component-based architecture.
- **Design System**: A cohesive CSS variable-based system in `frontend/src/styles/index.css`.
- **Router**: React Router 7 for seamless SPA navigation.
- **State Management**: Real-time fetching from the FastAPI backend with local fallback/mocking logic.

---

## 🧠 AI Algorithms

RailVision uses a multi-layered approach to predict crowd levels and provide recommendations:

### 1. Crowd Density Prediction (WMA)
The primary prediction engine uses a **Weighted Moving Average (WMA)** with seasonal adjustments:
- **Recency Biasing**: More recent historical data points are given higher weights ($W = 1 / days\_ago$).
- **Periodic Seasonality**: Data from the same day-of-week (e.g., previous Mondays) receives a **2x bonus weight** to account for weekly commute patterns.
- **Confidence Intervals**: Calculated using the standard deviation of historical deviations, providing a transparency score (55-95%) for every prediction.

### 2. Time-Series Peak Modeling
The backend API (`/predict`) utilizes a sinusodial peak-modeling algorithm to simulate realistic railway patterns:
- **Morning Peak**: $7:00 AM - 10:00 AM$
- **Evening Peak**: $5:00 PM - 8:00 PM$
- **Dynamic Offsets**: Real-time passenger reports create a local bias that shifts the entire curve, ensuring predictions adapt to current delays or events.

### 3. Smart Recommendations Engine
- **Alternative Routing**: Checks all trains on the same route and compares their predicted density.
- **Optimal Travel Time**: Scans a 24-hour window to find the "Global Minimum" density hour for any specific train.
- **Coach Deployment AI**: Calculates the required number of additional coaches based on current density vs. capacity thresholds.

---

## 🔮 Future Enhancements
- [ ] **Live GPS Integration**: Track trains in real-time using public railway APIs.
- [ ] **Mobile App**: PWA or React Native companion app for on-the-go reporting.
- [ ] **Advanced ML Model**: Transitioning from WMA to LSTM-based deep learning for better seasonal accuracy.
- [ ] **Map Visualization**: Interactive station maps using Leaflet.js.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License
This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ for Indian Railways**
*RailVision — Making unreserved railway travel smarter, safer, and more predictable.*

🚆 🛤️ 🚉

</div>
