// @ts-nocheck
import { motion } from 'framer-motion';

const heatmapData = {
  flood: [
    { name: 'Chennai', score: 92, status: 'Critical', action: 'Evacuate low-lying zones immediately.' },
    { name: 'Kanchipuram', score: 78, status: 'High Risk', action: 'Deploy emergency medical units.' },
    { name: 'Tiruvallur', score: 65, status: 'Moderate', action: 'Monitor reservoir levels closely.' },
    { name: 'Chengalpattu', score: 45, status: 'Safe', action: 'Prepare as relief center.' },
  ],
  disease: [
    { name: 'Coimbatore', score: 88, status: 'Critical', action: 'Lockdown hotspot zones.' },
    { name: 'Madurai', score: 72, status: 'High Risk', action: 'Increase testing capacity.' },
    { name: 'Salem', score: 55, status: 'Moderate', action: 'Mandate masks in public.' },
    { name: 'Tirunelveli', score: 30, status: 'Safe', action: 'Normal monitoring.' },
  ],
  power: [
    { name: 'North Chennai', score: 95, status: 'Critical', action: 'Reroute power from central grid.' },
    { name: 'IT Corridor', score: 85, status: 'Critical', action: 'Activate industrial generators.' },
    { name: 'Vellore', score: 60, status: 'Moderate', action: 'Implement rolling blackouts.' },
    { name: 'Trichy', score: 20, status: 'Safe', action: 'Grid stable.' },
  ],
  weather: [
    { name: 'Ennore Port Coast', score: 96, status: 'Critical', action: 'Evacuate 5km coastal belt immediately.' },
    { name: 'Marina Beach Basin', score: 88, status: 'Critical', action: 'Deploy storm surge wave barriers.' },
    { name: 'Cuddalore Coastal', score: 74, status: 'High Risk', action: 'Mobilize NDRF relief teams.' },
    { name: 'Nagapattinam Port', score: 50, status: 'Moderate', action: 'Issue high-wind fishing ban.' },
  ],
  traffic: [
    { name: 'Kathipara Junction', score: 94, status: 'Critical', action: 'Enable AI dynamic signal override.' },
    { name: 'Koyambedu Bus Hub', score: 86, status: 'Critical', action: 'Reroute heavy intercity transport.' },
    { name: 'OMR Toll Plaza', score: 70, status: 'High Risk', action: 'Open emergency bypass lanes.' },
    { name: 'Tambaram Flyover', score: 52, status: 'Moderate', action: 'Deploy traffic police strike team.' },
  ],
  population: [
    { name: 'OMR Phase 2', score: 90, status: 'Critical', action: 'Fast-track water pipeline projects.' },
    { name: 'Tambaram', score: 82, status: 'High Risk', action: 'Approve new high-density zoning.' },
    { name: 'Sriperumbudur', score: 68, status: 'Moderate', action: 'Expand public transit routes.' },
    { name: 'Avadi', score: 40, status: 'Safe', action: 'Monitor growth trends.' },
  ]
};

interface Props {
  activeScenario: string;
  hasRun: boolean;
  activePeriod: string;
  simulationStep?: number;
  simulationData?: any[] | null;
}

export default function RiskHeatmap({ activeScenario, hasRun, activePeriod, simulationStep = -1, simulationData }: Props) {
  const baseDistricts = heatmapData[activeScenario as keyof typeof heatmapData] || heatmapData.flood;
  
  // Scale scores based on period to make it dynamic
  const periodMultiplier = activePeriod === '7 Days' ? 0.7 : activePeriod === '30 Days' ? 1.0 : activePeriod === '90 Days' ? 1.2 : 1.5;
  const stepMultiplier = simulationStep >= 0 && simulationStep < 4 ? (simulationStep + 1) / 4 : 1.0;
  const multiplier = periodMultiplier * stepMultiplier;

  const districts = baseDistricts.map(d => {
    const scaledScore = Math.min(100, Math.round(d.score * multiplier));
    let scaledStatus = d.status;
    if (scaledScore > 85) scaledStatus = 'Critical';
    else if (scaledScore > 65) scaledStatus = 'High Risk';
    else if (scaledScore > 40) scaledStatus = 'Moderate';
    else scaledStatus = 'Safe';
    return { ...d, score: scaledScore, status: scaledStatus };
  });

  return (
    <div className="glass-card flex-1 flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-white font-poppins font-medium flex items-center gap-2">
            Risk Heatmap
            <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded">
              REAL-TIME SENSING
            </span>
          </h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">District Vulnerability Index (Live Physics Scale)</p>
        </div>
      </div>
      
      {!hasRun ? (
        <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
          <span className="text-xs text-gray-500 font-mono tracking-widest animate-pulse">AWAITING RUN...</span>
        </div>
      ) : (
        <div className="flex-1 space-y-3">
          {districts.map((d, i) => (
            <motion.div 
              key={d.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-black/20 rounded-lg border border-white/5 overflow-hidden p-3 hover:bg-white/5 transition-colors cursor-help"
            >
              <div className="flex justify-between items-center relative z-10">
                <span className="text-xs font-bold text-white">{d.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  d.status === 'Critical' ? 'bg-danger/20 text-danger' : 
                  d.status === 'High Risk' ? 'bg-warning/20 text-warning' : 
                  d.status === 'Moderate' ? 'bg-secondary/20 text-secondary' : 'bg-success/20 text-success'
                }`}>{d.status}</span>
              </div>
              
              <div className="mt-2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity h-0 group-hover:h-auto overflow-hidden">
                <span className="text-primary font-bold">Action:</span> {d.action}
              </div>
              
              <div 
                className={`absolute top-0 left-0 bottom-0 opacity-10 ${
                  d.status === 'Critical' ? 'bg-danger' : 
                  d.status === 'High Risk' ? 'bg-warning' : 
                  d.status === 'Moderate' ? 'bg-secondary' : 'bg-success'
                }`}
                style={{ width: `${d.score}%` }}
              ></div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
