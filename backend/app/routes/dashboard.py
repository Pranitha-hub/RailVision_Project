"""
Authority dashboard routes — KPIs, heatmap data, route analytics.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime

from ..database import get_db
from ..models import Train, CrowdData, Report, UserRole
from ..deps import RoleChecker

# Access restricted to Admin (Authority) and System Controller
dashboard_guard = Depends(RoleChecker([UserRole.admin, UserRole.controller]))

router = APIRouter(
    prefix="/dashboard",
    tags=["Authority Dashboard"],
    dependencies=[dashboard_guard]
)


@router.get("/kpis")
def get_kpis(db: Session = Depends(get_db)):
    total_trains = db.query(Train).count()
    total_reports = db.query(Report).count()

    # Calculate real averages from DB
    avg_crowd = db.query(func.avg(CrowdData.crowd_level)).scalar() or 0
    overcrowding = db.query(CrowdData).filter(CrowdData.crowd_level > 75).count()

    # Get latest distinct data points for alert count instead of historical sum
    latest_alerts = db.query(func.count(CrowdData.id)).filter(
        CrowdData.timestamp >= datetime.utcnow().replace(hour=0, minute=0, second=0),
        CrowdData.crowd_level > 75
    ).scalar() or 0

    return {
        "total_passengers": total_trains * 1250, # Rough proxy
        "avg_density": round(avg_crowd, 1),
        "overcrowding_alerts": latest_alerts,
        "active_reports": total_reports,
    }


@router.get("/heatmap")
def get_heatmap(db: Session = Depends(get_db)):
    """Generate a 7-day x 24-hour heatmap using REAL database aggregates."""
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    # Extract day of week (0=Mon for postgres sometimes, but we'll use extract ISODOW where 1=Mon, 7=Sun)
    # Then extract hour. We'll group by both.
    results = db.query(
        extract('isodow', CrowdData.timestamp).label('dow'),
        extract('hour', CrowdData.timestamp).label('hour'),
        func.avg(CrowdData.crowd_level).label('avg_level')
    ).group_by('dow', 'hour').all()

    # Build a lookup dictionary: dict[dow][hour] = avg_level
    # ISODOW: 1=Mon, 2=Tue ... 7=Sun
    matrix = {dow: {h: 20.0 for h in range(24)} for dow in range(1, 8)} 

    for r in results:
        dow = int(r.dow)
        hr = int(r.hour)
        if 1 <= dow <= 7 and 0 <= hr <= 23:
            matrix[dow][hr] = float(r.avg_level)

    heatmap = []
    for day_idx, day_name in enumerate(days):
        dow_pg = day_idx + 1 # 1 to 7
        row_hours = [round(matrix[dow_pg][h], 1) for h in range(24)]
        heatmap.append({"day": day_name, "hours": row_hours})

    return {"heatmap": heatmap}


@router.get("/routes")
def get_high_density_routes(db: Session = Depends(get_db)):
    """Get high-density routes for the table using REAL database metrics."""
    trains = db.query(Train).all()
    routes = []

    for t in trains:
        # Get REAL current density
        latest = (
            db.query(CrowdData.crowd_level)
            .filter(CrowdData.train_id == t.train_id)
            .order_by(CrowdData.timestamp.desc())
            .first()
        )
        current = latest[0] if latest else 0

        # Get REAL historical average
        avg = db.query(func.avg(CrowdData.crowd_level)).filter(CrowdData.train_id == t.train_id).scalar() or 0

        # Find REAL peak hour for this train
        peak_res = db.query(
            extract('hour', CrowdData.timestamp).label('hr'),
            func.avg(CrowdData.crowd_level).label('lvl')
        ).filter(CrowdData.train_id == t.train_id).group_by('hr').order_by(func.avg(CrowdData.crowd_level).desc()).first()
        
        peak_hour = "N/A"
        if peak_res:
            hr = int(peak_res.hr)
            am_pm = "AM" if hr < 12 else "PM"
            hr_12 = hr if hr <= 12 else hr - 12
            if hr_12 == 0: hr_12 = 12
            peak_hour = f"{hr_12}:00 {am_pm}"

        if current > 75:
            route_status = "Alert"
        elif current > 55:
            route_status = "Watch"
        else:
            route_status = "Normal"

        routes.append({
            "route": f"{t.source} → {t.destination}",
            "train_name": t.train_name,
            "train_id": t.train_id,
            "current_density": round(current, 1),
            "avg_density": round(avg, 1),
            "peak_hour": peak_hour,
            "status": route_status,
        })

    # Sort by current density descending
    routes.sort(key=lambda x: x["current_density"], reverse=True)
    return {"routes": routes}
