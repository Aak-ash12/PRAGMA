import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const baseData = {
  flood: [
    { id: 1, primary: 4000, hosp: 2400, vaccine: 0, policy: 100 },
    { id: 2, primary: 3000, hosp: 1398, vaccine: 0, policy: 300 },
    { id: 3, primary: 2000, hosp: 9800, vaccine: 0, policy: 600 },
    { id: 4, primary: 2780, hosp: 3908, vaccine: 50, policy: 800 },
    { id: 5, primary: 1890, hosp: 4800, vaccine: 150, policy: 1200 },
    { id: 6, primary: 2390, hosp: 3800, vaccine: 300, policy: 1500 },
    { id: 7, primary: 3490, hosp: 4300, vaccine: 600, policy: 2000 },
  ],
  disease: [
    { id: 1, primary: 1200, hosp: 800, vaccine: 1000, policy: 50 },
    { id: 2, primary: 3000, hosp: 1500, vaccine: 5000, policy: 150 },
    { id: 3, primary: 8000, hosp: 4000, vaccine: 15000, policy: 400 },
    { id: 4, primary: 12000, hosp: 8000, vaccine: 45000, policy: 900 },
    { id: 5, primary: 9000, hosp: 6000, vaccine: 80000, policy: 1400 },
    { id: 6, primary: 5000, hosp: 3500, vaccine: 120000, policy: 1800 },
    { id: 7, primary: 2000, hosp: 1200, vaccine: 150000, policy: 2500 },
  ],
  power: [
    { id: 1, primary: 8000, hosp: 100, vaccine: 1200, policy: 20 },
    { id: 2, primary: 9500, hosp: 450, vaccine: 2500, policy: 80 },
    { id: 3, primary: 12000, hosp: 1200, vaccine: 4500, policy: 200 },
    { id: 4, primary: 14000, hosp: 3000, vaccine: 6000, policy: 500 },
    { id: 5, primary: 11000, hosp: 1500, vaccine: 3500, policy: 800 },
    { id: 6, primary: 8500, hosp: 500, vaccine: 1500, policy: 1200 },
    { id: 7, primary: 7000, hosp: 50, vaccine: 500, policy: 1500 },
  ],
  weather: [
    { id: 1, primary: 120, hosp: 80, vaccine: 200, policy: 150 },
    { id: 2, primary: 135, hosp: 95, vaccine: 450, policy: 350 },
    { id: 3, primary: 140, hosp: 110, vaccine: 800, policy: 600 },
    { id: 4, primary: 125, hosp: 90, vaccine: 1200, policy: 950 },
    { id: 5, primary: 95, hosp: 60, vaccine: 1500, policy: 1400 },
    { id: 6, primary: 70, hosp: 40, vaccine: 1800, policy: 1800 },
    { id: 7, primary: 45, hosp: 20, vaccine: 2000, policy: 2200 },
  ],
  traffic: [
    { id: 1, primary: 2500, hosp: 25, vaccine: 350, policy: 120 },
    { id: 2, primary: 3800, hosp: 42, vaccine: 520, policy: 280 },
    { id: 3, primary: 4600, hosp: 58, vaccine: 680, policy: 500 },
    { id: 4, primary: 5200, hosp: 65, vaccine: 850, policy: 820 },
    { id: 5, primary: 4100, hosp: 48, vaccine: 720, policy: 1100 },
    { id: 6, primary: 3200, hosp: 35, vaccine: 600, policy: 1450 },
    { id: 7, primary: 2200, hosp: 20, vaccine: 450, policy: 1800 },
  ],
  population: [
    { id: 1, primary: 100, hosp: 20, vaccine: 40, policy: 10 },
    { id: 2, primary: 105, hosp: 25, vaccine: 50, policy: 30 },
    { id: 3, primary: 112, hosp: 35, vaccine: 70, policy: 60 },
    { id: 4, primary: 122, hosp: 50, vaccine: 90, policy: 120 },
    { id: 5, primary: 135, hosp: 70, vaccine: 120, policy: 200 },
    { id: 6, primary: 150, hosp: 95, vaccine: 160, policy: 350 },
    { id: 7, primary: 168, hosp: 130, vaccine: 210, policy: 500 },
  ]
};

