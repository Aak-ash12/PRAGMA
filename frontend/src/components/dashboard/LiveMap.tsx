import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Navigation, Activity, X, Filter, Layers } from 'lucide-react';

export interface MapDistrict {
  id: number;
  name: string;
  x: number; // SVG percentage X
  y: number; // SVG percentage Y
  risk: 'High' | 'Medium' | 'Low';
  initialColor: string;
  problem: string;
  telemetry: string;
  solution: string;
  deployedMsg: string;
  isHub?: boolean;
}

export const initialMapDistricts: MapDistrict[] = [
  {
    "id": 1,
    "name": "Chennai",
    "x": 81.2,
    "y": 18.9,
    "risk": "High",
    "initialColor": "#EF4444",
    "problem": "ICU Bed Overload (96% Full)",
    "telemetry": "Critical Infection Surge (96% ICU Occupancy)",
    "solution": "+250 ICU Beds & Surge Field Wards",
    "deployedMsg": "Mitigated: +250 ICU Beds Deployed (ICU Occupancy dropped to 28%)",
    "isHub": true
  },
  {
    "id": 2,
    "name": "Coimbatore",
    "x": 25.2,
    "y": 46.4,
    "risk": "High",
    "initialColor": "#F59E0B",
    "problem": "Water Deficit (75% Shortage)",
    "telemetry": "Water Deficit Surge (75% Deficit in Reservoirs)",
    "solution": "Emergency Water Outflow & High-Capacity Pumps",
    "deployedMsg": "Mitigated: Emergency Reservoir Water Released (+45% Flow)",
    "isHub": true
  },
  {
    "id": 3,
    "name": "Madurai",
    "x": 44.5,
    "y": 61.0,
    "risk": "High",
    "initialColor": "#EC4899",
    "problem": "Emergency Bed Surge & O2 Shortage",
    "telemetry": "Critical O2 Supply (15% Reserve Level)",
    "solution": "60 KL Express Liquid Oxygen Tankers",
    "deployedMsg": "Mitigated: 60 KL Liquid Oxygen Reserves Delivered",
    "isHub": true
  },
  {
    "id": 4,
    "name": "Salem",
    "x": 45.0,
    "y": 37.8,
    "risk": "Medium",
    "initialColor": "#3B82F6",
    "problem": "Power Grid Strain & Voltage Drop",
    "telemetry": "Peak Thermal Load (9,200 MW | 49.1 Hz)",
    "solution": "500 MW Hydro Peaking Power Dispatch",
    "deployedMsg": "Mitigated: 500 MW Peaking Power Dispatched (Grid Load 30%)",
    "isHub": true
  },
  {
    "id": 5,
    "name": "Tiruchirappalli",
    "x": 54.2,
    "y": 49.5,
    "risk": "Low",
    "initialColor": "#10B981",
    "problem": "Capacity Normal (Safe Zone)",
    "telemetry": "Stable Infrastructure (32% Occupancy)",
    "solution": "Routine State Monitoring",
    "deployedMsg": "Stable: District Capacity Normal",
    "isHub": true
  },
  {
    "id": 6,
    "name": "Ariyalur",
    "x": 61.9,
    "y": 44.8,
    "risk": "Low",
    "initialColor": "#10B981",
    "problem": "Groundwater Table Monitoring",
    "telemetry": "Aquifer Stable (Water Table Depth 18.4m)",
    "solution": "Rainwater Harvesting Infiltration Wells",
    "deployedMsg": "Stable: Recharge Wells Operating Normally",
    "isHub": false
  },
  {
    "id": 7,
    "name": "Chengalpattu",
    "x": 75.3,
    "y": 24.1,
    "risk": "High",
    "initialColor": "#EF4444",
    "problem": "IT Corridor Flash Flood Surge",
    "telemetry": "Precipitation 120mm (Drainage Flow 91%)",
    "solution": "High-Capacity Dewatering Pumps & Sluice Bypass",
    "deployedMsg": "Mitigated: 12 Dewatering Pumps Active (Water Level -0.8m)",
    "isHub": true
  },
  {
    "id": 8,
    "name": "Cuddalore",
    "x": 71.9,
    "y": 36.7,
    "risk": "High",
    "initialColor": "#EF4444",
    "problem": "Coastal Cyclone Surge & Inundation",
    "telemetry": "Storm Surge Advisory (Sea Ingress +1.6m)",
    "solution": "Coastal Sea Barriers & Evacuation Relocation",
    "deployedMsg": "Mitigated: Evacuation Completed to 24 Storm Shelters",
    "isHub": true
  },
  {
    "id": 9,
    "name": "Dharmapuri",
    "x": 45.2,
    "y": 31.6,
    "risk": "Medium",
    "initialColor": "#3B82F6",
    "problem": "Fluorosis Filtration Supply Strain",
    "telemetry": "Hogenakkal Main Feeder Pump Pressure (-24%)",
    "solution": "Auxiliary Booster Turbines Activated",
    "deployedMsg": "Mitigated: Booster Flow Restored to Nominal",
    "isHub": false
  },
  {
    "id": 10,
    "name": "Dindigul",
    "x": 42.2,
    "y": 55.1,
    "risk": "Medium",
    "initialColor": "#8B5CF6",
    "problem": "Substation Industrial Load Spikes",
    "telemetry": "Transformer Thermal Rating (88% Peak)",
    "solution": "Capacitor Banks & Smart Feeder Load Shedding",
    "deployedMsg": "Mitigated: Feeder Balancing Synchronized",
    "isHub": false
  },
  {
    "id": 11,
    "name": "Erode",
    "x": 37.8,
    "y": 42.1,
    "risk": "Low",
    "initialColor": "#10B981",
    "problem": "Cauvery River Quality Nominal",
    "telemetry": "Bhavani River Basin Turbidity 14 NTU (Clear)",
    "solution": "Continuous Spectrometric Monitoring",
    "deployedMsg": "Stable: River Water Quality Green",
    "isHub": true
  },
  {
    "id": 12,
    "name": "Kallakurichi",
    "x": 58.5,
    "y": 36.8,
    "risk": "Medium",
    "initialColor": "#F59E0B",
    "problem": "Agri Feeder Power Fluctuation",
    "telemetry": "Feeder Voltage Deviation (-18% Sag)",
    "solution": "Grid Capacitor Switching & Voltage Boost",
    "deployedMsg": "Mitigated: Voltage Stabilized to 230V Standard",
    "isHub": false
  },
  {
    "id": 13,
    "name": "Kanchipuram",
    "x": 70.8,
    "y": 22.2,
    "risk": "Medium",
    "initialColor": "#F59E0B",
    "problem": "High Pilgrim Density & Heat Strain",
    "telemetry": "Ambient Heat Index 41.2\u00b0C (Crowd 65k)",
    "solution": "Mist Cooling Corridors & ORS Hydration Booths",
    "deployedMsg": "Mitigated: 18 Cooling Stations Fully Deployed",
    "isHub": false
  },
  {
    "id": 14,
    "name": "Kanyakumari",
    "x": 34.9,
    "y": 85.5,
    "risk": "Medium",
    "initialColor": "#3B82F6",
    "problem": "Gale Force Offshore Coastal Winds",
    "telemetry": "Wind Velocity 64 km/h (Rough Sea Alert)",
    "solution": "Harbor VHF Broadcast & Lifeboat Readiness",
    "deployedMsg": "Mitigated: Coastal Trawlers Safely Berthed",
    "isHub": true
  },
  {
    "id": 15,
    "name": "Karur",
    "x": 43.8,
    "y": 48.7,
    "risk": "Medium",
    "initialColor": "#8B5CF6",
    "problem": "Industrial Grid Peaking Demand",
    "telemetry": "Substation Load Factor (84% Industrial Draw)",
    "solution": "Dynamic Load Shifting to Off-Peak Windows",
    "deployedMsg": "Mitigated: Industrial Draw Normalized",
    "isHub": false
  },
  {
    "id": 16,
    "name": "Krishnagiri",
    "x": 46.1,
    "y": 26.3,
    "risk": "Medium",
    "initialColor": "#3B82F6",
    "problem": "Industrial Corridor High Voltage Demand",
    "telemetry": "Tech Corridor Draw (+380 MW Peak Load)",
    "solution": "Dedicated Substation Feeder Line Reroute",
    "deployedMsg": "Mitigated: Feeder Substation Rerouted",
    "isHub": true
  },
  {
    "id": 17,
    "name": "Mayiladuthurai",
    "x": 69.9,
    "y": 45.3,
    "risk": "Medium",
    "initialColor": "#3B82F6",
    "problem": "Kollidam River Sluice Siltation",
    "telemetry": "Sluice Discharge Restricted (-35% Flow)",
    "solution": "Hydraulic Desilt Excavator Units",
    "deployedMsg": "Mitigated: Sluice Gate Flow Restored",
    "isHub": false
  },
  {
    "id": 18,
    "name": "Nagapattinam",
    "x": 74.9,
    "y": 49.8,
    "risk": "High",
    "initialColor": "#EF4444",
    "problem": "Storm Surge Wave Action Threat",
    "telemetry": "Coastal Wave Height 3.4m (Tidal Inundation)",
    "solution": "Automated Siren Alert & Cyclone Shelters Activated",
    "deployedMsg": "Mitigated: 14 Coastal Relief Shelters Manned",
    "isHub": true
  },
  {
    "id": 19,
    "name": "Namakkal",
    "x": 45.3,
    "y": 42.2,
    "risk": "Low",
    "initialColor": "#10B981",
    "problem": "Transport Corridor Nominal",
    "telemetry": "NH-44 Freight Velocity Normal (62 km/h)",
    "solution": "Standard Traffic Signal Optimization",
    "deployedMsg": "Stable: Transit Corridor Clear",
    "isHub": false
  },
  {
    "id": 20,
    "name": "Nilgiris",
    "x": 20.9,
    "y": 41.2,
    "risk": "High",
    "initialColor": "#EF4444",
    "problem": "Ghats Landslide Risk (Saturated Slopes)",
    "telemetry": "Soil Moisture Saturation (94% Critical)",
    "solution": "Heavy Earthmovers & Preemptive Road Closure",
    "deployedMsg": "Mitigated: Ghat Highway Secured & Diverted",
    "isHub": true
  },
  {
    "id": 21,
    "name": "Perambalur",
    "x": 55.7,
    "y": 43.5,
    "risk": "Low",
    "initialColor": "#10B981",
    "problem": "Rural Supply Systems Stable",
    "telemetry": "Infrastructure Buffer Level (76% Reserves)",
    "solution": "Scheduled Bi-Weekly Checkups",
    "deployedMsg": "Stable: Resource Reserves Healthy",
    "isHub": false
  },
  {
    "id": 22,
    "name": "Pudukkottai",
    "x": 55.8,
    "y": 54.9,
    "risk": "Low",
    "initialColor": "#10B981",
    "problem": "Irrigation Tank System Nominal",
    "telemetry": "Tank Live Storage (62% Mean Capacity)",
    "solution": "Rotational Sluice Gate Control",
    "deployedMsg": "Stable: Irrigation Level Nominal",
    "isHub": false
  },
  {
    "id": 23,
    "name": "Ramanathapuram",
    "x": 56.5,
    "y": 68.5,
    "risk": "High",
    "initialColor": "#F59E0B",
    "problem": "Coastal Aridity & Drinking Water Shortage",
    "telemetry": "Desalination Output Drop (-45% Supply)",
    "solution": "Express Water Rake Trains & Mobile RO Units",
    "deployedMsg": "Mitigated: +3.5 MLD Drinking Water Distributed",
    "isHub": true
  },
  {
    "id": 24,
    "name": "Ranipet",
    "x": 66.4,
    "y": 21.0,
    "risk": "Medium",
    "initialColor": "#8B5CF6",
    "problem": "Industrial Effluent Runoff Anomaly",
    "telemetry": "River Sensor Alert: Elevated TDS (2,800 ppm)",
    "solution": "ZLD Water Neutralization Chemicals Injected",
    "deployedMsg": "Mitigated: TDS Dropped to Safe Range (<500 ppm)",
    "isHub": false
  },
  {
    "id": 25,
    "name": "Sivaganga",
    "x": 50.5,
    "y": 62.1,
    "risk": "Medium",
    "initialColor": "#F59E0B",
    "problem": "Arid Heat Index Elevation",
    "telemetry": "Heatwave Threshold (42.4\u00b0C Dry Bulb)",
    "solution": "District Cooling Centers & Emergency Tankers",
    "deployedMsg": "Mitigated: 20 Public Cooling Hubs Operational",
    "isHub": false
  },
  {
    "id": 26,
    "name": "Tenkasi",
    "x": 31.2,
    "y": 73.9,
    "risk": "Medium",
    "initialColor": "#3B82F6",
    "problem": "Courtallam Flash Torrent Runoff",
    "telemetry": "Ghat Runoff Rate (+180% Inflow Surge)",
    "solution": "Spillway Channeling & Tourist Area Evacuation",
    "deployedMsg": "Mitigated: Flash Flow Diverted into Main Reservoir",
    "isHub": false
  },
  {
    "id": 27,
    "name": "Thanjavur",
    "x": 61.4,
    "y": 49.5,
    "risk": "High",
    "initialColor": "#EF4444",
    "problem": "Grand Anicut Canal Embankment Risk",
    "telemetry": "Cauvery Flow (18,500 cusecs High Velocity)",
    "solution": "Geo-Textile Sandbagging & Regulated Diversion",
    "deployedMsg": "Mitigated: 50,000 Sandbags Deployed, Canal Reinforced",
    "isHub": true
  },
  {
    "id": 28,
    "name": "Theni",
    "x": 33.9,
    "y": 59.9,
    "risk": "Medium",
    "initialColor": "#3B82F6",
    "problem": "Mullaperiyar Inflow Surge",
    "telemetry": "Reservoir Level (140.8 ft nearing alert)",
    "solution": "Synchronized Downstream Spillway Discharge",
    "deployedMsg": "Mitigated: Controlled Discharge Maintained",
    "isHub": false
  },
  {
    "id": 29,
    "name": "Thoothukudi",
    "x": 44.8,
    "y": 76.5,
    "risk": "Medium",
    "initialColor": "#8B5CF6",
    "problem": "Port Industrial Emission Spurt",
    "telemetry": "Coastal AQI Index 178 (PM10 Spike)",
    "solution": "Anti-Smog Cannons & Dry Fog Dust Suppression",
    "deployedMsg": "Mitigated: Smog Cannons Active (AQI down to 72)",
    "isHub": true
  },
  {
    "id": 30,
    "name": "Tirunelveli",
    "x": 38.5,
    "y": 77.1,
    "risk": "Low",
    "initialColor": "#10B981",
    "problem": "Clean Energy Grid Nominal",
    "telemetry": "Wind Farm Generation (+220 MW Stable)",
    "solution": "Battery Energy Storage Balancing",
    "deployedMsg": "Stable: Grid Synchronized with Storage",
    "isHub": true
  },
  {
    "id": 31,
    "name": "Tirupathur",
    "x": 52.0,
    "y": 26.7,
    "risk": "Low",
    "initialColor": "#10B981",
    "problem": "Highland Buffer Nominal",
    "telemetry": "Telemetry Stations Operating at 100% Signal",
    "solution": "Routine Forest Sensor Telemetry Checks",
    "deployedMsg": "Stable: No Anomalies Detected",
    "isHub": false
  },
  {
    "id": 32,
    "name": "Tiruppur",
    "x": 31.6,
    "y": 45.2,
    "risk": "Medium",
    "initialColor": "#F59E0B",
    "problem": "Textile Hub Effluent Buffer Stress",
    "telemetry": "CETP Treatment Capacity (86% Peak)",
    "solution": "Secondary Polishing Stage Activated",
    "deployedMsg": "Mitigated: Sludge Neutralized & Water Recycled",
    "isHub": false
  },
  {
    "id": 33,
    "name": "Tiruvallur",
    "x": 72.2,
    "y": 18.1,
    "risk": "Low",
    "initialColor": "#10B981",
    "problem": "Industrial Energy Pipeline Nominal",
    "telemetry": "Gas Grid Pressure 62 Bar (Stable)",
    "solution": "Routine SCADA Acoustic Leak Audits",
    "deployedMsg": "Stable: Infrastructure Operating at Normal",
    "isHub": true
  },
  {
    "id": 34,
    "name": "Tiruvannamalai",
    "x": 60.4,
    "y": 30.3,
    "risk": "High",
    "initialColor": "#EF4444",
    "problem": "Girivalam Pilgrim Corridor Surge",
    "telemetry": "Infrared Density: 52k Pilgrims/sq.km (Bottleneck)",
    "solution": "AI Autonomous Flow Barricades & Rapid Medics",
    "deployedMsg": "Mitigated: Dynamic Barricade Bypass Cleared Crowd",
    "isHub": true
  },
  {
    "id": 35,
    "name": "Tiruvarur",
    "x": 68.1,
    "y": 49.8,
    "risk": "Medium",
    "initialColor": "#3B82F6",
    "problem": "Delta Paddy Field Waterlogging",
    "telemetry": "Subsurface Moisture Index (92% Inundation)",
    "solution": "Drainage Sluice Acceleration Pumps",
    "deployedMsg": "Mitigated: Excess Runoff Pumped to Sea",
    "isHub": false
  },
  {
    "id": 36,
    "name": "Vellore",
    "x": 59.5,
    "y": 21.1,
    "risk": "High",
    "initialColor": "#EF4444",
    "problem": "Extreme Heatwave & Hospital Surge",
    "telemetry": "Dry Bulb Forecast 45.2\u00b0C (Vulnerable Heat Risk)",
    "solution": "30 Air-Conditioned Emergency Triage Centers",
    "deployedMsg": "Mitigated: 30 Heat Relief Triage Centers Manned",
    "isHub": true
  },
  {
    "id": 37,
    "name": "Viluppuram",
    "x": 67.2,
    "y": 34.1,
    "risk": "Low",
    "initialColor": "#10B981",
    "problem": "High-Speed Highway Corridor Nominal",
    "telemetry": "NH-45 Average Speed (74 km/h Fluid)",
    "solution": "Automated Dynamic Speed Signage",
    "deployedMsg": "Stable: Highway Flow Smooth",
    "isHub": false
  },
  {
    "id": 38,
    "name": "Virudhunagar",
    "x": 41.9,
    "y": 65.8,
    "risk": "High",
    "initialColor": "#EC4899",
    "problem": "Pyrotechnic Storage Thermal Spike",
    "telemetry": "Warehouse Thermal Sensor: 46\u00b0C Danger Level",
    "solution": "Automated Foam Sprinklers & HAZMAT Drones",
    "deployedMsg": "Mitigated: Nitrogen Blanket Foam Injected, Temp 26\u00b0C",
    "isHub": true
  }
];

