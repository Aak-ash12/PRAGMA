from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.predictive_models import PredictiveModelEngine
from app.services.live_ingestion import LiveTelemetryIngestor
from app.ml.ml_engine import PRAGMAMLEngine
from app.services.digital_twin_engine import DigitalTwinEngine

router = APIRouter()

class KPICard(BaseModel):
    title: str
    current: str
    predicted: str
    trend: str
    conf: int
    data: List[float]

class DisasterRisk(BaseModel):
    type: str
    prob: int
    conf: int
    dist: str
    action: str

class HealthcareResource(BaseModel):
    name: str
    value: int
    max: int
    fill: str

class WaterDemandAnalysis(BaseModel):
    reservoirLevel: int
    consumptionMLD: int
    consumptionChangePct: int
    scarcityIndex: float
    rainfallForecastChangePct: int

class ElectricityDemandAnalysis(BaseModel):
    loadGW: float
    capacityGW: float
    outageProbability: int
    peakTempC: float
    criticalReserveMarginPct: int

class PredictionSummaryResponse(BaseModel):
    kpis: List[KPICard]
    disasters: List[DisasterRisk]
    healthcare: List[HealthcareResource]
    water: WaterDemandAnalysis
    electricity: ElectricityDemandAnalysis
    population_chart: List[Dict[str, Any]]
    insights: List[str]

@router.get("/telemetry/live")
def get_live_telemetry():
    return LiveTelemetryIngestor.fetch_live_telemetry()

@router.get("/xai/attributions")
def get_xai_attributions():
    telemetry = LiveTelemetryIngestor.fetch_live_telemetry()
    preds = PRAGMAMLEngine.predict_all(telemetry)
    return preds["xai"]

@router.get("/digital-twin/status")
def get_digital_twin_status():
    telemetry = LiveTelemetryIngestor.fetch_live_telemetry()
    preds = PRAGMAMLEngine.predict_all(telemetry)
    return DigitalTwinEngine.simulate_digital_twin_impact(preds, telemetry)

