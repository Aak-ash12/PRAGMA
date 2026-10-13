import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Navigation, Activity, X } from 'lucide-react';

interface MapDistrict {
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
}

const initialMapDistricts: MapDistrict[] = [
  {
    id: 1,
    name: 'Chennai',
    x: 76,
    y: 26,
    risk: 'High',
    initialColor: '#EF4444',
    problem: 'ICU Bed Overload (96% Full)',
    telemetry: 'Critical Infection Surge (96% ICU Occupancy)',
    solution: '+250 ICU Beds & Surge Field Wards',
    deployedMsg: 'Mitigated: +250 ICU Beds Deployed (ICU Occupancy dropped to 28%)'
  },
  {
    id: 2,
    name: 'Coimbatore',
    x: 28,
    y: 58,
    risk: 'High',
    initialColor: '#F59E0B',
    problem: 'Water Deficit (75% Shortage)',
    telemetry: 'Water Deficit Surge (75% Deficit in Reservoirs)',
    solution: 'Emergency Water Outflow & High-Capacity Pumps',
    deployedMsg: 'Mitigated: Emergency Reservoir Water Released (+45% Flow)'
  },
  {
    id: 3,
    name: 'Madurai',
    x: 48,
    y: 78,
    risk: 'High',
    initialColor: '#EC4899',
    problem: 'Emergency Bed Surge & O2 Shortage',
    telemetry: 'Critical O2 Supply (15% Reserve Level)',
    solution: '60 KL Express Liquid Oxygen Tankers',
    deployedMsg: 'Mitigated: 60 KL Liquid Oxygen Reserves Delivered'
  },
  {
    id: 4,
    name: 'Salem',
    x: 50,
    y: 42,
    risk: 'Medium',
    initialColor: '#3B82F6',
    problem: 'Power Grid Strain & Voltage Drop',
    telemetry: 'Peak Thermal Load (9,200 MW | 49.1 Hz)',
    solution: '500 MW Hydro Peaking Power Dispatch',
    deployedMsg: 'Mitigated: 500 MW Peaking Power Dispatched (Grid Load 30%)'
  },
  {
    id: 5,
    name: 'Tiruchirappalli',
    x: 58,
    y: 60,
    risk: 'Low',
    initialColor: '#10B981',
    problem: 'Capacity Normal (Safe Zone)',
    telemetry: 'Stable Infrastructure (32% Occupancy)',
    solution: 'Routine State Monitoring',
    deployedMsg: 'Stable: District Capacity Normal'
  }
];

export default function LiveMap() {
  const [isDeployed, setIsDeployed] = useState(() => sessionStorage.getItem('pragma_directive_deployed') === 'true');
  const [hoveredDistrict, setHoveredDistrict] = useState<MapDistrict | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<MapDistrict | null>(null);

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

  const handleSelectDistrict = (d: MapDistrict) => {
    setActiveDistrict(d);
    setHoveredDistrict(d);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-0 overflow-hidden h-[450px] relative z-0 border border-white/10 bg-[#081120] rounded-2xl flex flex-col justify-between"
    >
      {/* Top Header Banner */}
      <div className="absolute top-3 left-3 z-20 bg-black/85 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10 shadow-2xl max-w-[85%]">
        <h3 className="text-white font-poppins font-semibold text-xs md:text-sm flex flex-wrap items-center gap-2">
          Interactive GIS Risk Map - Tamil Nadu
          {isDeployed ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/40 font-bold uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Mitigated (Green)
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-danger/20 text-danger border border-danger/40 font-bold uppercase flex items-center gap-1 animate-pulse">
              <ShieldAlert className="w-3 h-3" /> Active Assessment
            </span>
          )}
        </h3>
        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Touch or click any district node to inspect issues</p>
      </div>

      {/* Legend overlay bottom left */}
      <div className="absolute bottom-3 left-3 z-20 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-gray-300 flex flex-wrap items-center gap-2.5 max-w-[90%]">
        <span className="font-bold text-white uppercase text-[9px] flex items-center gap-1">
          <Navigation className="w-3 h-3 text-primary" /> Legend:
        </span>
        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block"></span> Chennai (ICU Overload)</div>
        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block"></span> Coimbatore (Water Deficit)</div>
        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#EC4899] inline-block"></span> Madurai (Bed Surge)</div>
        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] inline-block"></span> Salem (Power Strain)</div>
        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block"></span> Trichy (Safe Zone)</div>
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
          
          {/* Tamil Nadu Boundary Polygon */}
          <polygon 
            points="82,20 90,26 84,42 74,68 62,88 42,92 32,84 22,68 18,50 38,34 58,26"
            fill="url(#tnGradient)" 
            stroke="rgba(59, 130, 246, 0.3)" 
            strokeWidth="0.8"
            strokeDasharray="2,2"
          />

          {/* Connection Lines connecting nodes */}
          <line x1="76" y1="26" x2="50" y2="42" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.6" />
          <line x1="50" y1="42" x2="28" y2="58" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.6" />
          <line x1="50" y1="42" x2="58" y2="60" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.6" />
          <line x1="58" y1="60" x2="48" y2="78" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.6" />
        </svg>

        {/* District Radar Nodes */}
        {initialMapDistricts.map((d) => {
          const isHighMitigated = isDeployed && d.risk === 'High';
          const isMediumStabilized = isDeployed && d.risk === 'Medium';

          const markerColor = isHighMitigated 
            ? '#10B981' 
            : isMediumStabilized 
            ? '#0EA5E9' 
            : d.initialColor;

          const isSelected = activeDistrict?.id === d.id || hoveredDistrict?.id === d.id;

          return (
            <div
              key={d.id}
              style={{ left: `${d.x}%`, top: `${d.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer p-3 group touch-manipulation"
              onClick={() => handleSelectDistrict(d)}
              onTouchStart={() => handleSelectDistrict(d)}
              onMouseEnter={() => setHoveredDistrict(d)}
              onMouseLeave={() => setHoveredDistrict(null)}
            >
              {/* Radar Pulse Ring */}
              <motion.div
                animate={{ scale: [1, 2.4, 1], opacity: [0.9, 0, 0.9] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-2 rounded-full pointer-events-none"
                style={{ backgroundColor: markerColor }}
              />

              {/* Node Circle Button */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-xl transition-all duration-300 ${isSelected ? 'scale-125 ring-4 ring-white/50' : 'group-hover:scale-110'}`}
                style={{ backgroundColor: markerColor, boxShadow: `0 0 20px ${markerColor}` }}
              >
                <Activity className="w-4 h-4 text-black font-extrabold" />
              </div>

              {/* Node Label Pin */}
              <div className={`absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-lg border text-[11px] font-mono font-bold text-white shadow-xl transition-all ${isSelected ? 'bg-primary border-white scale-110' : 'bg-black/90 border-white/20'}`}>
                {d.name}
              </div>
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
              className="absolute top-16 right-3 md:right-4 z-40 bg-[#0F172A]/95 border-2 border-primary/60 text-white rounded-2xl p-4.5 shadow-2xl max-w-xs w-full backdrop-blur-xl"
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
                <span className="text-white font-poppins">{activeDistrict?.name || hoveredDistrict?.name} District</span>
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
