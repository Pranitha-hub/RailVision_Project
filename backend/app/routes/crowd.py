"""
Crowd data and reporting routes.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from ..models import CrowdData, Report, CrowdSource, User
from ..schemas.user import CrowdReportCreate
from ..deps import get_current_user

router = APIRouter(tags=["Crowd"])


@router.get("/crowd/{train_id}")
def get_crowd(train_id: str, db: Session = Depends(get_db)):
    crowd_records = (
        db.query(CrowdData)
        .filter(CrowdData.train_id == train_id)
        .order_by(CrowdData.timestamp.desc())
        .limit(100)
        .all()
    )

    if not crowd_records:
        return {
            "train_id": train_id,
            "current": {"crowd_level": 45.0, "status": "Moderate"},
            "history": []
        }

    latest = crowd_records[0]
    level = latest.crowd_level
    status = "Low" if level < 40 else "Moderate" if level < 70 else "High"

    # Simulate compartment breakdown from overall crowd level
    compartments = {
        "general": round(min(100, level * 1.3), 1),
        "sleeper": round(min(100, level * 0.95), 1),
        "3ac": round(min(100, level * 0.75), 1),
        "2ac": round(min(100, level * 0.55), 1),
        "1ac": round(min(100, level * 0.35), 1),
    }

    history = [
        {"timestamp": cd.timestamp.isoformat(), "crowd_level": cd.crowd_level}
        for cd in crowd_records
    ]

    return {
        "train_id": train_id,
        "current": {
            "crowd_level": round(level, 1),
            "status": status,
            "timestamp": latest.timestamp.isoformat() if latest.timestamp else None,
            "source": latest.source.value if hasattr(latest.source, "value") else str(latest.source),
        },
        "compartments": compartments,
        "history": history,
    }


@router.post("/report", status_code=201)
def submit_report(
    report: CrowdReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Map crowd_level string to a numeric value
    level_map = {"Low": 25.0, "Moderate": 55.0, "High": 85.0}
    numeric_level = level_map.get(report.crowd_level, 55.0)

    # Save the report
    new_report = Report(
        user_id=current_user.id,
        train_id=report.train_id,
        crowd_input=report.crowd_level,
        timestamp=datetime.utcnow()
    )
    db.add(new_report)

    # Also add to crowd_data as a user-sourced observation
    crowd_entry = CrowdData(
        train_id=report.train_id,
        timestamp=datetime.utcnow(),
        crowd_level=numeric_level,
        source=CrowdSource.user
    )
    db.add(crowd_entry)
    db.commit()

    return {"message": "Report submitted successfully. Thank you!"}
