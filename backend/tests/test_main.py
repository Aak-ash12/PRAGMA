import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.auth.security import hash_password
from app.models import User

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    admin = User(
        username="admin",
        email="admin@pragma.gov",
        hashed_password=hash_password("admin123"),
        role="Admin"
    )
    db.add(admin)
    db.commit()
    db.close()

def test_read_root():
    response = client.get("/api/v1/prediction/summary")
    assert response.status_code == 200

def test_user_login():
    response = client.post(
        "/api/v1/auth/login-json",
        json={"email": "admin@pragma.gov", "password": "admin123"}
    )
    assert response.status_code == 200
    json_data = response.json()
    assert "access_token" in json_data
    assert json_data["role"] == "Admin"

def test_simulation_run_lifecycle():
    response = client.post(
        "/api/v1/simulation/run",
        json={
            "scenario": "flood",
            "period": "7 Days"
        }
    )
    assert response.status_code == 200
    sim_data = response.json()
    assert len(sim_data) > 0
