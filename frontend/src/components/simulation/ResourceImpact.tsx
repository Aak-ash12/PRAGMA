// @ts-nocheck
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const impactData = {
  flood: [
    { sector: 'Healthcare', current: 'Stable', predicted: 'Overwhelmed', risk: 'Critical', trend: 'up' },
    { sector: 'Emergency Services', current: 'Standby', predicted: 'Active', risk: 'High', trend: 'up' },
    { sector: 'Infrastructure', current: 'Normal', predicted: 'Damaged', risk: 'High', trend: 'down' },
    { sector: 'Water Resources', current: 'Adequate', predicted: 'Contaminated', risk: 'Medium', trend: 'down' },
    { sector: 'Electricity Grid', current: 'Stable', predicted: 'Stable', risk: 'Low', trend: 'flat' },
  ],
  disease: [
    { sector: 'Healthcare Capacity', current: 'Normal', predicted: 'Exceeded', risk: 'Critical', trend: 'up' },
    { sector: 'Medical Supplies', current: 'Adequate', predicted: 'Depleted', risk: 'Critical', trend: 'down' },
    { sector: 'Quarantine Facilities', current: 'None', predicted: 'Required', risk: 'High', trend: 'up' },
    { sector: 'Economy', current: 'Stable', predicted: 'Slowdown', risk: 'Medium', trend: 'down' },
    { sector: 'Public Transport', current: 'Normal', predicted: 'Restricted', risk: 'High', trend: 'down' },
  ],
  power: [
    { sector: 'Electricity Grid', current: 'Strained', predicted: 'Collapsed', risk: 'Critical', trend: 'down' },
    { sector: 'Hospitals (Backup)', current: 'Idle', predicted: 'Active', risk: 'High', trend: 'up' },
    { sector: 'Traffic Systems', current: 'Normal', predicted: 'Failed', risk: 'Critical', trend: 'down' },
    { sector: 'Communications', current: 'Stable', predicted: 'Intermittent', risk: 'High', trend: 'down' },
    { sector: 'Water Pumping', current: 'Normal', predicted: 'Offline', risk: 'Medium', trend: 'down' },
  ],
  weather: [
    { sector: 'Coastal Embankments', current: 'Stable', predicted: 'Breached', risk: 'Critical', trend: 'down' },
    { sector: 'Emergency Shelters', current: 'Standby', predicted: 'Full Capacity', risk: 'High', trend: 'up' },
    { sector: 'Power & Telecom', current: 'Normal', predicted: 'Severe Outage', risk: 'Critical', trend: 'down' },
    { sector: 'Aviation & Shipping', current: 'Open', predicted: 'Halted', risk: 'High', trend: 'down' },
    { sector: 'Public Safety', current: 'Adequate', predicted: 'Deploying NDRF', risk: 'High', trend: 'up' },
  ],
  traffic: [
    { sector: 'Evacuation Corridors', current: 'Clear', predicted: 'Gridlocked', risk: 'Critical', trend: 'up' },
    { sector: 'Emergency Transit Time', current: '15 mins', predicted: '65 mins', risk: 'Critical', trend: 'up' },
    { sector: 'Arterial Bypass Flow', current: 'Normal', predicted: 'Saturated', risk: 'High', trend: 'down' },
    { sector: 'Signal Control System', current: 'Fixed', predicted: 'AI Dynamic Routing', risk: 'Medium', trend: 'up' },
    { sector: 'Fuel Supply Depot', current: 'Adequate', predicted: 'High Consumption', risk: 'Medium', trend: 'down' },
  ],
  population: [
    { sector: 'Housing Market', current: 'Balanced', predicted: 'Deficit', risk: 'High', trend: 'down' },
    { sector: 'Traffic Congestion', current: 'Moderate', predicted: 'Severe', risk: 'High', trend: 'up' },
    { sector: 'Water Demand', current: 'Stable', predicted: 'Surpassed', risk: 'Medium', trend: 'up' },
    { sector: 'Waste Management', current: 'Adequate', predicted: 'Strained', risk: 'Medium', trend: 'down' },
    { sector: 'Public Schools', current: 'Normal', predicted: 'Overcrowded', risk: 'High', trend: 'up' },
  ]
};

interface Props {
  activeScenario: string;
  hasRun: boolean;
  simulationStep?: number;
  simulationData?: any[] | null;
}

export default function ResourceImpact({ activeScenario, hasRun, simulationStep = -1, simulationData }: Props) {
  const impacts = impactData[activeScenario as keyof typeof impactData] || impactData.flood;

  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium flex items-center justify-between">
          <span>Resource Impact Analysis</span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
            LIVE SECTOR MONITOR
          </span>
        </h3>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Sector Vulnerability: Live Baseline vs AI Prediction</p>
      </div>

      {!hasRun ? (
        <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
          <span className="text-xs text-gray-500 font-mono tracking-widest animate-pulse">AWAITING RUN...</span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
          {impacts.map((impact, i) => (
            <motion.div 
              key={impact.sector}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3.5 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between hover:border-white/20 transition-all"
            >
              <div>
                <div className="text-sm font-bold text-white mb-2">{impact.sector}</div>
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="bg-emerald-950/40 border border-emerald-500/20 px-2 py-1 rounded">
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold uppercase block">Live Telemetry:</span> 
                    <span className="text-emerald-200 font-mono font-bold">{impact.current}</span>
                  </div>
                  <div className="bg-blue-950/40 border border-blue-500/30 px-2 py-1 rounded">
                    <span className="text-[10px] text-blue-300 font-mono font-semibold uppercase block">AI Real-Time Forecast:</span> 
                    <span className="text-white font-mono font-bold">{impact.predicted}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                  impact.risk === 'Critical' ? 'bg-danger/20 text-danger border border-danger/40 animate-pulse' : 
                  impact.risk === 'High' ? 'bg-warning/20 text-warning border border-warning/40' : 
                  impact.risk === 'Medium' ? 'bg-secondary/20 text-secondary border border-secondary/40' : 'bg-success/20 text-success border border-success/40'
                }`}>{impact.risk}</span>
                
                {impact.trend === 'up' ? <TrendingUp className="w-4 h-4 text-danger" /> :
                 impact.trend === 'down' ? <TrendingDown className="w-4 h-4 text-warning" /> :
                 <Minus className="w-4 h-4 text-success" />}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
