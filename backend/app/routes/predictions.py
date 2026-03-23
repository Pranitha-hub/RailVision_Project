"""
AI prediction routes — generates crowd predictions for the next 8 hours.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import math

from ..database import get_db
from ..models import CrowdData

router = APIRouter(tags=["Predictions"])


def _time_based_density(hour: int, day_of_week: int) -> float:
    """Generate realistic crowd density based on time patterns."""
    # Morning peak (7-10), Evening peak (17-20)
    if 7 <= hour <= 10:
        base = 70 + 15 * math.sin((hour - 7) * math.pi / 3)
    elif 17 <= hour <= 20:
        base = 72 + 13 * math.sin((hour - 17) * math.pi / 3)
    elif 11 <= hour <= 16:
        base = 45 + 10 * math.sin((hour - 11) * math.pi / 5)
    else:
        base = 25 + 8 * math.sin(hour * math.pi / 12)

    # Day-of-week adjustment (Friday=4, Sunday=6 are busier)
    if day_of_week == 4:
        base *= 1.15
    elif day_of_week == 6:
        base *= 1.1
    elif day_of_week == 5:
        base *= 0.85  # Saturday quieter

    return max(10, min(95, base + random.uniform(-8, 8)))


@router.get("/predict/{train_id}")
def get_prediction(train_id: str, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    predictions = []

    # Get some historical context
    recent = (
        db.query(CrowdData)
        .filter(CrowdData.train_id == train_id)
        .order_by(CrowdData.timestamp.desc())
        .first()
    )
    base_offset = 0
    if recent:
        base_offset = (recent.crowd_level - 50) * 0.3  # Slight bias from recent data

    for h in range(8):
        target_time = now + timedelta(hours=h)
        hour = target_time.hour
        day = target_time.weekday()

        predicted = _time_based_density(hour, day) + base_offset
        predicted = max(10, min(95, predicted))

        confidence = max(0.55, 0.95 - (h * 0.05))
        margin = predicted * (1 - confidence) * 0.6

        predictions.append({
            "hour": target_time.isoformat(),
            "predicted_level": round(predicted, 1),
            "confidence": round(confidence, 2),
            "lower_bound": round(max(0, predicted - margin), 1),
            "upper_bound": round(min(100, predicted + margin), 1),
        })

    return {
        "train_id": train_id,
        "predictions": predictions,
        "model_version": "v1.0-simulated"
    }