export default function LiveMap() {
  const [isDeployed, setIsDeployed] = useState(() => sessionStorage.getItem('pragma_directive_deployed') === 'true');
  const [hoveredDistrict, setHoveredDistrict] = useState<MapDistrict | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<MapDistrict | null>(null);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [showAllLabels, setShowAllLabels] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setIsDeployed(sessionStorage.getItem('pragma_directive_deployed') === 'true');
    };
    window.addEventListener('pragma_directive_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('pragma_directive_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const counts = useMemo(() => ({
    High: initialMapDistricts.filter(d => d.risk === 'High').length,
    Medium: initialMapDistricts.filter(d => d.risk === 'Medium').length,
    Low: initialMapDistricts.filter(d => d.risk === 'Low').length,
    Total: initialMapDistricts.length
  }), []);

  const handleSelectDistrict = (d: MapDistrict) => {
    setActiveDistrict(d);
    setHoveredDistrict(d);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-0 overflow-hidden min-h-[500px] md:h-[540px] relative z-0 border border-white/10 bg-[#081120] rounded-2xl flex flex-col justify-between"
    >
      {/* Top Header Banner */}
      <div className="absolute top-3 left-3 z-20 bg-black/85 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10 shadow-2xl max-w-[95%] md:max-w-[70%]">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-white font-poppins font-semibold text-xs md:text-sm flex items-center gap-2">
            Interactive GIS Risk Map - Tamil Nadu
          </h3>
          {isDeployed ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/40 font-bold uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Mitigated (Green)
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-danger/20 text-danger border border-danger/40 font-bold uppercase flex items-center gap-1 animate-pulse">
              <ShieldAlert className="w-3 h-3" /> Active Assessment
            </span>
          )}
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-mono font-bold">
            38 / 38 Districts
          </span>
        </div>
        <p className="text-[10px] text-gray-400 font-mono">Touch or click any district node to inspect issues</p>

        {/* Interactive Controls: Risk filters & quick dropdown */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-gray-400" />
            {(['All', 'High', 'Medium', 'Low'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedRiskFilter(lvl)}
                className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded-md font-mono font-bold transition-all ${
                  selectedRiskFilter === lvl 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/15 hover:text-white'
                }`}
              >
                {lvl === 'All' ? `All (${counts.Total})` : `${lvl} (${counts[lvl]})`}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAllLabels(!showAllLabels)}
            className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded-md font-mono transition-colors flex items-center gap-1 border border-white/10 ${
              showAllLabels ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
            title="Toggle showing all 38 district names simultaneously"
          >
            <Layers className="w-2.5 h-2.5" />
            {showAllLabels ? 'All Labels' : 'Hub Labels'}
          </button>

          {/* Quick Jump Dropdown */}
          <select
            value={activeDistrict?.id || ''}
            onChange={(e) => {
              const val = Number(e.target.value);
              const found = initialMapDistricts.find(d => d.id === val);
              if (found) {
                handleSelectDistrict(found);
              }
            }}
            className="bg-black/60 border border-white/15 text-white text-[10px] font-mono rounded px-1.5 py-0.5 focus:outline-none focus:border-primary cursor-pointer max-w-[130px] md:max-w-[160px]"
          >
            <option value="">Jump to District...</option>
            {initialMapDistricts.map(d => (
              <option key={d.id} value={d.id} className="bg-[#091120] text-white">
                {d.name} ({d.risk})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend overlay bottom left */}
      <div className="absolute bottom-3 left-3 z-20 bg-black/85 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-[10px] text-gray-300 flex flex-wrap items-center gap-3 max-w-[95%]">
        <span className="font-bold text-white uppercase text-[9px] flex items-center gap-1">
          <Navigation className="w-3 h-3 text-primary" /> Legend:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block shadow-[0_0_8px_#EF4444]"></span>
          <span>High Risk / Surge ({counts.High})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] inline-block shadow-[0_0_8px_#3B82F6]"></span>
          <span>Medium Risk / Warning ({counts.Medium})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block shadow-[0_0_8px_#10B981]"></span>
          <span>Safe Zone / Nominal ({counts.Low})</span>
        </div>
        {isDeployed && (
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block ring-2 ring-emerald-300"></span>
            <span>Mitigated Status Active</span>
          </div>
        )}
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#081120] via-[#0D182E] to-[#081120]">
        {/* Map Grid Pattern Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Tamil Nadu Stylized SVG State Boundary Graphic */}
        <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="tnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          {/* Tamil Nadu Real Geographic Boundary Polygon */}
          <polygon 
            points="43,23 52,18 62,15 71,11 76,11 82,14 86,18 82,26 78,36 75,44 80,51 74,56 62,58 68,70 57,75 49,80 45,86 36,92 30,88 25,75 28,62 20,53 15,43 18,36 29,35 38,29"
            fill="url(#tnGradient)" 
            stroke="rgba(59, 130, 246, 0.4)" 
            strokeWidth="0.8"
            strokeDasharray="2,2"
          />

          {/* Regional Interconnection Grid Lines */}
          <line x1="72.2" y1="18.1" x2="81.2" y2="18.9" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="81.2" y1="18.9" x2="75.3" y2="24.1" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="75.3" y1="24.1" x2="70.8" y2="22.2" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="70.8" y1="22.2" x2="66.4" y2="21.0" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="66.4" y1="21.0" x2="59.5" y2="21.1" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="59.5" y1="21.1" x2="52.0" y2="26.7" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="52.0" y1="26.7" x2="46.1" y2="26.3" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="46.1" y1="26.3" x2="45.2" y2="31.6" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="45.2" y1="31.6" x2="45.0" y2="37.8" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="45.0" y1="37.8" x2="37.8" y2="42.1" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="37.8" y1="42.1" x2="31.6" y2="45.2" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="31.6" y1="45.2" x2="25.2" y2="46.4" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="25.2" y1="46.4" x2="20.9" y2="41.2" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="45.0" y1="37.8" x2="45.3" y2="42.2" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="45.3" y1="42.2" x2="43.8" y2="48.7" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="43.8" y1="48.7" x2="54.2" y2="49.5" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="45.0" y1="37.8" x2="55.7" y2="43.5" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="55.7" y1="43.5" x2="61.9" y2="44.8" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="61.9" y1="44.8" x2="61.4" y2="49.5" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="54.2" y1="49.5" x2="61.4" y2="49.5" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="61.4" y1="49.5" x2="68.1" y2="49.8" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="68.1" y1="49.8" x2="74.9" y2="49.8" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="68.1" y1="49.8" x2="69.9" y2="45.3" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="75.3" y1="24.1" x2="67.2" y2="34.1" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="67.2" y1="34.1" x2="71.9" y2="36.7" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="71.9" y1="36.7" x2="69.9" y2="45.3" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="67.2" y1="34.1" x2="58.5" y2="36.8" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="60.4" y1="30.3" x2="58.5" y2="36.8" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="60.4" y1="30.3" x2="59.5" y2="21.1" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="54.2" y1="49.5" x2="55.8" y2="54.9" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="54.2" y1="49.5" x2="42.2" y2="55.1" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="42.2" y1="55.1" x2="44.5" y2="61.0" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="42.2" y1="55.1" x2="33.9" y2="59.9" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="44.5" y1="61.0" x2="50.5" y2="62.1" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="50.5" y1="62.1" x2="56.5" y2="68.5" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="55.8" y1="54.9" x2="56.5" y2="68.5" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="44.5" y1="61.0" x2="41.9" y2="65.8" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="41.9" y1="65.8" x2="31.2" y2="73.9" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="41.9" y1="65.8" x2="44.8" y2="76.5" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="41.9" y1="65.8" x2="38.5" y2="77.1" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="31.2" y1="73.9" x2="38.5" y2="77.1" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="38.5" y1="77.1" x2="44.8" y2="76.5" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1="38.5" y1="77.1" x2="34.9" y2="85.5" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="0.5" strokeDasharray="1,1" />
        </svg>

        {/* 38 District Radar Nodes */}
        {initialMapDistricts.map((d) => {
          const isHighMitigated = isDeployed && d.risk === 'High';
          const isMediumStabilized = isDeployed && d.risk === 'Medium';

          const markerColor = isHighMitigated 
            ? '#10B981' 
            : isMediumStabilized 
            ? '#0EA5E9' 
            : d.initialColor;

          const isSelected = activeDistrict?.id === d.id || hoveredDistrict?.id === d.id;
          const isDimmed = selectedRiskFilter !== 'All' && d.risk !== selectedRiskFilter;
          const shouldShowLabel = showAllLabels || d.isHub || isSelected;

          return (
            <div
              key={d.id}
              style={{ left: `${d.x}%`, top: `${d.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-2 group touch-manipulation transition-opacity duration-300 ${
                isDimmed ? 'opacity-25 hover:opacity-100 z-10' : 'z-30'
              } ${isSelected ? 'z-40' : ''}`}
              onClick={() => handleSelectDistrict(d)}
              onTouchStart={() => handleSelectDistrict(d)}
              onMouseEnter={() => setHoveredDistrict(d)}
              onMouseLeave={() => setHoveredDistrict(null)}
            >
              {/* Radar Pulse Ring */}
              <motion.div
                animate={{ scale: [1, 2.3, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-1 rounded-full pointer-events-none"
                style={{ backgroundColor: markerColor }}
              />

              {/* Node Circle Button */}
              <div 
                className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xl transition-all duration-300 ${
                  isSelected 
                    ? 'scale-135 ring-4 ring-white/60 shadow-[0_0_25px_rgba(255,255,255,0.8)]' 
                    : 'group-hover:scale-125'
                }`}
                style={{ backgroundColor: markerColor, boxShadow: `0 0 12px ${markerColor}` }}
              >
                <Activity className="w-2.5 h-2.5 md:w-3 md:h-3 text-black font-extrabold" />
              </div>

              {/* Node Label Pin */}
              {shouldShowLabel && (
                <div 
                  className={`absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-mono font-bold text-white shadow-lg transition-all ${
                    isSelected 
                      ? 'bg-primary border border-white scale-110 z-50 ring-2 ring-primary/40' 
                      : 'bg-black/85 border border-white/20'
                  }`}
                >
                  {d.name}
                </div>
              )}
            </div>
          );
        })}

        {/* Interactive Selected / Hover Telemetry Card Overlay */}
        <AnimatePresence>
          {(activeDistrict || hoveredDistrict) && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="absolute top-16 right-3 md:right-4 z-40 bg-[#0F172A]/95 border-2 border-primary/60 text-white rounded-2xl p-4 shadow-2xl max-w-xs w-full backdrop-blur-xl"
            >
              <button
                onClick={() => {
                  setActiveDistrict(null);
                  setHoveredDistrict(null);
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="font-bold text-sm mb-1.5 flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 pr-6">
                <span className="text-white font-poppins">
                  {(activeDistrict || hoveredDistrict)?.name} District
                </span>
                <span 
                  className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase"
                  style={{ 
                    backgroundColor: `${(isDeployed && (activeDistrict || hoveredDistrict)?.risk === 'High') ? '#10B981' : (activeDistrict || hoveredDistrict)?.initialColor}33`, 
                    color: (isDeployed && (activeDistrict || hoveredDistrict)?.risk === 'High') ? '#10B981' : (activeDistrict || hoveredDistrict)?.initialColor 
                  }}
                >
                  {(isDeployed && (activeDistrict || hoveredDistrict)?.risk === 'High') ? 'MITIGATED (GREEN)' : `${(activeDistrict || hoveredDistrict)?.risk} RISK`}
                </span>
              </div>
              
              <div className="text-xs text-amber-300 font-semibold mb-1">
                🚨 Active Problem: {(activeDistrict || hoveredDistrict)?.problem}
              </div>
              <div className="text-[11px] text-gray-300 font-mono mb-2.5 bg-black/40 p-2 rounded-lg border border-white/10">
                Telemetry: {(activeDistrict || hoveredDistrict)?.telemetry}
              </div>

              {(isDeployed && (activeDistrict || hoveredDistrict)?.risk === 'High') ? (
                <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-500/40 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Solution Deployed:
                  </div>
                  <div className="font-bold text-white text-[11px]">⚡ {(activeDistrict || hoveredDistrict)?.solution}</div>
                  <div className="text-[10px] text-emerald-200 font-mono">{(activeDistrict || hoveredDistrict)?.deployedMsg}</div>
                </div>
              ) : (
                <div className="p-2 bg-primary/10 rounded-xl border border-primary/30 text-xs text-primary">
                  <div className="font-bold uppercase text-[9px] tracking-wider mb-0.5 text-primary">Recommended Action:</div>
                  <div className="font-semibold text-white text-[11px]">⚡ {(activeDistrict || hoveredDistrict)?.solution}</div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
