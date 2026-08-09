import { useState } from 'react';
import { Zap, Battery, Activity, ShieldAlert, CheckCircle2, Flame } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useToast } from '../../contexts/ToastContext';

const defaultChartData = [
  { time: '00:00', usage: 8.2 },
  { time: '04:00', usage: 7.5 },
  { time: '08:00', usage: 11.2 },
  { time: '12:00', usage: 13.8 },
  { time: '16:00', usage: 18.1 },
  { time: '20:00', usage: 14.1 },
  { time: '24:00', usage: 9.5 },
];

interface Props {
  data?: {
    loadGW: number;
    capacityGW: number;
    outageProbability: number;
    peakTempC: number;
    criticalReserveMarginPct: number;
  };
}

export default function ElectricityIntelligence({ data }: Props) {
  const [peakLoad, setPeakLoad] = useState<number>(data?.loadGW ?? 18.1);
  const [gridHealth, setGridHealth] = useState<number>(data ? Math.max(100 - data.outageProbability, 45) : 45);
  const [reserveMargin, setReserveMargin] = useState<number>(data?.criticalReserveMarginPct ?? 2);
  const [peakingEngaged, setPeakingEngaged] = useState<boolean>(false);
  const [loadSheddingActive, setLoadSheddingActive] = useState<boolean>(false);
  const { addToast } = useToast();

  const handlePeakingGenerators = () => {
    setPeakingEngaged(true);
    setReserveMargin(prev => Math.min(25, prev + 12));
    setGridHealth(prev => Math.min(95, prev + 20));
    addToast('North Chennai Thermal Peaking Generators Engaged (+1,200 MW Reserve).', 'success');
  };

  const toggleLoadShedding = () => {
    const nextState = !loadSheddingActive;
    setLoadSheddingActive(nextState);

    if (nextState) {
      setPeakLoad(prev => parseFloat(Math.max(10.0, prev - 3.8).toFixed(1)));
      setGridHealth(prev => Math.min(90, prev + 30));
      addToast('Rotation Load Shedding Initiated in Sector 4. Grid Frequency stabilized.', 'warning');
    } else {
      setPeakLoad(18.1);
      setGridHealth(45);
      addToast('Rotation Load Shedding Terminated. Normal grid load restored.', 'info');
    }
  };

  const adjustedChartData = defaultChartData.map(pt => ({
    ...pt,
    usage: parseFloat(((pt.usage / 18.1) * peakLoad).toFixed(1))
  }));

  return (
    <div className="glass-card h-[420px] flex flex-col justify-between">
      <div className="mb-3 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-poppins font-medium text-base">Electricity Intelligence</h3>
            {loadSheddingActive && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-warning/20 text-warning border border-warning/30 font-bold uppercase animate-pulse">
                Shedding Active
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Grid Load & Thermal Forecast</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePeakingGenerators}
            disabled={peakingEngaged}
            className="bg-warning/20 hover:bg-warning/30 text-warning border border-warning/40 px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-60"
          >
            <Flame className="w-3.5 h-3.5" />
            {peakingEngaged ? 'Peaking Online' : 'Engage Peaking Gen'}
          </button>

          <button
            onClick={toggleLoadShedding}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
              loadSheddingActive
                ? 'bg-danger text-white border-danger shadow-md shadow-danger/30'
                : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {loadSheddingActive ? 'Stop Shedding' : 'Load Shedding'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div 
          onClick={() => setGridHealth(prev => (prev >= 90 ? 40 : prev + 15))}
          className="bg-black/20 p-2.5 rounded-lg border border-white/5 text-center cursor-pointer hover:border-warning/50 transition-all"
        >
          <Zap className="w-4 h-4 text-warning mx-auto mb-1" />
          <div className="text-sm text-white font-bold font-mono">{gridHealth}%</div>
          <div className="text-[9px] text-gray-400 uppercase font-bold">Grid Health</div>
        </div>

        <div 
          onClick={() => setReserveMargin(prev => (prev >= 30 ? 2 : prev + 5))}
          className="bg-black/20 p-2.5 rounded-lg border border-white/5 text-center cursor-pointer hover:border-success/50 transition-all"
        >
          <Battery className="w-4 h-4 text-success mx-auto mb-1" />
          <div className="text-sm text-white font-bold font-mono">{reserveMargin}%</div>
          <div className="text-[9px] text-gray-400 uppercase font-bold">Reserve Margin</div>
        </div>

        <div className="bg-black/20 p-2.5 rounded-lg border border-white/5 text-center">
          <Activity className="w-4 h-4 text-primary mx-auto mb-1" />
          <div className="text-sm text-white font-bold font-mono">16:00</div>
          <div className="text-[9px] text-gray-400 uppercase font-bold">Peak Hour</div>
        </div>
      </div>

      <div className="flex-1 w-full h-[180px] relative">
        <div className="absolute top-1 left-2 text-[10px] text-gray-400 font-bold uppercase z-10">24H Thermal Load Curve (GW)</div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={adjustedChartData}>
            <defs>
              <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} formatter={(v) => [`${v} GW`, 'Peak Load']} />
            <Area type="monotone" dataKey="usage" stroke="#F59E0B" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

