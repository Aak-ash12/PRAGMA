import { Droplets, Activity, Zap, Users, Car, AlertTriangle, CloudRain } from 'lucide-react';

const scenarios = [
  { 
    id: 'flood', 
    title: 'Flood & Dam Discharge', 
    icon: Droplets, 
    risk: 'High', 
    duration: '7 Days',
    liveVectors: 'Rainfall, River Gauge, Dam Sluice'
  },
  { 
    id: 'disease', 
    title: 'Disease Outbreak & ICU Stress', 
    icon: Activity, 
    risk: 'Critical', 
    duration: '90 Days',
    liveVectors: 'AQI Index, Temp, Humidity'
  },
  { 
    id: 'power', 
    title: 'Power Grid Thermal Surge', 
    icon: Zap, 
    risk: 'High', 
    duration: '24 Hours',
    liveVectors: 'Power Load MW, Peak Temp'
  },
  { 
    id: 'weather', 
    title: 'Severe Weather & Storm Surge', 
    icon: CloudRain, 
    risk: 'Critical', 
    duration: '7 Days',
    liveVectors: 'AQI, Temp, Humidity, Wind'
  },
  { 
    id: 'traffic', 
    title: 'Traffic Congestion & Evacuation Highway', 
    icon: Car, 
    risk: 'High', 
    duration: '12 Hours',
    liveVectors: 'Traffic Index, Congestion, Route Speed'
  },
  { 
    id: 'population', 
    title: 'Population & Housing Growth', 
    icon: Users, 
    risk: 'Low', 
    duration: '1 Year',
    liveVectors: 'Housing Demand, Demographic Load'
  },
];

interface Props {
  activeScenario: string;
  onSelect: (id: string) => void;
}

export default function ScenarioSelector({ activeScenario, onSelect }: Props) {
  return (
    <div className="glass-card flex flex-col h-[340px]">
      <div className="mb-3 flex justify-between items-center">
        <h3 className="text-white font-poppins font-semibold text-sm">Scenario Selection</h3>
        <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
          Live Telemetry Ready
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2.5">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isSelected = scenario.id === activeScenario;
          return (
            <div 
              key={scenario.id} 
              onClick={() => onSelect(scenario.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                isSelected 
                  ? 'border-primary/60 bg-primary/15 shadow-[0_0_15px_rgba(37,99,235,0.25)]' 
                  : 'border-white/5 bg-black/20 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-primary animate-pulse' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{scenario.title}</span>
                </div>
                <AlertTriangle className={`w-3.5 h-3.5 ${
                  scenario.risk === 'Critical' ? 'text-danger' : scenario.risk === 'High' ? 'text-warning' : 'text-success'
                }`} />
              </div>
              <p className="text-[10px] text-gray-400 font-mono mb-2">Live API: {scenario.liveVectors}</p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-mono">Horizon: {scenario.duration}</span>
                {isSelected ? (
                  <span className="text-[10px] bg-primary/30 border border-primary/50 text-primary font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    Active Scenario
                  </span>
                ) : (
                  <button className="text-[10px] bg-white/5 hover:bg-white/10 text-white px-2 py-0.5 rounded transition-colors pointer-events-none font-bold">
                    Select
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
