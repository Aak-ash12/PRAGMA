import os
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal, engine, Base
from app.models import User, Role, District, Dataset, AIAgent
from app.auth.security import get_password_hash

def seed_data():
    print("Creating tables with UUIDs...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    print("Seeding Roles...")
    roles = [
        Role(name="Administrator", description="Full system access"),
        Role(name="Government Official", description="View reports and approve policies"),
        Role(name="Analyst", description="Run simulations and train models")
    ]
    db.add_all(roles)
    db.commit()
    
    admin_role = db.query(Role).filter_by(name="Administrator").first()
    official_role = db.query(Role).filter_by(name="Government Official").first()
    analyst_role = db.query(Role).filter_by(name="Analyst").first()

    print("Seeding Users...")
    users = [
        User(username="admin", email="admin@pragma.gov.in", hashed_password=get_password_hash("admin123"), role_id=admin_role.id, department="IT Operations"),
        User(username="analyst_priya", email="priya.v@pragma.gov.in", hashed_password=get_password_hash("analyst123"), role_id=analyst_role.id, department="Health Dept"),
        User(username="official_rajesh", email="rajesh.s@pragma.gov.in", hashed_password=get_password_hash("gov123"), role_id=official_role.id, department="Finance")
    ]
    db.add_all(users)
    
    print("Seeding Districts...")
    districts = [
        District(name="Chennai", area_sq_km=426.0, population=14200000, risk_level="Critical", officer_in_charge="Meena K."),
        District(name="Coimbatore", area_sq_km=246.7, population=4500000, risk_level="High", officer_in_charge="Rajesh S."),
        District(name="Madurai", area_sq_km=147.9, population=3800000, risk_level="Moderate", officer_in_charge="Priya V.")
    ]
    db.add_all(districts)
    db.commit()
    
    print("Seeding AI Agents...")
    agents = [
        AIAgent(name="Healthcare Agent", agent_type="Healthcare", status="Active"),
        AIAgent(name="Traffic Agent", agent_type="Traffic", status="Active"),
        AIAgent(name="Policy Agent", agent_type="Policy", status="Processing")
    ]
    db.add_all(agents)
    db.commit()

    print("Seed data injected successfully!")
    db.close()

if __name__ == "__main__":
    seed_data()
