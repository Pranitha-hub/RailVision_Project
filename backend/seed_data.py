"""
Seed the database with initial trains, crowd data, and test users.
Run from the backend/ directory: python seed_data.py
"""

import os
import random
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models import Base, Train, CrowdData, CrowdSource, User, UserRole
from app.utils.security import hash_password

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:270806@localhost:5432/railvision_db"
)

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)  # Ensure tables exist
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def seed_db():
    db = SessionLocal()

    # ── Seed Users ──
    if db.query(User).count() == 0:
        users = [
            User(
                name="Admin User",
                email="admin@railvision.in",
                password=hash_password("admin123"),
                role=UserRole.admin,
            ),
            User(
                name="Test Passenger",
                email="passenger@railvision.in",
                password=hash_password("pass123"),
                role=UserRole.passenger,
            ),
        ]
        db.add_all(users)
        db.commit()
        print("[OK] Seeded 2 users (admin@railvision.in / admin123, passenger@railvision.in / pass123)")
    else:
        print("[INFO] Users already exist, skipping user seed.")

    # ── Seed Trains ──
    if db.query(Train).count() == 0:
        trains = [
            Train(train_id="train-12000", train_name="Delhi-Mumbai Rajdhani Express",
                  source="NDLS", destination="CSMT",
                  departure_time=datetime(2026, 3, 22, 16, 0),
                  operating_days="Mon,Wed,Fri,Sun", base_popularity=0.9),
            Train(train_id="train-12002", train_name="Delhi-Kolkata Shatabdi Express",
                  source="NDLS", destination="HWH",
                  departure_time=datetime(2026, 3, 22, 17, 0),
                  operating_days="Daily", base_popularity=0.85),
            Train(train_id="train-12004", train_name="Mumbai-Chennai Garib Rath",
                  source="CSMT", destination="MAS",
                  departure_time=datetime(2026, 3, 22, 18, 0),
                  operating_days="Tue,Thu,Sat", base_popularity=0.7),
            Train(train_id="train-12006", train_name="Bangalore-Delhi Sampark Kranti",
                  source="SBC", destination="NDLS",
                  departure_time=datetime(2026, 3, 22, 19, 0),
                  operating_days="Mon,Fri", base_popularity=0.75),
            Train(train_id="train-12008", train_name="Ahmedabad-Jaipur Superfast",
                  source="ADI", destination="JP",
                  departure_time=datetime(2026, 3, 22, 20, 0),
                  operating_days="Daily", base_popularity=0.6),
            Train(train_id="train-12010", train_name="Howrah-Patna Jan Shatabdi",
                  source="HWH", destination="PNBE",
                  departure_time=datetime(2026, 3, 22, 6, 30),
                  operating_days="Daily", base_popularity=0.8),
            Train(train_id="train-12012", train_name="Chennai-Hyderabad Charminar Express",
                  source="MAS", destination="SC",
                  departure_time=datetime(2026, 3, 22, 21, 30),
                  operating_days="Wed,Sat,Sun", base_popularity=0.65),
            Train(train_id="train-12014", train_name="Lucknow-Delhi Shatabdi",
                  source="LKO", destination="NDLS",
                  departure_time=datetime(2026, 3, 22, 6, 0),
                  operating_days="Daily", base_popularity=0.88),
            Train(train_id="train-12016", train_name="Pune-Mumbai Deccan Express",
                  source="PUNE", destination="CSMT",
                  departure_time=datetime(2026, 3, 22, 7, 15),
                  operating_days="Daily", base_popularity=0.92),
            Train(train_id="train-12018", train_name="Jaipur-Jodhpur Intercity",
                  source="JP", destination="JU",
                  departure_time=datetime(2026, 3, 22, 14, 0),
                  operating_days="Mon,Wed,Fri", base_popularity=0.55),
        ]
        db.add_all(trains)
        db.commit()
        print(f"[OK] Seeded {len(trains)} trains")
    else:
        print("[INFO] Trains already exist, skipping train seed.")

    # ── Seed Crowd Data (30 days of historical data per train) ──
    if db.query(CrowdData).count() < 50:
        trains = db.query(Train).all()
        now = datetime.utcnow()
        crowd_entries = []

        for train in trains:
            for day_offset in range(30):
                for hour in [6, 8, 10, 12, 14, 16, 18, 20, 22]:
                    ts = now - timedelta(days=day_offset, hours=random.randint(0, 2))
                    ts = ts.replace(hour=hour, minute=random.randint(0, 59))

                    # Time-based pattern
                    if 7 <= hour <= 10 or 17 <= hour <= 20:
                        base = 65 + random.uniform(-15, 20)
                    elif 11 <= hour <= 16:
                        base = 45 + random.uniform(-15, 15)
                    else:
                        base = 25 + random.uniform(-10, 15)

                    # Train popularity adjustment
                    base *= train.base_popularity if train.base_popularity else 0.7
                    level = max(5, min(98, base))

                    crowd_entries.append(CrowdData(
                        train_id=train.train_id,
                        timestamp=ts,
                        crowd_level=round(level, 1),
                        source=CrowdSource.system,
                    ))

        db.add_all(crowd_entries)
        db.commit()
        print(f"[OK] Seeded {len(crowd_entries)} crowd data entries (30 days x {len(trains)} trains)")
    else:
        print("[INFO] Crowd data already populated, skipping.")

    db.close()
    print("\nDatabase seeding complete!")


if __name__ == "__main__":
    seed_db()