const scenarioMetricConfigs = {
  flood: {
    primary: "Evacuation Needs",
    hosp: "Evacuation Shelter Capacity",
    vaccine: "Water Contamination Risk",
    policy: "Flood Outflow Mitigation ROI"
  },
  disease: {
    primary: "New Infections",
    hosp: "Hospital ICU Saturation",
    vaccine: "Vaccine Doses Deployed",
    policy: "Quarantine Containment ROI"
  },
  power: {
    primary: "Total Grid Load (MW)",
    hosp: "Backup Generator Hours",
    vaccine: "Industrial Load Shedding (MW)",
    policy: "Thermal Grid Mitigation ROI"
  },
  weather: {
    primary: "Wind Velocity (km/h)",
    hosp: "Storm Surge Inundation (cm)",
    vaccine: "Coastal Shelters Open",
    policy: "Storm Relief Mitigation ROI"
  },
  traffic: {
    primary: "Evacuation Vehicles / hr",
    hosp: "Arterial Delay (mins)",
    vaccine: "Congestion Index (x10)",
    policy: "Smart Signal Routing ROI"
  },
  population: {
    primary: "Housing Demand Index",
    hosp: "School Capacity Deficit",
    vaccine: "Municipal Water Demand",
    policy: "Urban Zoning Mitigation ROI"
  }
};

interface Props {
  activeScenario: string;
  hasRun: boolean;
  simulationData?: any[] | null;
  simulationStep?: number;
}

export default function SimulationResults({ activeScenario, hasRun, simulationData, simulationStep = -1 }: Props) {
  const [view, setView] = useState('Weekly');
  
  const [showHosp, setShowHosp] = useState(true);
  const [showVaccine, setShowVaccine] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  const multiplier = view === 'Daily' ? 0.15 : view === 'Monthly' ? 4 : 1;
  const labelPrefix = view === 'Daily' ? 'Day' : view === 'Monthly' ? 'Month' : 'Week';

  const rawData = simulationData || baseData[activeScenario as keyof typeof baseData] || baseData.flood;
  const config = scenarioMetricConfigs[activeScenario as keyof typeof scenarioMetricConfigs] || scenarioMetricConfigs.flood;

  let visibleData = rawData;
  if (simulationStep >= 0 && simulationStep < 4) {
    const visibleCount = Math.max(
      Math.ceil(((simulationStep + 1) / 4) * rawData.length),
      2
    );
    visibleData = rawData.slice(0, visibleCount);
  }

  const data = visibleData.map(d => ({
    label: `${labelPrefix} ${d.id}`,
    primary: Math.round(d.primary * multiplier),
    hosp: Math.round(d.hosp * multiplier),
    vaccine: Math.round(d.vaccine * multiplier),
    policy: Math.round(d.policy * multiplier),
  }));

  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-white font-poppins font-medium flex items-center gap-2">
            Real-Time AI Prediction Results
            <span className="text-[10px] font-mono font-bold bg-blue-500/20 border border-blue-500/40 text-blue-300 px-2 py-0.5 rounded">
              MODEL INFERENCE ACTIVE
            </span>
          </h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Scenario Specific Trajectories & Metrics</p>
        </div>
        <div className="flex gap-2">
          {['Daily', 'Weekly', 'Monthly'].map(v => (
            <button 
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-xs rounded transition-colors ${view === v ? 'bg-primary text-white font-semibold' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {hasRun && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3 mt-1 px-3 py-2 bg-black/40 rounded-xl border border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live Baseline
            </span>
            <span className="text-[10px] font-mono text-blue-400 font-bold uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span> AI Forecast
            </span>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input type="checkbox" checked={showHosp} onChange={e => setShowHosp(e.target.checked)} className="accent-danger" />
              {config.hosp}
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input type="checkbox" checked={showVaccine} onChange={e => setShowVaccine(e.target.checked)} className="accent-success" />
              {config.vaccine}
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input type="checkbox" checked={showPolicy} onChange={e => setShowPolicy(e.target.checked)} className="accent-warning" />
              {config.policy}
            </label>
          </div>
        </div>
      )}

      {!hasRun ? (
        <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20 mt-4">
          <span className="text-xs text-gray-500 font-mono tracking-widest animate-pulse">AWAITING RUN...</span>
        </div>
      ) : (
        <div className="flex-1 w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHosp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVaccine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPolicy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="label" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              
              <Area type="monotone" dataKey="primary" stroke="#2563EB" fillOpacity={1} fill="url(#colorPop)" name={config.primary} />
              {showHosp && <Area type="monotone" dataKey="hosp" stroke="#EF4444" fillOpacity={1} fill="url(#colorHosp)" name={config.hosp} />}
              {showVaccine && <Area type="monotone" dataKey="vaccine" stroke="#10B981" fillOpacity={1} fill="url(#colorVaccine)" name={config.vaccine} />}
              {showPolicy && <Area type="monotone" dataKey="policy" stroke="#F59E0B" fillOpacity={1} fill="url(#colorPolicy)" name={config.policy} />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
