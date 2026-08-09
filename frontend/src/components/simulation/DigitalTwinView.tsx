import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  activeScenario: string;
  simulationStep: number;
  simulationData?: any[] | null;
  hasRun?: boolean;
  pipelinePayload?: any | null;
}

const scenarioAssetsMap: Record<string, any[]> = {
  flood: [
    {
      id: 1,
      type: 'Reservoir & Water Supply',
      name: 'Chembarambakkam Reservoir Outflow',
      x: 35,
      y: 40,
      baseLoad: '45% (Safe Inflow)',
      peakLoad: '96% (CRITICAL OVERFLOW)',
      baseColor: '#F59E0B',
      action: 'Open sluice gates & alert downstream Adyar basin.'
    },
    {
      id: 2,
      type: 'Submerged Transit Route',
      name: 'Adyar River Causeway Crossing',
      x: 55,
      y: 50,
      baseLoad: 'Normal Traffic Flow',
      peakLoad: 'Submerged (+2.4m Water Level)',
      baseColor: '#EF4444',
      action: 'Close bridge & activate emergency bypass via GST road.'
    },
    {
      id: 3,
      type: 'Rescue & Relief Sector',
      name: 'Velachery Low-Lying Inundation Zone',
      x: 60,
      y: 65,
      baseLoad: 'Dry / Monitoring',
      peakLoad: '85% Inundated (Evacuation Active)',
      baseColor: '#EF4444',
      action: 'Mobilize inflatable rescue boats & relief shelters.'
    },
    {
      id: 4,
      type: 'Coastal Defense Hub',
      name: 'Royapuram Marine Rescue Center',
      x: 75,
      y: 25,
      baseLoad: 'Standby Unit',
      peakLoad: 'Deploying NDRF Teams',
      baseColor: '#3B82F6',
      action: 'Dispatch coastal surge patrol & medical supply kits.'
    },
    {
      id: 5,
      type: 'Evacuation Corridor',
      name: 'NH-45 Express Evacuation Junction',
      x: 30,
      y: 75,
      baseLoad: 'Moderate Flow',
      peakLoad: 'GRIDLOCK (Heavy Relief Traffic)',
      baseColor: '#F59E0B',
      action: 'Activate AI smart traffic signal routing.'
    }
  ],
  disease: [
    {
      id: 1,
      type: 'Main Isolation Hospital',
      name: 'Rajiv Gandhi General Hospital (RGGGH)',
      x: 65,
      y: 35,
      baseLoad: '65% ICU Occupancy',
      peakLoad: '98% (CRITICAL ICU OVERLOAD)',
      baseColor: '#EF4444',
      action: 'Divert emergency patients to secondary field camps.'
    },
    {
      id: 2,
      type: 'Fever Triage Clinic',
      name: 'Kilpauk Medical College (KMC Hub)',
      x: 45,
      y: 40,
      baseLoad: '50% Triage Load',
      peakLoad: '88% Outbreak Saturation',
      baseColor: '#F59E0B',
      action: 'Open additional temporary isolation wards.'
    },
    {
      id: 3,
      type: 'Oxygen Storage Reserve',
      name: 'Stanley Medical Center Oxygen Depot',
      x: 70,
      y: 20,
      baseLoad: '92% Cylinder Stock',
      peakLoad: '30% Critical Stock Deficit',
      baseColor: '#EF4444',
      action: 'Inject liquid medical oxygen reserves from Vizag.'
    },
    {
      id: 4,
      type: 'Vaccine Cold-Chain Center',
      name: 'Central Vaccine Distribution Hub',
      x: 40,
      y: 60,
      baseLoad: 'Cold Storage Ready',
      peakLoad: '50,000 Doses/Day Dispatched',
      baseColor: '#10B981',
      action: 'Deploy mobile vaccination vans to outbreak hotspots.'
    },
    {
      id: 5,
      type: 'Regional Outbreak Unit',
      name: 'Coimbatore Infectious Disease Center',
      x: 20,
      y: 80,
      baseLoad: '40% Bed Occupancy',
      peakLoad: '82% Bed Surge',
      baseColor: '#EC4899',
      action: 'Enforce local containment & rapid testing protocols.'
    }
  ]
};

