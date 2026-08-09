// @ts-nocheck
import { useState } from 'react';
import { BrainCircuit, Info, Server, Database, Cpu, Activity, CheckCircle2, Play, Check, Loader2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';

interface Props {
  activeScenario: string;
  simulationStep: number;
  simulationData?: any[] | null;
  pipelinePayload?: any | null;
}

export default function SimulationXAI({ activeScenario, simulationStep, simulationData, pipelinePayload }: Props) {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const { addToast } = useToast();

  const steps = pipelinePayload || getDefaultPipelinePayload(activeScenario);

  const step1Data = steps.step1_live_telemetry || [];
  const step2Data = steps.step2_historical_benchmarks || [];
  const step3Data = steps.step3_ml_model || {};
  const step4Data = steps.step4_digital_twin || {};
  const step5Data = steps.step5_ai_recommendations || {};

  const handleApplyRecommendations = async () => {
    if (applying || applied) return;
    setApplying(true);

    try {
      await api.post('/policies/apply', { scenario: activeScenario, actions: step5Data.prescriptive_actions });
    } catch (err) {
      // Fallback response for offline API
    }

    setTimeout(() => {
      setApplying(false);
      setApplied(true);
      const scenarioTitleMap: Record<string, string> = {
        flood: 'Flood Outflow Mitigation',
        disease: 'Epidemic Outbreak Containment',
        power: 'Grid Overload Emergency Dispatch',
        weather: 'Extreme Storm & Coastal Surge Relief',
        traffic: 'Smart Evacuation & Traffic Routing',
        population: 'Urban Infrastructure Expansion'
      };
      const title = scenarioTitleMap[activeScenario] || 'AI Recommendation Plan';
      addToast(`Applied ${title} Action Plan to Digital Twin!`, 'success');
    }, 800);
  };

  return (
    <div className="glass-card flex-1 flex flex-col relative overflow-hidden max-h-[600px]">
      <div className="absolute top-0 right-0 p-4">
        <BrainCircuit className="w-5 h-5 text-accentPurple opacity-50" />
      </div>
      
      <div className="mb-4 relative z-10">
        <h3 className="text-white font-poppins font-medium flex items-center gap-2">
          5-Step AI Inference Engine
          <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded">
            PIPELINE ACTIVE
          </span>
          <Info className="w-3 h-3 text-gray-500" />
        </h3>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Live Telemetry ➔ Historical Benchmark ➔ ML Ensemble ➔ Digital Twin ➔ AI Recommendation</p>
      </div>

      {simulationStep === -1 ? (
        <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
          <span className="text-xs text-gray-500 font-mono tracking-widest animate-pulse">AWAITING RUN...</span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 relative z-10 text-xs">
          
          {/* STEP 1: COLLECT LIVE DATA */}
          <div className="bg-black/40 p-3 rounded-xl border border-emerald-500/30">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5 font-mono">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                Step 1: Collect Live Data
              </span>
              <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
                PRAGMA AUTO-FETCH
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {step1Data.map((item, idx) => (
                <div key={idx} className="bg-black/50 p-1.5 rounded border border-white/5 flex justify-between items-center">
                  <span className="text-gray-400">{item.label}:</span>
                  <span className="font-mono font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: LOAD HISTORICAL DATA */}
          <div className="bg-black/40 p-3 rounded-xl border border-blue-500/30">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-blue-400 text-xs flex items-center gap-1.5 font-mono">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                Step 2: Load Historical Data
              </span>
              <span className="text-[9px] font-mono text-blue-300 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-500/20">
                PATTERN BENCHMARKS
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="py-1">Year</th>
                    <th className="py-1">Rainfall/Load</th>
                    <th className="py-1">Level/Cases</th>
                    <th className="py-1 text-right">Event Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {step2Data.map((row, idx) => (
                    <tr key={idx} className="text-gray-300">
                      <td className="py-1 font-bold text-white">{row.year}</td>
                      <td className="py-1 text-gray-300">{row.rainfall}</td>
                      <td className="py-1 text-gray-300">{row.level}</td>
                      <td className="py-1 text-right font-bold text-amber-400">{row.flooded}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* STEP 3: AI MODEL ENSEMBLE */}
          <div className="bg-black/40 p-3 rounded-xl border border-purple-500/30">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-purple-400 text-xs flex items-center gap-1.5 font-mono">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                Step 3: AI Model Execution
              </span>
              <span className="text-[11px] font-mono font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded animate-pulse">
                Risk Output = {step3Data.probability_score || 87}%
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {(step3Data.models || ["XGBoost", "Random Forest", "LSTM (time-series)", "LightGBM"]).map((m, idx) => (
                <span key={idx} className="text-[9px] font-mono bg-purple-950/80 text-purple-200 border border-purple-500/30 px-2 py-0.5 rounded">
                  {m}
                </span>
              ))}
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] text-gray-400 font-mono">Feature Importances:</div>
              {(step3Data.features || []).map((feat, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-300">{feat.name}</span>
                  <span className="font-mono text-purple-300 font-bold">{feat.importance}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 4: DIGITAL TWIN SIMULATION */}
          <div className="bg-black/40 p-3 rounded-xl border border-cyan-500/30">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-cyan-400 text-xs flex items-center gap-1.5 font-mono">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Step 4: Digital Twin Simulation
              </span>
              <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/20">
                SPATIAL FLOW
              </span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed mb-2">
              {step4Data.spatial_summary}
            </p>
            <div className="flex flex-wrap gap-1">
              {(step4Data.affected_nodes || []).map((node, idx) => (
                <span key={idx} className="text-[9px] font-mono bg-cyan-950/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
                  ⚡ {node}
                </span>
              ))}
            </div>
          </div>

          {/* STEP 5: AI RECOMMENDATION */}
          <div className="bg-black/40 p-3 rounded-xl border border-amber-500/40">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-amber-400 text-xs flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                Step 5: Prescriptive AI Recommendation
              </span>
              <span className="text-[9px] font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                ACTION PLAN ACTIVE
              </span>
            </div>

            <div className="p-2.5 bg-black/60 rounded-lg border border-amber-500/20 text-[11px] text-gray-200 leading-relaxed italic mb-3">
              "{step5Data.narrative}"
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono">
                Recommended Actions:
              </div>
              {(step5Data.prescriptive_actions || []).map((act, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-white bg-amber-950/20 p-1.5 rounded border border-amber-500/20">
                  <span className="text-amber-400 font-bold font-mono">{idx + 1}.</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleApplyRecommendations}
              disabled={applying || applied}
              className={`w-full text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                applied
                  ? 'bg-success/20 text-success border border-success/40'
                  : 'bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
              }`}
            >
              {applying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Executing Action Plan...
                </>
              ) : applied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-success" /> AI Recommendation Applied to Simulation
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Execute AI Recommendation Plan
                </>
              )}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

function getDefaultPipelinePayload(scenario: string) {
  if (scenario === 'disease') {
    return {
      step1_live_telemetry: [
        { label: "Active Infections", value: "12,400" },
        { label: "Transmission (R0)", value: "2.4" },
        { label: "ICU Occupancy", value: "84%" },
        { label: "Vaccine Reserves", value: "15,000" },
        { label: "Hospital Inflow", value: "+1,250/day" },
        { label: "Contact Tracing", value: "62%" }
      ],
      step2_historical_benchmarks: [
        { year: "2019", rainfall: "Dengue Outbreak", level: "8,200 cases", flooded: "Yes (High ICU)" },
        { year: "2021", rainfall: "Covid Wave", level: "14,500 cases", flooded: "Yes (Bed Saturation)" },
        { year: "2023", rainfall: "Flu Baseline", level: "2,100 cases", flooded: "No (Manageable)" }
      ],
      step3_ml_model: {
        models: ["SIR-LSTM Hybrid", "XGBoost Epidemic", "Random Forest", "LightGBM"],
        features: [
          { name: "Transmission Rate (R0)", importance: "45%" },
          { name: "Population Vulnerability", importance: "25%" },
          { name: "Hospital Bed Occupancy", importance: "15%" },
          { name: "Vaccine Coverage", importance: "10%" }
        ],
        probability_score: 91,
        risk_label: "Critical Epidemic Outbreak Surge Risk"
      },
      step4_digital_twin: {
        spatial_summary: "Simulating viral vector propagation, field hospital triage capacity, isolation ward saturation, and pharmaceutical supply logistics.",
        affected_nodes: ["General Hospital Triage Center", "Central Response Unit", "Regional Quarantine Facility"]
      },
      step5_ai_recommendations: {
        narrative: "Active viral infections have escalated to 12,400 cases with a transmission R0 rate of 2.4. Euler integration of the SIR differential model indicates an estimated 91% probability of hospital bed saturation within 5 days.",
        prescriptive_actions: [
          "Implement localized containment restrictions in high-density hotspot zones.",
          "Divert non-critical emergency admissions to temporary field medical camps.",
          "Deploy 15,000 emergency vaccine doses to high-risk demographic hubs.",
          "Enforce mandatory public mask protocols and restrict indoor gatherings."
        ]
      }
    };
  }

  if (scenario === 'power') {
    return {
      step1_live_telemetry: [
        { label: "Peak Power Load", value: "9,420 MW" },
        { label: "Grid Frequency", value: "49.8 Hz" },
        { label: "Transformer Temp", value: "84°C" },
        { label: "A/C Cooling Demand", value: "+35%" },
        { label: "Gen Capacity", value: "10,000 MW" },
        { label: "Backup Units", value: "12 Active" }
      ],
      step2_historical_benchmarks: [
        { year: "2012", rainfall: "Regional Blackout", level: "11,200 MW", flooded: "Yes (Grid Collapse)" },
        { year: "2019", rainfall: "Summer Heatwave", level: "9,800 MW", flooded: "Yes (Partial Shedding)" },
        { year: "2022", rainfall: "Normal Operations", level: "7,200 MW", flooded: "No (Stable Grid)" }
      ],
      step3_ml_model: {
        models: ["XGBoost Thermal Dispatch", "Random Forest", "Thermal LSTM", "LightGBM"],
        features: [
          { name: "Ambient Temp Thermal Load", importance: "52%" },
          { name: "Transformer Thermal Stress", importance: "22%" },
          { name: "Industrial Consumption", importance: "14%" },
          { name: "Grid Frequency Variance", importance: "8%" }
        ],
        probability_score: 84,
        risk_label: "High Grid Overload & Blackout Risk"
      },
      step4_digital_twin: {
        spatial_summary: "Simulating power grid thermal dispatch flow, substation load shedding, transformer cooling capacity, and hospital back-up generator activation.",
        affected_nodes: ["North Chennai Thermal Station", "IT Corridor Substation", "Sector 4 Transformer Hub"]
      },
      step5_ai_recommendations: {
        narrative: "Extreme non-linear thermal cooling load has driven grid demand to 9,420 MW, causing grid frequency to drift down to 49.8 Hz. Based on historical blackouts (2012, 2019), there is an estimated 84% probability of rolling cascade failures in non-critical sectors.",
        prescriptive_actions: [
          "Engage peaking emergency backup generators at North Chennai Thermal Station.",
          "Initiate controlled 30-minute rolling load shedding in Sector 4 non-critical circuits.",
          "Reroute direct dedicated power lines to regional hospitals and emergency triage centers.",
          "Issue immediate load reduction advisories to high-demand industrial manufacturing plants."
        ]
      }
    };
  }

  if (scenario === 'weather') {
    return {
      step1_live_telemetry: [
        { label: "Wind Gust Velocity", value: "135 km/h" },
        { label: "Barometric Pressure", value: "972 hPa" },
        { label: "Storm Surge Height", value: "3.4 m" },
        { label: "Hourly Rainfall", value: "65 mm/h" },
        { label: "AQI Index", value: "110" },
        { label: "Coastal Tides", value: "High Tide (+2.1m)" }
      ],
      step2_historical_benchmarks: [
        { year: "2016", rainfall: "Cyclone Vardah", level: "130 km/h wind", flooded: "Yes (Severe Storm Damage)" },
        { year: "2020", rainfall: "Cyclone Nivar", level: "110 km/h wind", flooded: "Yes (Storm Surge Inundation)" },
        { year: "2023", rainfall: "Cyclone Michaung", level: "120 km/h wind", flooded: "Yes (Severe Urban Inundation)" }
      ],
      step3_ml_model: {
        models: ["WRF Atmospheric Model", "XGBoost Storm Surge Regressor", "Random Forest Wind Predictor"],
        features: [
          { name: "Central Barometric Pressure Drop", importance: "46%" },
          { name: "Max Sustained Wind Speed", importance: "28%" },
          { name: "Coastal High Tide Timing", importance: "16%" },
          { name: "Sea Surface Temperature", importance: "10%" }
        ],
        probability_score: 94,
        risk_label: "Severe Cyclone & Storm Surge Inundation Risk"
      },
      step4_digital_twin: {
        spatial_summary: "Simulating storm surge wave action along Ennore Port, wind structural stress on overhead grids, and emergency coastal evacuee routing.",
        affected_nodes: ["IMD Doppler Radar Station", "Ennore Port Sea Wall", "Marina Beach Relief Hub"]
      },
      step5_ai_recommendations: {
        narrative: "Super cyclone weather tracking indicates sustained winds of 135 km/h and barometric pressure of 972 hPa. XGBoost Hydro-Atmospheric ensembles predict a 94% risk of severe coastal storm surge breaching sea walls within 6 hours.",
        prescriptive_actions: [
          "Mandate immediate level-4 coastal evacuation within 5 km of Ennore Port.",
          "Pre-position NDRF search and rescue units at Marina Beach relief hubs.",
          "De-energize coastal high-voltage transmission lines to prevent electrical shorting.",
          "Activate high-capacity storm water suction pumps along Buckingham Canal outfalls."
        ]
      }
    };
  }

  if (scenario === 'traffic') {
    return {
      step1_live_telemetry: [
        { label: "Traffic Index", value: "8.9 / 10" },
        { label: "Arterial Delay", value: "58 mins" },
        { label: "Vehicle Velocity", value: "12 km/h" },
        { label: "Evacuation Flow", value: "4,200 vehicles/hr" },
        { label: "Corridor Congestion", value: "92%" },
        { label: "Signal Latency", value: "3.5 mins" }
      ],
      step2_historical_benchmarks: [
        { year: "2015", rainfall: "Disaster Evacuation", level: "9.2 Congestion Index", flooded: "Yes (Gridlock on GST Road)" },
        { year: "2021", rainfall: "Cyclonic Traffic Surge", level: "8.1 Congestion Index", flooded: "Yes (Delay +45 mins)" }
      ],
      step3_ml_model: {
        models: ["Spatial Traffic Graph Neural Net", "RandomForest Congestion Regressor", "XGBoost Bottleneck Predictor"],
        features: [
          { name: "Vehicle Bottleneck Density", importance: "48%" },
          { name: "Signal Cycle Synchronization", importance: "26%" },
          { name: "Emergency Vehicle Corridor Clearance", importance: "16%" },
          { name: "Weather Road Visibility", importance: "10%" }
        ],
        probability_score: 89,
        risk_label: "Severe Traffic Gridlock & Evacuation Delay Risk"
      },
      step4_digital_twin: {
        spatial_summary: "Simulating vehicle flow dynamics across Kathipara Junction, Koyambedu bus terminal, and OMR expressway bypass routes.",
        affected_nodes: ["Kathipara Junction", "Koyambedu Intercity Hub", "OMR Toll Plaza"]
      },
      step5_ai_recommendations: {
        narrative: "Real-time traffic telemetry records an 8.9/10 congestion index with emergency corridor transit delays exceeding 58 minutes. Graph neural network models estimate an 89% probability of complete gridlock across GST arterial routes.",
        prescriptive_actions: [
          "Enable AI dynamic signal timing override, extending green corridors by 60s for emergency transport.",
          "Divert heavy commercial freight off Kathipara flyover onto outer ring bypass routes.",
          "Open toll barrier gates at OMR Toll Plaza for unhindered evacuation traffic.",
          "Deploy mobile traffic police strike forces to clear stalled vehicles on GST Road."
        ]
      }
    };
  }

  if (scenario === 'population') {
    return {
      step1_live_telemetry: [
        { label: "Net Urban Inflow", value: "+2.4% / yr" },
        { label: "Housing Vacancy", value: "3.2%" },
        { label: "School Occupancy", value: "98.4%" },
        { label: "Water Reserves", value: "42%" },
        { label: "Metro Population", value: "1,042,000" },
        { label: "Transit Strain", value: "89%" }
      ],
      step2_historical_benchmarks: [
        { year: "2011", rainfall: "Census Growth", level: "+1.8% Growth", flooded: "No (Low Deficit)" },
        { year: "2018", rainfall: "Tech Corridor Surge", level: "+3.1% Growth", flooded: "Yes (Severe Housing Strain)" },
        { year: "2022", rainfall: "Suburban Expansion", level: "+2.0% Growth", flooded: "No (Moderate Strain)" }
      ],
      step3_ml_model: {
        models: ["Cohort Demographic Regressor", "XGBoost", "Random Forest", "Prophet Time-Series"],
        features: [
          { name: "Net Urban Migration Rate", importance: "48%" },
          { name: "Household Purchasing Index", importance: "24%" },
          { name: "Zoning & Housing Constraints", importance: "16%" },
          { name: "School Capacity Strain", importance: "8%" }
        ],
        probability_score: 79,
        risk_label: "High Housing & Infrastructure Deficit Risk"
      },
      step4_digital_twin: {
        spatial_summary: "Simulating spatial housing demand heatmaps, municipal water pipeline throughput, public school overcrowding, and transit corridor congestion.",
        affected_nodes: ["OMR Phase 2 Urban Hub", "Tambaram High-Density District", "Sriperumbudur Growth Zone"]
      },
      step5_ai_recommendations: {
        narrative: "Net urban migration has sustained population growth at +2.4% annually, depleting housing vacancy to a critical 3.2% while school capacity reaches 98.4%. Demographic cohort models project an estimated 79% probability of severe infrastructure deficit within 12 months.",
        prescriptive_actions: [
          "Fast-track high-density mixed-use urban re-zoning approvals in OMR Phase 2.",
          "Expand water supply main distribution pipelines along suburban expansion hubs.",
          "Approve immediate construction permits for 2 new municipal secondary schools.",
          "Extend rapid public transit bus routes and add dedicated commuter lanes."
        ]
      }
    };
  }

  // DEFAULT: FLOOD
  return {
    step1_live_telemetry: [
      { label: "Rainfall", value: "145 mm" },
      { label: "Temperature", value: "29°C" },
      { label: "Humidity", value: "91%" },
      { label: "River Level", value: "7.8 m" },
      { label: "Dam Water Release", value: "14,000 cusecs" },
      { label: "Wind Speed", value: "32 km/h" }
    ],
    step2_historical_benchmarks: [
      { year: "2015", rainfall: "320 mm", level: "8.5 m", flooded: "Yes (Major Flood)" },
      { year: "2021", rainfall: "280 mm", level: "8.1 m", flooded: "Yes (Flash Flood)" },
      { year: "2023", rainfall: "140 mm", level: "6.9 m", flooded: "No (Controlled)" }
    ],
    step3_ml_model: {
      models: ["XGBoost", "Random Forest", "LSTM (time-series)", "LightGBM"],
      features: [
        { name: "Rainfall Inflow Rate", importance: "38%" },
        { name: "River Level", importance: "26%" },
        { name: "Humidity", importance: "18%" },
        { name: "Elevation & Drainage", importance: "12%" }
      ],
      probability_score: 87,
      risk_label: "Flood Risk = 87%"
    },
    step4_digital_twin: {
      spatial_summary: "Simulating water flow, drainage capacity, road flooding on NH-45, traffic disruption, and hospital accessibility.",
      affected_nodes: ["Chembarambakkam Reservoir", "NH-45 Evacuation Junction", "General Hospital"]
    },
    step5_ai_recommendations: {
      narrative: "Heavy rainfall has continued for 12 hours, the river level is above the seasonal average, and drainage capacity is below 50%. Based on similar historical events, there is an estimated 87% probability of flooding in low-lying areas within the next 8 hours.",
      prescriptive_actions: [
        "Deploy rescue teams to low-lying zones immediately",
        "Open relief camps at central community halls",
        "Close vulnerable roads and reroute traffic along NH-45",
        "Send emergency public alert notifications"
      ]
    }
  };
}
