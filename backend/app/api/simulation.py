import os
import csv
import random
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Any, Dict

router = APIRouter()

class SimulationRequest(BaseModel):
    scenario: str
    period: str
    parameter: Optional[float] = None

class DataPoint(BaseModel):
    id: int
    primary: int
    hosp: int
    vaccine: int
    policy: int

MOCK_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "mock_data")

from app.services.predictive_models import PredictiveModelEngine

@router.post("/run")
def run_simulation(request: SimulationRequest):
    scenario = request.scenario
    period_str = request.period # '7 Days', '30 Days', etc.
    param = request.parameter
    
    if scenario == "flood":
        results = PredictiveModelEngine.run_flood_simulation(period_str, param)
    elif scenario == "disease":
        results = PredictiveModelEngine.run_disease_simulation(period_str, param)
    elif scenario == "power":
        results = PredictiveModelEngine.run_power_simulation(period_str, param)
    elif scenario == "weather":
        results = PredictiveModelEngine.run_weather_simulation(period_str, param)
    elif scenario == "traffic":
        results = PredictiveModelEngine.run_traffic_simulation(period_str, param)
    elif scenario == "population":
        results = PredictiveModelEngine.run_population_simulation(period_str, param)
    else:

        results = {
            "trajectory": [
                {"id": i, "primary": 100 * i, "hosp": 10 * i, "vaccine": 5 * i, "policy": i}
                for i in range(1, 8)
            ],
            "pipeline_steps": {}
        }

    return results
