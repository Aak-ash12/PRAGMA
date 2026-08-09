from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any, Dict

router = APIRouter()

class PolicyItem(BaseModel):
    id: int
    title: str
    category: str
    priority: str
    estimated_cost: Optional[float] = None
    expected_benefit: Optional[str] = None
    reason: Optional[str] = None

class ActionRequest(BaseModel):
    policy_id: Optional[int] = None
    scenario: Optional[str] = None
    actions: Optional[List[str]] = None

class ModifyRequest(BaseModel):
    policy_id: int
    cost: float
    priority: str
    target_zone: Optional[str] = None

MOCK_POLICIES = [
    {
        "id": 1,
        "title": "Increase Healthcare Emergency ICU Reserve Budget by 14%",
        "category": "Healthcare & Outbreak",
        "priority": "Critical",
        "estimated_cost": 250.0,
        "expected_benefit": "Prevents 15% ICU overflow across regional triage centers.",
        "reason": "SIR epidemiological calculation indicates epidemic wave peak in 14 days."
    },
    {
        "id": 2,
        "title": "Deploy Dynamic Storm Outfall Suction Pumps at Buckingham Canal",
        "category": "Disaster Prevention",
        "priority": "Critical",
        "estimated_cost": 180.0,
        "expected_benefit": "Reduces coastal surge inundation risk by 42%.",
        "reason": "Hydro-runoff model predicts 87% flood risk probability in Velachery low-lying zone."
    },
    {
        "id": 3,
        "title": "Activate Peaking Solar & Hydro Backup at Thermal Stations",
        "category": "Utilities & Power Grid",
        "priority": "High",
        "estimated_cost": 120.0,
        "expected_benefit": "Saves 1,420 MW peak cooling demand & prevents cascading grid load shedding.",
        "reason": "Grid frequency drift down to 49.8 Hz during extreme ambient heatwave surge."
    },
    {
        "id": 4,
        "title": "Enable AI Dynamic Signal Timing Override on GST Evacuation Corridor",
        "category": "Traffic & Transit",
        "priority": "High",
        "estimated_cost": 45.0,
        "expected_benefit": "Cuts emergency response transit delay from 58 mins to 18 mins.",
        "reason": "Graph neural network traffic model predicts 89% gridlock index at Kathipara Junction."
    },
    {
        "id": 5,
        "title": "Approve Fast-Track High-Density Rezoning Permits in OMR Phase 2",
        "category": "Housing & Urbaning",
        "priority": "Medium",
        "estimated_cost": 320.0,
        "expected_benefit": "Adds 14,000 affordable worker housing units near IT & industrial hubs.",
        "reason": "Demographic cohort migration projections indicate 98.4% housing saturation."
    },
    {
        "id": 6,
        "title": "Issue Level-4 Red Alert & Level-5 Coastal Evacuation for Ennore Belt",
        "category": "Severe Weather",
        "priority": "Critical",
        "estimated_cost": 95.0,
        "expected_benefit": "Safely evacuates 12,500 residents within 5km of cyclone landfall zone.",
        "reason": "WRF atmospheric model forecasts 135 km/h winds and 3.4m storm surge height."
    }
]

@router.get("")
@router.get("/")
def get_policies():
    return MOCK_POLICIES

@router.post("/approve")
def approve_policy(req: ActionRequest):
    return {
        "status": "approved",
        "message": f"Policy {req.policy_id} approved and dispatched to governance engine.",
        "score_delta": +4.0
    }

@router.post("/reject")
def reject_policy(req: ActionRequest):
    return {
        "status": "rejected",
        "message": f"Policy {req.policy_id} rejected.",
        "score_delta": 0.0
    }

@router.post("/modify")
def modify_policy(req: ModifyRequest):
    new_savings = round(req.cost * 3.4, 1)
    new_confidence = min(99.0, round(92.0 + (req.cost * 0.02), 1))
    return {
        "status": "modified",
        "policy_id": req.policy_id,
        "updated_cost": f"₹{req.cost} Cr",
        "updated_savings": f"₹{new_savings} Cr",
        "updated_confidence": f"{new_confidence}%",
        "priority": req.priority
    }

@router.post("/apply")
def apply_policy(req: ActionRequest):
    return {
        "status": "applied",
        "message": f"Applied policy action plan for scenario '{req.scenario}' to Digital Twin.",
        "applied_actions": req.actions or []
    }
