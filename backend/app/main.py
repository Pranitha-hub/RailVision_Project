"""
RailVision API — Main Application
AI-Powered Crowd Intelligence Backend
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from . import models
from .routes import auth, trains, crowd, predictions, dashboard

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RailVision API",
    description="Backend API for RailVision AI-Powered Crowd Intelligence Platform",
    version="2.0.0"
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(trains.router)
app.include_router(crowd.router)
app.include_router(predictions.router)
app.include_router(dashboard.router)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to RailVision API v2.0",
        "docs": "/docs",
        "endpoints": {
            "auth": ["/auth/register", "/auth/login", "/auth/me"],
            "trains": ["/trains", "/trains/{train_id}"],
            "crowd": ["/crowd/{train_id}", "/report"],
            "predictions": ["/predict/{train_id}"],
            "dashboard": ["/dashboard/kpis", "/dashboard/heatmap", "/dashboard/routes"],
        }
    }
