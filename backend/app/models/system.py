import datetime
import uuid
from sqlalchemy import Column, String, Float, Integer, DateTime, Text, JSON
from app.database.connection import Base

class TelemetrySnapshot(Base):
    __tablename__ = "telemetry_snapshots"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    source = Column(String(50), default="LiveAPI")
    rainfall_mm = Column(Float, default=0.0)
    temperature_c = Column(Float, default=25.0)
    humidity_pct = Column(Float, default=70.0)
    river_gauge_m = Column(Float, default=5.0)
    aqi_index = Column(Float, default=65.0)
    dam_discharge_cusecs = Column(Float, default=5000.0)
    power_load_mw = Column(Float, default=8500.0)
    traffic_index = Column(Float, default=5.5)

class MLModelRegistry(Base):
    __tablename__ = "ml_model_registries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    model_name = Column(String(100), index=True)
    model_type = Column(String(50))  # RandomForest, XGBoost, Ridge
    trained_at = Column(DateTime, default=datetime.datetime.utcnow)
    accuracy_score = Column(Float, default=0.92)
    r2_score = Column(Float, default=0.88)
    feature_importances = Column(JSON, default=dict)
    hyperparameters = Column(JSON, default=dict)

class PredictionAudit(Base):
    __tablename__ = "prediction_audits"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    disaster_type = Column(String(50))
    probability_score = Column(Float)
    confidence_score = Column(Float)
    input_features = Column(JSON)
    shap_attributions = Column(JSON)
    affected_nodes = Column(JSON)
    recommendations = Column(JSON)
