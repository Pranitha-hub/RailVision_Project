# 🚆 RailVision — AI-Powered Crowd Intelligence Platform

<div align="center">

**Predict crowd levels • Find the best travel time • Receive AI-powered recommendations**

*A modern, premium web application providing real-time crowd intelligence and AI predictions for unreserved Indian railway travel.*

![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?logo=chartdotjs&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Custom_Properties-1572B6?logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Application Walkthrough](#-application-walkthrough)
  - [Landing Page](#1-landing-page)
  - [Passenger Interface](#2-passenger-interface)
  - [Authority Dashboard](#3-authority-dashboard)
- [Architecture & Design](#-architecture--design)
  - [Design System](#design-system)
  - [Mock Data Engine](#mock-data-engine)
  - [AI Prediction Engine](#ai-prediction-engine)
  - [SPA Router](#spa-router)
  - [Component Library](#component-library)
- [User Flows](#-user-flows)
- [Responsive Design](#-responsive-design)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**RailVision** addresses a critical challenge faced by millions of Indian railway passengers daily — **unpredictable crowd levels on unreserved trains**. By combining simulated real-time data with AI prediction algorithms, RailVision empowers:

- **Passengers** to make informed travel decisions by checking crowd density, viewing AI-powered predictions, and discovering less crowded alternatives.
- **Railway Authorities** to monitor crowd patterns, analyze peak hours, and make data-driven decisions about coach deployment and crowd management.

> **Note:** This is a frontend-focused prototype. All data, AI predictions, and real-time updates are simulated with realistic mock generators. The architecture is designed so a real backend can seamlessly replace the mock layer in the future.

---

## ✨ Key Features

### For Passengers 🧑‍💼
| Feature | Description |
|---------|-------------|
| **Train Search** | Search trains by source and destination stations across 30+ Indian railway stations |
| **Real-Time Crowd Indicators** | Color-coded badges (🟢 Low / 🟡 Moderate / 🔴 High) with animated fill bars |
| **AI Crowd Prediction** | Line chart forecasting crowd levels up to 8 hours ahead with confidence bands |
| **Compartment Breakdown** | Coach-level density view (General, Sleeper, 3A, 2A, 1A) |
| **Smart Recommendations** | AI suggests less crowded alternative trains and optimal travel times |
| **Crowd Reporting** | Passengers can submit real-time crowd observations |
| **Live Alerts** | Scrolling ticker of overcrowding alerts, delays, and platform changes |

### For Railway Authorities 🏛️
| Feature | Description |
|---------|-------------|
| **KPI Dashboard** | Animated stat cards showing total passengers, avg density, alerts, and reports |
| **Route Analytics Chart** | Bar/line toggle chart showing current density across top routes |
| **Peak Hours Heatmap** | 7-day × 24-hour color-coded grid revealing crowd patterns |
| **High-Density Routes Table** | Sortable table with current/average density, peak hours, and status |
| **Coach Deployment Support** | AI-generated recommendations for adding extra coaches with priority levels |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Build Tool** | [Vite](https://vitejs.dev/) 8.0 | Lightning-fast dev server and bundler |
| **Language** | HTML5 + Vanilla JavaScript (ES6+) | Zero-dependency core application |
| **Styling** | Vanilla CSS with Custom Properties | Dark glassmorphism theme, responsive grid |
| **Charts** | [Chart.js](https://www.chartjs.org/) 4.x | Prediction graphs and analytics dashboards |
| **Fonts** | [Google Fonts](https://fonts.google.com/) (Inter + Outfit) | Premium typography system |
| **Data** | Simulated Mock Data | Realistic pattern-based generation |

### Why These Choices?

- **No framework overhead** — Pure vanilla JS keeps the bundle tiny and the code accessible to all skill levels.
- **Vite** — Near-instant HMR (Hot Module Replacement) during development.
- **CSS Custom Properties** — A single source of truth for the entire design system, easily themeable.
- **Chart.js** — Lightweight yet powerful charting for prediction graphs and analytics.

---

## 📁 Project Structure

```
Railway Project/
├── index.html                          # App shell with SEO meta tags
├── package.json                        # Dependencies and scripts
├── vite.config.js                      # Vite configuration
│
├── src/
│   ├── main.js                         # Application entry point
│   ├── router.js                       # Hash-based SPA router
│   │
│   ├── styles/
│   │   └── index.css                   # Complete design system (~600 lines)
│   │                                   #   ├── CSS Custom Properties (colors, spacing, typography)
│   │                                   #   ├── Glassmorphism utilities
│   │                                   #   ├── Component base styles (cards, buttons, badges, modals)
│   │                                   #   ├── Crowd indicator colors
│   │                                   #   ├── Keyframe animations (15+ animations)
│   │                                   #   ├── Responsive breakpoints
│   │                                   #   └── Heatmap grid & data table styles
│   │
│   ├── data/
│   │   ├── mockData.js                 # Mock data engine
│   │   │                               #   ├── 30 Indian railway stations database
│   │   │                               #   ├── 70+ train route generator
│   │   │                               #   ├── Time-of-day crowd density patterns
│   │   │                               #   ├── Day-of-week & seasonal variations
│   │   │                               #   ├── Historical data generator (30 days)
│   │   │                               #   └── Alerts, reports, KPI generators
│   │   │
│   │   └── predictionEngine.js         # AI prediction engine
│   │                                   #   ├── Weighted moving average predictor
│   │                                   #   ├── Confidence interval calculation
│   │                                   #   ├── Alternative train recommendation algorithm
│   │                                   #   ├── Compartment-level breakdown
│   │                                   #   └── Coach deployment recommendations
│   │
│   ├── components/
│   │   └── components.js               # Reusable UI components
│   │                                   #   ├── Navbar (role-aware)
│   │                                   #   ├── CrowdBadge (color-coded)
│   │                                   #   ├── StatCard (animated counter)
│   │                                   #   ├── TrainCard (crowd visualization)
│   │                                   #   ├── AlertBanner (sliding notification)
│   │                                   #   ├── Modal (backdrop blur)
│   │                                   #   ├── Toast (success/warning/error)
│   │                                   #   └── Particle background (canvas)
│   │
│   └── pages/
│       ├── landing.js                  # Landing page
│       │                               #   ├── Animated hero with particle effects
│       │                               #   ├── Platform statistics (animated counters)
│       │                               #   ├── Feature cards grid
│       │                               #   ├── How-it-works steps
│       │                               #   ├── Role selection (Passenger / Authority)
│       │                               #   └── Scroll-triggered animations
│       │
│       ├── passenger.js                # Passenger interface
│       │                               #   ├── Search panel (from/to/date)
│       │                               #   ├── Train result cards with crowd bars
│       │                               #   ├── Detail modal (compartment + Chart.js prediction)
│       │                               #   ├── Crowd reporting form
│       │                               #   └── Live alerts ticker
│       │
│       └── dashboard.js                # Authority dashboard
│                                       #   ├── KPI stat cards (animated)
│                                       #   ├── Analytics chart (bar/line toggle)
│                                       #   ├── Peak hours heatmap (7×24 grid)
│                                       #   ├── Sortable high-density routes table
│                                       #   └── Coach deployment decision support
│
└── public/                             # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### Installation

```bash
# 1. Clone or navigate to the project directory
cd "c:\Users\DELL\Desktop\Railway Project"

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The application will be available at **http://localhost:5173/** (or the next available port).

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## 🖥️ Application Walkthrough

### 1. Landing Page

The entry point of the application features a premium dark-themed design with:

- **Animated Hero Section** — A full-height hero with gradient text, particle background (canvas-based), and a train SVG animation gliding across the bottom.
- **Platform Statistics** — Animated counters displaying "50+ Stations Covered", "200+ Daily Trains", and "95+ Prediction Accuracy %".
- **Feature Cards** — Four glassmorphism cards highlighting core capabilities: Real-Time Tracking, AI Predictions, Safety Alerts, and Smart Tips.
- **How It Works** — Three-step visual guide: Search → Analyze → Decide.
- **Role Selector** — Two interactive cards allowing the user to enter as a **Passenger** or **Railway Authority**. Each card lists the features available for that role.

**Navigation:** Clicking either role card saves the selection to `sessionStorage` and redirects to the appropriate interface.

---

### 2. Passenger Interface

After selecting the **Passenger** role, users land on a search-first interface:

#### Search Panel
- **From Station** — Dropdown with 30 Indian railway stations (e.g., New Delhi, Mumbai Central, Howrah Junction).
- **To Station** — Destination dropdown with a **swap button (⇄)** for convenience.
- **Travel Date** — Date picker defaulting to today.
- **Search Button** — Triggers train lookup; initial view shows 6 popular trains.

#### Train Result Cards
Each train card displays:
- Train name and number
- Operating days (e.g., Mon, Wed, Fri)
- Departure/arrival times with duration and a visual route line
- **Crowd level badge** — Animated pulsing badge with real-time density percentage
- **Crowd fill bar** — Color-coded progress bar (green → amber → red)
- "View Details & AI Prediction →" button

#### Crowd Detail Modal
Clicking a train opens a detailed modal with:
- **Compartment Breakdown** — Individual bars for General, Sleeper, 3A, 2A, 1A with density labels ("Available", "Filling Up", "Full").
- **AI Prediction Chart** — A Chart.js line graph showing predicted crowd density for the next 8 hours, including a shaded confidence band and the current hour highlighted.
- **Less Crowded Alternatives** — AI-recommended trains with lower predicted crowd levels and best travel times.

#### Crowd Reporting
Accessible via the navbar "Report Crowd" button, this modal allows passengers to:
1. Select a station
2. Optionally specify a train
3. Choose density level (Low/Moderate/High) with interactive radio cards
4. Add descriptive notes
5. Submit — triggers a success toast notification

#### Live Alerts Ticker
Below the search panel, a scrolling section shows the 3 most recent alerts (overcrowding warnings, delays, platform changes).

---

### 3. Authority Dashboard

After selecting the **Railway Authority** role, users access a comprehensive analytics dashboard:

#### KPI Cards (Top Row)
Four animated stat cards with counters that animate on page load:
| Metric | Icon | Description |
|--------|------|-------------|
| Total Passengers Today | 👥 | Estimated total across all monitored trains |
| Avg Crowd Density | 📊 | Average density percentage with suffix |
| Overcrowding Alerts | ⚠️ | Count of trains exceeding 75% density |
| Active Reports | 📝 | Passenger-submitted crowd reports |

#### Crowd Analytics Chart
- Displays current density for the top 10 routes
- Toggle between **Bar** and **Line** chart views
- Color-coded per route based on crowd level
- Interactive tooltips on hover

#### Peak Hours Heatmap
- **7 rows** (Mon–Sun) × **24 columns** (hours)
- Each cell is color-coded: green (low) → amber (moderate) → red (high)
- Hover on any cell reveals the exact day, hour, and density percentage
- Instantly reveals patterns like morning/evening rush hours and weekend variations

#### High-Density Routes Table
- Sortable by Route, Train, Current%, Avg%, Peak Hour
- Each row includes:
  - A mini crowd bar visualization
  - Color-coded density percentage
  - Status badge (Normal / Watch / Alert)
- Click column headers to sort ascending/descending

#### Decision Support — Coach Deployment
- AI-generated recommendations for trains needing extra coaches
- Each recommendation shows:
  - **Priority** badge (Critical / High / Medium)
  - Train name and route
  - Current density percentage
  - Specific recommendation (e.g., "Add 2 extra General/Sleeper coaches")
  - Estimated impact (e.g., "Reduce density by ~16-24%")
- Shows "✅ All Clear" when no additional coaches are needed

---

## 🏗️ Architecture & Design

### Design System

The design system is built entirely with **CSS Custom Properties** in `src/styles/index.css`:

```css
/* Color Palette */
--color-bg-primary: #0a0e1a;        /* Deep navy background */
--color-accent-teal: #06b6d4;       /* Primary accent */
--color-accent-amber: #f59e0b;      /* Secondary accent */
--color-accent-purple: #8b5cf6;     /* Tertiary accent */

/* Crowd Indicators */
--crowd-low: #10b981;               /* Green — safe */
--crowd-moderate: #f59e0b;          /* Amber — caution */
--crowd-high: #ef4444;              /* Red — danger */
```

Key design patterns:
- **Glassmorphism** — Semi-transparent cards with `backdrop-filter: blur()` for depth
- **15+ Keyframe Animations** — fadeIn, slideIn, scaleIn, float, pulse, shimmer, trainMove, dotPulse, etc.
- **Responsive Grid** — CSS Grid with `.grid-2`, `.grid-3`, `.grid-4` utilities
- **Utility Classes** — `.glass`, `.glass-card`, `.text-gradient`, `.badge-green`, etc.
- **Custom Scrollbar** — Styled to match the dark theme

### Mock Data Engine

`src/data/mockData.js` provides a **deterministic, seeded data generation system**:

- **30 Indian railway stations** with codes, names, cities, zones, and coordinates
- **70+ train routes** generated from 30 station pairs
- **Crowd density algorithm** considering:
  - Time of day (morning/evening peak hours)
  - Day of week (higher on Fridays and Sundays)
  - Seasonal patterns (Diwali, Holi, summer holidays)
  - Train-specific base popularity
  - Random noise for realism
- **30-day historical data** per train for analytics
- **Seeded randomness** — uses `Math.sin()` based seeding for consistent, reproducible results

### AI Prediction Engine

`src/data/predictionEngine.js` implements:

1. **Weighted Moving Average (WMA)** — Predicts future crowd density using 14 days of historical data, weighting recent days more heavily and same-day-of-week data with a bonus multiplier.

2. **Confidence Intervals** — Calculates standard deviation from historical patterns, expanding the confidence band for predictions further into the future.

3. **Alternative Train Recommender** — Finds trains on similar routes, ranks by predicted density, and identifies the optimal travel time for each.

4. **Compartment Breakdown** — Models density per coach class (General coaches are 1.4x the base, 1A is 0.4x).

5. **Coach Deployment Advisor** — Flags trains over 70% density and recommends 1–3 extra coaches based on severity.

### SPA Router

`src/router.js` implements a lightweight **hash-based Single Page Application router**:

```
Hash Route        → Page
#/                → Landing page
#/passenger       → Passenger interface
#/dashboard       → Authority dashboard
```

Features:
- **Route guards** — Checks `sessionStorage` role before allowing access
- **Page transitions** — CSS fade-out/fade-in animations between routes
- **Navbar management** — Adds/removes the role-aware navbar based on current route

### Component Library

`src/components/components.js` provides reusable components:

| Component | Description |
|-----------|-------------|
| `createNavbar()` | Role-aware navigation with brand logo, links, role badge, and logout |
| `createCrowdBadge()` | Color-coded pill badge with pulsing dot animation |
| `createStatCard()` | KPI card with icon, label, animated counter, and accent color |
| `createTrainCard()` | Full train info card with schedule, crowd bar, and detail button |
| `createAlertBanner()` | Severity-colored alert with icon, message, and timestamp |
| `openModal()` / `closeModal()` | Reusable modal with glass backdrop and close button |
| `showToast()` | Auto-dismissing toast notification (success/warning/error) |
| `animateCounters()` | Cubic ease-out counter animation from 0 to target value |
| `initParticles()` | Canvas-based particle system with connection lines |

---

## 🔄 User Flows

### Flow 1: Passenger Checking Crowd Levels
```
Landing Page → Click "Passenger" → Search Panel
    → Select "New Delhi" → Select "Mumbai Central" → Click "Search"
    → View train cards with crowd badges
    → Click "View Details" on a train
    → See compartment breakdown + AI prediction chart
    → View alternative train recommendations
    → Close modal
```

### Flow 2: Passenger Reporting Crowd
```
Passenger Page → Click "Report Crowd" in navbar
    → Select station → Choose density level (Low/Moderate/High)
    → Add notes → Click "Submit Report"
    → See success toast notification
```

### Flow 3: Authority Monitoring
```
Landing Page → Click "Railway Authority" → Dashboard
    → View animated KPI cards (passengers, density, alerts, reports)
    → Toggle analytics chart between Bar/Line views
    → Hover over heatmap cells to identify peak hours
    → Sort the high-density routes table by density
    → Review coach deployment recommendations
```

### Flow 4: Switching Roles
```
Any Page → Click "Logout" in navbar → Returns to Landing Page
    → Select a different role → Navigate to new interface
```

---

## 📱 Responsive Design

The application is fully responsive across all devices:

| Breakpoint | Layout Changes |
|-----------|---------------|
| **> 1024px** | Full desktop layout, 4-column grids, sidebar possible |
| **768px–1024px** | 4-column grids reduce to 2-column, charts stack |
| **480px–768px** | All grids become single-column, navbar links hidden, reduced padding |
| **< 480px** | Hero text scales down, compact card layout, full-width modals |

---

## 🔮 Future Enhancements

This prototype is designed for easy extension. Potential next steps:

| Enhancement | Description |
|-------------|-------------|
| **Real Backend** | Replace `mockData.js` with REST API calls to a Node.js/Express server |
| **Live Data** | Integrate with Indian Railways API for real train schedules |
| **WebSocket Updates** | Real-time crowd density push notifications |
| **User Authentication** | Login system for persistent profiles and reports |
| **ML Model** | Replace WMA with a trained TensorFlow.js model for better predictions |
| **Map View** | Integrate Leaflet/Mapbox to visualize station density on a map |
| **Push Notifications** | Browser notifications for overcrowding alerts on saved routes |
| **PWA Support** | Service worker for offline capability and installability |
| **Dark/Light Theme** | Theme toggle using the existing CSS Custom Properties system |
| **Accessibility** | ARIA labels, keyboard navigation, screen reader support |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for Indian Railways**

*RailVision — Making unreserved railway travel smarter, safer, and more predictable.*

🚆 🛤️ 🚉

</div>
