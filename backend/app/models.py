"""
SQLAlchemy ORM models for RailVision database.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .database import Base


class UserRole(str, enum.Enum):
    passenger = "passenger"
    admin = "admin"
    controller = "controller"


class CrowdSource(str, enum.Enum):
    user = "user"
    system = "system"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.passenger)
    reset_token = Column(String(100), nullable=True)
    reset_expiry = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    reports = relationship("Report", back_populates="user")


class Train(Base):
    __tablename__ = "trains"

    train_id = Column(String(20), primary_key=True, index=True)
    train_name = Column(String(200), nullable=False, index=True)
    source = Column(String(10), nullable=False, index=True)
    destination = Column(String(10), nullable=False, index=True)
    departure_time = Column(DateTime)
    operating_days = Column(String(50), nullable=True)
    base_popularity = Column(Float, default=0.5)

    crowd_data = relationship("CrowdData", back_populates="train")
    predictions = relationship("Prediction", back_populates="train")
    reports = relationship("Report", back_populates="train")


class CrowdData(Base):
    __tablename__ = "crowd_data"

    id = Column(Integer, primary_key=True, index=True)
    train_id = Column(String(20), ForeignKey("trains.train_id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    crowd_level = Column(Float, nullable=False)  # 0-100 density percentage
    source = Column(Enum(CrowdSource), default=CrowdSource.system)
    station = Column(String(10), nullable=True)

    train = relationship("Train", back_populates="crowd_data")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    train_id = Column(String(20), ForeignKey("trains.train_id"))
    predicted_level = Column(Float)
    confidence = Column(Float)
    lower_bound = Column(Float, nullable=True)
    upper_bound = Column(Float, nullable=True)
    target_time = Column(DateTime)
    generated_at = Column(DateTime, default=datetime.utcnow)
    model_version = Column(String(20), nullable=True)

    train = relationship("Train", back_populates="predictions")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    train_id = Column(String(20), ForeignKey("trains.train_id"))
    station = Column(String(10), nullable=True)
    crowd_input = Column(String(20), nullable=False)  # Low, Moderate, High
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reports")
    train = relationship("Train", back_populates="reports")
