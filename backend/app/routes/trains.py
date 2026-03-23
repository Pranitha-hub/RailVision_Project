"""
Train data routes.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Train, CrowdData

router = APIRouter(prefix="/trains", tags=["Trains"])


@router.get("")
@router.get("/")
def get_trains(
    source: str = None,
    destination: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Train)

    if source:
        query = query.filter(Train.source == source)
    if destination:
        query = query.filter(Train.destination == destination)

    trains = query.all()
    result = []

    for t in trains:
        # Get latest crowd data for this train
        latest_crowd = (
            db.query(CrowdData)
            .filter(CrowdData.train_id == t.train_id)
            .order_by(CrowdData.timestamp.desc())
            .first()
        )
        crowd_level = latest_crowd.crowd_level if latest_crowd else 45.0
        status = "Low" if crowd_level < 40 else "Moderate" if crowd_level < 70 else "High"

        result.append({
            "train_id": t.train_id,
            "train_name": t.train_name,
            "source": t.source,
            "destination": t.destination,
            "departure_time": t.departure_time.isoformat() if t.departure_time else None,
            "current_crowd_level": round(crowd_level, 1),
            "crowd_status": status,
        })

    return {"data": result, "count": len(result)}


@router.get("/{train_id}")
def get_train(train_id: str, db: Session = Depends(get_db)):
    train = db.query(Train).filter(Train.train_id == train_id).first()
    if not train:
        return {"error": "Train not found", "data": None}

    latest_crowd = (
        db.query(CrowdData)
        .filter(CrowdData.train_id == train_id)
        .order_by(CrowdData.timestamp.desc())
        .first()
    )
    crowd_level = latest_crowd.crowd_level if latest_crowd else 45.0

    return {
        "data": {
            "train_id": train.train_id,
            "train_name": train.train_name,
            "source": train.source,
            "destination": train.destination,
            "departure_time": train.departure_time.isoformat() if train.departure_time else None,
            "current_crowd_level": round(crowd_level, 1),
        }
    }