@router.get("/summary", response_model=PredictionSummaryResponse)
def get_prediction_summary():
    live_telemetry = LiveTelemetryIngestor.fetch_live_telemetry()
    ml_preds = PRAGMAMLEngine.predict_all(live_telemetry)

    flood_res = PredictiveModelEngine.run_flood_simulation("7 Days")
    disease_res = PredictiveModelEngine.run_disease_simulation("7 Days")
    power_res = PredictiveModelEngine.run_power_simulation("7 Days")
    pop_res = PredictiveModelEngine.run_population_simulation("7 Days")

    # 1. Population Growth KPI
    pop_kpi = KPICard(
        title="Population Growth",
        current="83.2M",
        predicted=f"{83.2 + (pop_res[-1]['primary'] / 10000.0):.2f}M",
        trend="up",
        conf=95,
        data=[20 + x["primary"]*0.1 for x in pop_res]
    )

    # 2. Hospital Occupancy KPI
    hosp_occ = ml_preds["healthcare"]["occupancy_pct"]
    hosp_kpi = KPICard(
        title="Hospital Occupancy",
        current="75%",
        predicted=f"{hosp_occ}%",
        trend="up" if hosp_occ > 75 else "stable",
        conf=ml_preds["healthcare"]["confidence"],
        data=[45 + x["hosp"]*0.1 for x in disease_res]
    )

    # 3. Water Demand
    water_demand_mld = int(420 + (live_telemetry["rainfall_mm"] * 0.5))
    water_kpi = KPICard(
        title="Water Demand",
        current="420 MLD",
        predicted=f"{water_demand_mld} MLD",
        trend="up",
        conf=91,
        data=[400, 405, 410, 412, 415, 418, water_demand_mld]
    )

    # 4. Electricity Usage
    power_gw = ml_preds["power"]["peak_load_gw"]
    power_kpi = KPICard(
        title="Electricity Usage",
        current="13.5 GW",
        predicted=f"{power_gw:.1f} GW",
        trend="up" if power_gw > 13.5 else "stable",
        conf=ml_preds["power"]["confidence"],
        data=[12.0, 12.5, 13.0, 13.5, 13.8, 14.2, power_gw]
    )

    # 5. Traffic Index
    traffic_idx = ml_preds["traffic"]["index"]
    traffic_kpi = KPICard(
        title="Traffic Index",
        current="6.2",
        predicted=f"{traffic_idx:.1f}",
        trend="up" if traffic_idx > 6.2 else "down",
        conf=ml_preds["traffic"]["confidence"],
        data=[7.0, 6.8, 6.5, 6.7, 6.6, 6.4, traffic_idx]
    )

    # 6. Disaster Risk
    flood_prob = ml_preds["flood"]["probability"]
    risk_level = "High" if flood_prob > 60 else "Medium"
    disaster_kpi = KPICard(
        title="Disaster Risk",
        current="Medium",
        predicted=risk_level,
        trend="up" if risk_level == "High" else "stable",
        conf=ml_preds["flood"]["confidence"],
        data=[2, 3, 3, 4, 5, 6, 8 if risk_level == "High" else 5]
    )

    # 7. Budget Utilization
    total_roi = sum(x["policy"] for x in flood_res + disease_res + power_res)
    budget_pred = min(62 + int(total_roi / 1000.0), 98)
    budget_kpi = KPICard(
        title="Budget Utilization",
        current="62%",
        predicted=f"{budget_pred}%",
        trend="up",
        conf=95,
        data=[40, 45, 50, 55, 58, 62, budget_pred]
    )

    # 8. Governance Efficiency
    gov_score = min(92 + int(live_telemetry["temperature_c"] * 0.1), 99)
    gov_kpi = KPICard(
        title="Governance Efficiency",
        current="94/100",
        predicted=f"{gov_score}/100",
        trend="up",
        conf=89,
        data=[88, 89, 90, 92, 93, 94, gov_score]
    )

    kpis = [pop_kpi, hosp_kpi, water_kpi, power_kpi, traffic_kpi, disaster_kpi, budget_kpi, gov_kpi]

    disasters = [
        DisasterRisk(type="Flood Risk", prob=flood_prob, conf=ml_preds["flood"]["confidence"], dist="Chennai Coastal Sector", action="Deploy automated sluice gates."),
        DisasterRisk(type="Epidemic Outbreak", prob=hosp_occ, conf=ml_preds["healthcare"]["confidence"], dist="Coimbatore, Madurai", action="Enforce medical triage protocol."),
        DisasterRisk(type="Power Grid Surge", prob=ml_preds["power"]["outage_probability"], conf=ml_preds["power"]["confidence"], dist="IT Corridor Substation", action="Activate industrial load shedding."),
        DisasterRisk(type="Water Scarcity", prob=int(water_demand_mld / 6.0), conf=87, dist="Ramanathapuram", action="Initiate emergency reservoir release.")
    ]

    healthcare = [
        HealthcareResource(name="Hospital Occ.", value=hosp_occ, max=100, fill="#EF4444"),
        HealthcareResource(name="ICU Beds", value=ml_preds["healthcare"]["icu_bed_stress_pct"], max=100, fill="#F59E0B"),
        HealthcareResource(name="ER Daily Cases", value=min(ml_preds["healthcare"]["er_cases_daily"], 100), max=100, fill="#3B82F6"),
        HealthcareResource(name="Meds Stock", value=max(100 - hosp_occ, 20), max=100, fill="#10B981")
    ]

    water = WaterDemandAnalysis(
        reservoirLevel=max(75 - int(water_demand_mld / 15.0), 15),
        consumptionMLD=water_demand_mld,
        consumptionChangePct=int(((water_demand_mld - 420.0)/420.0)*100),
        scarcityIndex=round(4.0 + (water_demand_mld / 100.0), 1),
        rainfallForecastChangePct=int(live_telemetry["rainfall_mm"] * 0.2)
    )

    electricity = ElectricityDemandAnalysis(
        loadGW=power_gw,
        capacityGW=18.0,
        outageProbability=ml_preds["power"]["outage_probability"],
        peakTempC=live_telemetry["temperature_c"],
        criticalReserveMarginPct=ml_preds["power"]["reserve_margin_pct"]
    )

    population_chart = [
        {"date": "Jan", "current": 82.5, "predicted": 82.5},
        {"date": "Feb", "current": 82.6, "predicted": 82.7},
        {"date": "Mar", "current": 82.8, "predicted": 82.9},
        {"date": "Apr", "current": 82.9, "predicted": 83.2},
        {"date": "May", "current": 83.1, "predicted": 83.5},
        {"date": "Jun", "current": 83.2, "predicted": 83.8},
        {"date": "Jul", "current": None, "predicted": round(83.2 + (pop_res[-1]["primary"] / 100000.0), 2)}
    ]

    insights = [
        f"Live API Telemetry (Ingestion Source: {live_telemetry['source']}) recorded rainfall of {live_telemetry['rainfall_mm']}mm and temperature of {live_telemetry['temperature_c']}°C.",
        f"Scikit-Learn RandomForest ML Model projects a flood risk probability of {flood_prob}% with top feature driver '{ml_preds['xai']['top_risk_driver']}'.",
        f"Epidemiological ML models estimate hospital occupancy peaking at {hosp_occ}% with daily ER admissions reaching {ml_preds['healthcare']['er_cases_daily']}.",
        f"Power grid Ridge regression model predicts peak load reaching {power_gw} GW with outage probability of {ml_preds['power']['outage_probability']}%.",
        f"Digital Twin simulation recommends immediate activation of: {', '.join(DigitalTwinEngine.simulate_digital_twin_impact(ml_preds, live_telemetry)['policy_actions'][:2])}."
    ]

    return PredictionSummaryResponse(
        kpis=kpis,
        disasters=disasters,
        healthcare=healthcare,
        water=water,
        electricity=electricity,
        population_chart=population_chart,
        insights=insights
    )
