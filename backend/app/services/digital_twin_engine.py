import random
from typing import Dict, Any, List

class DigitalTwinEngine:
    @staticmethod
    def simulate_digital_twin_impact(ml_predictions: Dict[str, Any], live_telemetry: Dict[str, Any]) -> Dict[str, Any]:
        flood_prob = ml_predictions["flood"]["probability"]
        hosp_occ = ml_predictions["healthcare"]["occupancy_pct"]
        power_gw = ml_predictions["power"]["peak_load_gw"]
        traffic_idx = ml_predictions["traffic"]["index"]

        # Evaluate Spatial Nodes Status
        nodes = [
            {
                "id": "node_sluice_01",
                "name": "Chembarambakkam Sluice Gate",
                "type": "Hydro Infrastructure",
                "status": "Critical Hazard" if flood_prob > 75 else ("Warning" if flood_prob > 45 else "Nominal"),
                "water_discharge": f"{live_telemetry.get('dam_discharge_cusecs', 12000):,.0f} cusecs",
                "capacity_utilization": f"{min(int(flood_prob * 1.05), 99)}%"
            },
            {
                "id": "node_hosp_02",
                "name": "General Hospital Flood Barrier & ICU Sector",
                "type": "Healthcare Node",
                "status": "Overload Risk" if hosp_occ > 80 else "Stable",
                "bed_occupancy": f"{hosp_occ}%",
                "emergency_power": "Generator Standby Active"
            },
            {
                "id": "node_road_03",
                "name": "NH-45 Evacuation Junction & Coastal Arterial",
                "type": "Transport Corridor",
                "status": "Heavy Congestion" if traffic_idx > 7.0 else "Flow Normal",
                "congestion_level": f"{traffic_idx}/10",
                "avg_speed": f"{max(int(60 - (traffic_idx * 5.0)), 10)} km/h"
            },
            {
                "id": "node_grid_04",
                "name": "Southern Substation 400kV Grid",
                "type": "Power Infrastructure",
                "status": "Thermal Stress" if power_gw > 14.0 else "Optimal",
                "load": f"{power_gw} GW",
                "headroom": f"{max(round(18.0 - power_gw, 2), 0.5)} GW"
            }
        ]

        # Generate Data-Backed Dynamic Policy Actions
        recommended_actions = []
        if flood_prob > 50:
            recommended_actions.append(f"Deploy emergency drainage pumps at Chembarambakkam Sluice Gate (Inflow: {live_telemetry.get('rainfall_mm', 30)} mm/h).")
            recommended_actions.append("Issue early evacuation warnings for low-lying riverbank sectors.")
        if hosp_occ > 70:
            recommended_actions.append(f"Mobilize secondary medical reserve units (Projected ICU Occupancy: {hosp_occ}%).")
        if power_gw > 13.5:
            recommended_actions.append("Activate industrial load shedding protocols on Southern Substation grid.")
        if traffic_idx > 6.5:
            recommended_actions.append("Reroute heavy vehicles away from NH-45 Evacuation Corridor.")

        if not recommended_actions:
            recommended_actions.append("Maintain baseline telemetry monitoring; all node parameters operating within safety thresholds.")

        return {
            "spatial_summary": f"Digital Twin active simulation running on live vector inputs (Rainfall: {live_telemetry.get('rainfall_mm')}mm, River: {live_telemetry.get('river_gauge_m')}m).",
            "nodes": nodes,
            "policy_actions": recommended_actions
        }