export default function DigitalTwinView({ activeScenario, simulationStep }: Props) {
  const [hoveredAsset, setHoveredAsset] = useState<any | null>(null);

  const scenarioKey = scenarioAssetsMap[activeScenario] ? activeScenario : 'flood';
  const scenarioList = scenarioAssetsMap[scenarioKey];

  let progressRatio = 0;
  if (simulationStep >= 0) {
    progressRatio = Math.min((simulationStep + 1) / 4, 1.0);
  }

  const currentAssets = scenarioList.map((asset, index) => {
    let currentLoad = asset.baseLoad;
    let predictedLoad = asset.peakLoad;
    let color = asset.baseColor;

    if (simulationStep >= 0) {
      if (index < 2) {
        color = '#EF4444';
      } else if (index === 2) {
        color = '#F59E0B';
      }
    }

    return {
      ...asset,
      currentLoad,
      predictedLoad,
      color
    };
  });

  return (
    <div className="glass-card p-0 w-full h-full relative overflow-hidden group border border-white/10 bg-[#081120] rounded-2xl flex flex-col justify-between">
      <div className="absolute top-4 left-4 z-20 bg-black/85 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shadow-2xl">
        <h3 className="text-white font-poppins font-bold text-sm mb-1 flex items-center gap-2">
          Digital Twin City View
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </h3>
        <p className="text-gray-300 text-[10px] font-mono uppercase tracking-wider">
          Active Scenario: <span className="text-primary font-bold">{activeScenario}</span> | {simulationStep === -1 ? 'Status: Live Stream Idle' : `AI Prediction Mode: T+${(progressRatio * 48).toFixed(0)} Hours`}
        </p>
      </div>

      <div className="absolute top-4 right-4 z-20 bg-black/85 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-lg flex flex-col gap-1 text-[10px] font-mono">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>LIVE TELEMETRY FEED</span>
        </div>
        <div className="flex items-center gap-2 text-blue-400">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>AI PREDICTIVE ENGINE</span>
        </div>
      </div>

      {/* SVG Canvas Twin View */}
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#081120] via-[#0D182E] to-[#081120]">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="twinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          <polygon 
            points="85,15 92,22 88,38 78,65 65,85 45,90 35,82 25,65 20,48 40,32 60,25"
            fill="url(#twinGrad)" 
            stroke="rgba(59, 130, 246, 0.3)" 
            strokeWidth="0.8"
            strokeDasharray="2,2"
          />

          <line x1="35" y1="40" x2="55" y2="50" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.5" />
          <line x1="55" y1="50" x2="60" y2="65" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.5" />
          <line x1="75" y1="25" x2="55" y2="50" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.5" />
        </svg>

        {currentAssets.map((asset) => {
          return (
            <div
              key={asset.id}
              style={{ left: `${asset.x}%`, top: `${asset.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
              onMouseEnter={() => setHoveredAsset(asset)}
              onMouseLeave={() => setHoveredAsset(null)}
            >
              <motion.div
                animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ backgroundColor: asset.color }}
              />

              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-transform duration-300 group-hover:scale-125"
                style={{ backgroundColor: asset.color, boxShadow: `0 0 15px ${asset.color}` }}
              >
                <Activity className="w-3.5 h-3.5 text-black font-bold" />
              </div>

              <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-0.5 rounded border border-white/20 text-[10px] font-mono font-bold text-white shadow-md">
                {asset.name}
              </div>
            </div>
          );
        })}

        <AnimatePresence>
          {hoveredAsset && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-4 right-4 z-40 bg-[#111827]/95 border border-primary/40 text-white rounded-xl p-4 shadow-2xl max-w-xs backdrop-blur-xl"
            >
              <div className="font-bold text-sm mb-1 flex items-center justify-between gap-2 border-b border-white/10 pb-1">
                <span>{hoveredAsset.name}</span>
                <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase bg-primary/20 text-primary">
                  {hoveredAsset.type}
                </span>
              </div>
              
              <div className="space-y-1.5 text-xs my-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Live Sensor:</span>
                  <span className="font-mono text-emerald-400 font-bold">{hoveredAsset.currentLoad}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Prediction:</span>
                  <span className="font-mono text-rose-400 font-bold">{hoveredAsset.predictedLoad}</span>
                </div>
              </div>

              <div className="p-2 bg-primary/10 border border-primary/30 rounded-lg text-[11px] text-primary">
                <span className="font-bold block uppercase text-[9px] text-primary/80 mb-0.5">Mitigation Action:</span>
                {hoveredAsset.action}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
