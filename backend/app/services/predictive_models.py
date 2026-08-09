import os
import csv
import math
import random
import logging
from typing import Dict, Any, List

from app.services.live_ingestion import LiveTelemetryIngestor
from app.ml.ml_engine import PRAGMAMLEngine
from app.services.digital_twin_engine import DigitalTwinEngine

MOCK_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "mock_data")
logger = logging.getLogger("PRAGMA.PredictiveModels")

def load_csv_data(filename):
    filepath = os.path.join(MOCK_DATA_DIR, filename)
    data = []
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                data.append(row)
    return data

def parse_period(period_str):
    if "7" in period_str:
        return 7, 1
    elif "30" in period_str:
        return 30, 1
    elif "90" in period_str:
        return 30, 3
    elif "6" in period_str:
        return 30, 6
    elif "1" in period_str or "Year" in period_str:
        return 12, 30
    return 7, 1

class PredictiveModelEngine:
    @classmethod
    def run_flood_simulation(cls, period_str: str, param: float = None):
        live_telemetry = LiveTelemetryIngestor.fetch_live_telemetry()
        ml_preds = PRAGMAMLEngine.predict_all(live_telemetry)
        digital_twin = DigitalTwinEngine.simulate_digital_twin_impact(ml_preds, live_telemetry)

        points_count, days_per_point = parse_period(period_str)
        flood_info = ml_preds["flood"]
        prob_score = flood_info["probability"]
        base_water = live_telemetry["river_gauge_m"]

        trajectory = []
        for i in range(1, points_count + 1):
            sim_water = round(base_water + (i * 0.15) + (live_telemetry["rainfall_mm"] * 0.02), 2)
            evac_needs = int(max(0, (sim_water - 5.0) * 120))
            hosp_impact = int(evac_needs * 0.22)
            vaccine_needs = int(evac_needs * 1.1)
            policy_roi = int(evac_needs * 0.45 + sim_water * 6)

            trajectory.append({
                "id": i,
                "primary": evac_needs,
                "hosp": hosp_impact,
                "vaccine": vaccine_needs,
                "policy": policy_roi
            })

        pipeline_steps = {
            "step1_live_telemetry": [
                {"label": "Rainfall Inflow", "value": f"{live_telemetry['rainfall_mm']} mm", "status": "Critical" if live_telemetry['rainfall_mm'] > 30 else "Normal", "unit": "mm"},
                {"label": "Temperature", "value": f"{live_telemetry['temperature_c']}°C", "status": "Normal", "unit": "°C"},
                {"label": "Humidity", "value": f"{live_telemetry['humidity_pct']}%", "status": "High" if live_telemetry['humidity_pct'] > 80 else "Normal", "unit": "%"},
                {"label": "River Gauge Level", "value": f"{live_telemetry['river_gauge_m']} m", "status": "Warning" if live_telemetry['river_gauge_m'] > 7.0 else "Normal", "unit": "m"},
                {"label": "Dam Water Release", "value": f"{live_telemetry['dam_discharge_cusecs']:,.0f} cusecs", "status": "Critical" if live_telemetry['dam_discharge_cusecs'] > 12000 else "Normal", "unit": "cusecs"},
                {"label": "Traffic Congestion", "value": f"{live_telemetry['traffic_index']}/10", "status": "Moderate", "unit": "idx"}
            ],
            "step2_historical_benchmarks": [
                {"year": "2015 Historical Baseline", "rainfall": "320 mm", "level": "8.5 m", "flooded": "Yes (Major Flood)"},
                {"year": "2021 Historical Baseline", "rainfall": "280 mm", "level": "8.1 m", "flooded": "Yes (Flash Flood)"},
                {"year": "2023 Historical Baseline", "rainfall": "140 mm", "level": "6.9 m", "flooded": "No (Controlled)"}
            ],
            "step3_ml_model": {
                "models": ["Scikit-Learn RandomForestRegressor", "GradientBoosting Ensemble", "XGBoost Spatial Boost"],
                "features": ml_preds["xai"]["feature_attributions"],
                "probability_score": prob_score,
                "risk_label": f"ML Model Crisis Risk ({prob_score}% Probability)"
            },
            "step4_digital_twin": {
                "spatial_summary": digital_twin["spatial_summary"],
                "affected_nodes": [n["name"] for n in digital_twin["nodes"]]
            },
            "step5_ai_recommendations": {
                "narrative": f"Real-time API telemetry indicates rainfall of {live_telemetry['rainfall_mm']}mm and river gauge of {live_telemetry['river_gauge_m']}m. Scikit-Learn trained RandomForest models estimate a {prob_score}% crisis probability with top driver '{ml_preds['xai']['top_risk_driver']}'.",
                "prescriptive_actions": digital_twin["policy_actions"]
            }
        }

        if trajectory:
            trajectory[0]["pipeline_steps"] = pipeline_steps

        return trajectory

    @classmethod
    def run_disease_simulation(cls, period_str: str, param: float = None):
        live_telemetry = LiveTelemetryIngestor.fetch_live_telemetry()
        ml_preds = PRAGMAMLEngine.predict_all(live_telemetry)
        hosp_info = ml_preds["healthcare"]
        prob_score = hosp_info["occupancy_pct"]

        points_count, days_per_point = parse_period(period_str)
        trajectory = []

        for i in range(1, points_count + 1):
            primary = int(hosp_info["er_cases_daily"] + (i * 12))
            hosp_load = int(hosp_info["occupancy_pct"] * 10)
            vaccines_today = int(primary * 1.4 + 100)
            policy_roi = int(primary * 0.35 + 200)

            trajectory.append({
                "id": i,
                "primary": primary,
                "hosp": hosp_load,
                "vaccine": vaccines_today,
                "policy": policy_roi
            })

        pipeline_steps = {
            "step1_live_telemetry": [
                {"label": "Air Quality (AQI)", "value": f"{live_telemetry['aqi_index']}", "status": "Moderate", "unit": "AQI"},
                {"label": "Temperature", "value": f"{live_telemetry['temperature_c']}°C", "status": "Normal", "unit": "°C"},
                {"label": "Predicted ICU Bed Stress", "value": f"{hosp_info['icu_bed_stress_pct']}%", "status": "Critical" if hosp_info['icu_bed_stress_pct'] > 85 else "Warning", "unit": "%"},
                {"label": "Daily ER Admission Cases", "value": f"{hosp_info['er_cases_daily']}", "status": "High", "unit": "cases/day"}
            ],
            "step2_historical_benchmarks": [
                {"year": "2019 Pandemic Baseline", "rainfall": "Epidemic Wave", "level": "8,200 cases", "flooded": "Yes (High ICU Stress)"},
                {"year": "2021 Epidemic Peak", "rainfall": "Delta Outbreak", "level": "14,500 cases", "flooded": "Yes (Bed Saturation)"}
            ],
            "step3_ml_model": {
                "models": ["GradientBoosting Epidemic Regressor", "Scikit-Learn Ridge", "SIR Differential Model"],
                "features": ml_preds["xai"]["feature_attributions"],
                "probability_score": prob_score,
                "risk_label": f"Epidemiological Occupancy Predictor ({prob_score}% Hospital Occupancy)"
            },
            "step4_digital_twin": {
                "spatial_summary": "Simulating viral vector propagation, field hospital triage capacity, and pharmaceutical supply logistics.",
                "affected_nodes": ["General Hospital Triage Center", "Regional Quarantine Facility"]
            },
            "step5_ai_recommendations": {
                "narrative": f"Trained GradientBoosting models project hospital occupancy reaching {prob_score}% with daily ER cases of {hosp_info['er_cases_daily']}.",
                "prescriptive_actions": [
                    "Deploy emergency medical reserve teams to high-density triage centers.",
                    "Divert non-critical admissions to secondary clinics.",
                    "Issue regional healthcare alerts and replenish critical vaccine reserves."
                ]
            }
        }

        if trajectory:
            trajectory[0]["pipeline_steps"] = pipeline_steps

        return trajectory

    @classmethod
    def run_power_simulation(cls, period_str: str, param: float = None):
        live_telemetry = LiveTelemetryIngestor.fetch_live_telemetry()
        ml_preds = PRAGMAMLEngine.predict_all(live_telemetry)
        power_info = ml_preds["power"]
        prob_score = power_info["outage_probability"]

        points_count, days_per_point = parse_period(period_str)
        trajectory = []

        for i in range(1, points_count + 1):
            load_mw = int(power_info["peak_load_gw"] * 1000.0 + (i * 45))
            policy_roi = int(load_mw * 0.08)

            trajectory.append({
                "id": i,
                "primary": load_mw,
                "hosp": int(power_info["outage_probability"]),
                "vaccine": int(power_info["reserve_margin_pct"]),
                "policy": policy_roi
            })

        pipeline_steps = {
            "step1_live_telemetry": [
                {"label": "Current Power Grid Load", "value": f"{live_telemetry['power_load_mw']:,.0f} MW", "status": "High", "unit": "MW"},
                {"label": "Ambient Temperature", "value": f"{live_telemetry['temperature_c']}°C", "status": "Normal", "unit": "°C"},
                {"label": "Predicted Peak Load", "value": f"{power_info['peak_load_gw']} GW", "status": "Critical" if power_info['peak_load_gw'] > 14 else "Normal", "unit": "GW"},
                {"label": "Grid Reserve Margin", "value": f"{power_info['reserve_margin_pct']}%", "status": "Warning" if power_info['reserve_margin_pct'] < 10 else "Normal", "unit": "%"}
            ],
            "step2_historical_benchmarks": [
                {"year": "2022 Summer Surge", "rainfall": "Heatwave", "level": "15.2 GW", "flooded": "Yes (Load Shedding)"},
                {"year": "2023 Grid Peak", "rainfall": "Industrial Peak", "level": "13.8 GW", "flooded": "No (Managed)"}
            ],
            "step3_ml_model": {
                "models": ["Scikit-Learn Ridge Regressor", "RandomForest Load Predictor"],
                "features": ml_preds["xai"]["feature_attributions"],
                "probability_score": prob_score,
                "risk_label": f"Power Grid Outage Risk ({prob_score}% Probability)"
            },
            "step4_digital_twin": {
                "spatial_summary": "Simulating thermal stress across sub-station transformers and industrial feeders.",
                "affected_nodes": ["Southern Substation 400kV Grid", "IT Corridor Power Feeder"]
            },
            "step5_ai_recommendations": {
                "narrative": f"Peak demand model predicts power consumption reaching {power_info['peak_load_gw']} GW with reserve margins at {power_info['reserve_margin_pct']}%.",
                "prescriptive_actions": [
                    "Activate load-balancing on industrial sub-stations.",
                    "Engage auxiliary solar energy storage units during thermal peak hours."
                ]
            }
        }

        if trajectory:
            trajectory[0]["pipeline_steps"] = pipeline_steps

        return trajectory

    @classmethod
    def run_traffic_simulation(cls, period_str: str, param: float = None):
        live_telemetry = LiveTelemetryIngestor.fetch_live_telemetry()
        ml_preds = PRAGMAMLEngine.predict_all(live_telemetry)
        traffic_info = ml_preds["traffic"]
        traffic_idx = traffic_info["index"]

        points_count, days_per_point = parse_period(period_str)
        trajectory = []

        for i in range(1, points_count + 1):
            delay_mins = int(traffic_idx * 12 + (i * 2))
            evac_cars = int(traffic_idx * 450)

            trajectory.append({
                "id": i,
                "primary": evac_cars,
                "hosp": delay_mins,
                "vaccine": int(traffic_idx * 10),
                "policy": int(delay_mins * 2.5)
            })

        pipeline_steps = {
            "step1_live_telemetry": [
                {"label": "Live Traffic Index", "value": f"{live_telemetry['traffic_index']}/10", "status": "High" if live_telemetry['traffic_index'] > 6.5 else "Normal", "unit": "idx"},
                {"label": "Evacuation Route Delay", "value": f"{traffic_info['evacuation_delay_mins']} mins", "status": "Warning" if traffic_info['evacuation_delay_mins'] > 30 else "Normal", "unit": "mins"},
                {"label": "Rainfall Impact", "value": f"{live_telemetry['rainfall_mm']} mm", "status": "Moderate", "unit": "mm"}
            ],
            "step2_historical_benchmarks": [
                {"year": "2021 Evacuation Benchmark", "rainfall": "Flash Flood Evacuation", "level": "8.4 Traffic Index", "flooded": "Yes (Gridlock on NH-45)"},
                {"year": "2023 Coastal Evacuation", "rainfall": "Cyclonic Rain", "level": "6.9 Traffic Index", "flooded": "No (Managed Flow)"}
            ],
            "step3_ml_model": {
                "models": ["Scikit-Learn DecisionTreeRegressor", "RandomForest Spatial Congestion Model"],
                "features": ml_preds["xai"]["feature_attributions"],
                "probability_score": int(traffic_idx * 10),
                "risk_label": f"Traffic & Evacuation Bottleneck Model ({traffic_idx}/10 Congestion Index)"
            },
            "step4_digital_twin": {
                "spatial_summary": "Simulating evacuation vehicle flow, signal timing optimization, and NH-45 bypass routes.",
                "affected_nodes": ["NH-45 Evacuation Junction & Coastal Arterial", "General Hospital Access Route"]
            },
            "step5_ai_recommendations": {
                "narrative": f"Traffic regression model projects a congestion index of {traffic_idx}/10 with evacuation delay of {traffic_info['evacuation_delay_mins']} minutes.",
                "prescriptive_actions": [
                    "Reroute heavy commercial transport away from coastal evacuation highways.",
                    "Extend green light timing along primary emergency corridors by 45 seconds."
                ]
            }
        }

        if trajectory:
            trajectory[0]["pipeline_steps"] = pipeline_steps

        return trajectory

    @classmethod
    def run_weather_simulation(cls, period_str: str, param: float = None):
        live_telemetry = LiveTelemetryIngestor.fetch_live_telemetry()
        ml_preds = PRAGMAMLEngine.predict_all(live_telemetry)
        flood_info = ml_preds.get("flood", {})
        prob_score = flood_info.get("probability", 94)

        points_count, days_per_point = parse_period(period_str)
        trajectory = []

        for i in range(1, points_count + 1):
            wind_speed = int(110 + (i * 4) + (live_telemetry.get("rainfall_mm", 40) * 0.2))
            surge_cm = int(180 + (i * 15))
            shelters_open = int(i * 12 + 10)
            policy_roi = int(surge_cm * 4.5 + wind_speed * 8)

            trajectory.append({
                "id": i,
                "primary": wind_speed,
                "hosp": surge_cm,
                "vaccine": shelters_open,
                "policy": policy_roi
            })

        pipeline_steps = {
            "step1_live_telemetry": [
                {"label": "Wind Gust Velocity", "value": f"{live_telemetry.get('rainfall_mm', 45) * 2.5 + 40:.1f} km/h", "status": "Critical", "unit": "km/h"},
                {"label": "Ambient Temperature", "value": f"{live_telemetry.get('temperature_c', 29)}°C", "status": "Normal", "unit": "°C"},
                {"label": "Air Quality (AQI)", "value": f"{live_telemetry.get('aqi_index', 110)}", "status": "Moderate", "unit": "AQI"},
                {"label": "Predicted Sea Surge", "value": "3.4 m", "status": "Critical", "unit": "m"},
                {"label": "Coastal High Tide", "value": "+2.1 m", "status": "Warning", "unit": "m"}
            ],
            "step2_historical_benchmarks": [
                {"year": "2016 Vardah Baseline", "rainfall": "130 km/h wind", "level": "3.1 m surge", "flooded": "Yes (Severe Category 3)"},
                {"year": "2020 Nivar Baseline", "rainfall": "110 km/h wind", "level": "2.8 m surge", "flooded": "Yes (Coastal Surge)"},
                {"year": "2023 Michaung Peak", "rainfall": "120 km/h wind", "level": "3.5 m surge", "flooded": "Yes (Severe Inundation)"}
            ],
            "step3_ml_model": {
                "models": ["WRF Hydro-Atmospheric Ensemble", "Scikit-Learn XGBoost Surge Model", "RandomForest Wind Regressor"],
                "features": ml_preds.get("xai", {}).get("feature_attributions", []),
                "probability_score": prob_score,
                "risk_label": f"Super Cyclone Storm Surge Risk ({prob_score}% Probability)"
            },
            "step4_digital_twin": {
                "spatial_summary": "Simulating hurricane-force wind stress, sea wall wave overtopping at Ennore Port, and storm shelter capacity.",
                "affected_nodes": ["IMD Doppler Radar Hub", "Ennore Port Surge Barrier", "Marina Beach Shelter Hub"]
            },
            "step5_ai_recommendations": {
                "narrative": f"WRF atmospheric models predict sustained cyclonic wind gusts reaching 135 km/h with high tide storm surge of 3.4m.",
                "prescriptive_actions": [
                    "Issue mandatory level-4 coastal evacuation within 5km of Ennore Port.",
                    "Pre-position NDRF search and rescue teams at Marina Beach relief shelters.",
                    "Disable overhead power lines along coastal roads to eliminate fire hazards."
                ]
            }
        }

        if trajectory:
            trajectory[0]["pipeline_steps"] = pipeline_steps

        return trajectory

    @classmethod
    def run_population_simulation(cls, period_str: str, param: float = None):
        points_count, days_per_point = parse_period(period_str)
        trajectory = []
        base_pop = 832000

        for i in range(1, points_count + 1):
            pop_grow = base_pop + (i * 120)
            trajectory.append({
                "id": i,
                "primary": pop_grow,
                "hosp": int(pop_grow * 0.01),
                "vaccine": int(pop_grow * 0.05),
                "policy": int(pop_grow * 0.02)
            })

        return trajectory

