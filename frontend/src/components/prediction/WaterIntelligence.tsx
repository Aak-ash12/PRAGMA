import { useState } from 'react';
import { Droplets, Activity, CloudRain, AlertTriangle, CloudLightning, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Props {
  data?: {
    reservoirLevel: number;
    consumptionMLD: number;
    consumptionChangePct: number;
    scarcityIndex: number;
    rainfallForecastChangePct: number;
  };
}

export default function WaterIntelligence({ data }: Props) {
  const [reservoir, setReservoir] = useState<number>(data?.reservoirLevel ?? 42);
  const [consumption, setConsumption] = useState<number>(data?.consumptionMLD ?? 420);
  const [rainForecast, setRainForecast] = useState<number>(data?.rainfallForecastChangePct ?? -12);
  const [scarcity, setScarcity] = useState<number>(data?.scarcityIndex ?? 8.4);
  const [isRationing, setIsRationing] = useState<boolean>(false);
  const { addToast } = useToast();

  const handleCloudSeeding = () => {
    setRainForecast(prev => prev + 25);
    setReservoir(prev => Math.min(100, prev + 12));
    setScarcity(prev => Math.max(1.0, parseFloat((prev - 1.8).toFixed(1))));
    addToast('Cloud Seeding protocol engaged! Simulated +25% precipitation inflow.', 'success');
  };

  const toggleWaterRationing = () => {
    const nextState = !isRationing;
    setIsRationing(nextState);

    if (nextState) {
      setConsumption(prev => Math.max(250, prev - 80));
      setScarcity(prev => Math.max(1.0, parseFloat((prev - 2.2).toFixed(1))));
      addToast('Phase-2 Water Rationing Enforced. Daily consumption reduced by 80 MLD.', 'warning');
    } else {
      setConsumption(420);
      setScarcity(8.4);
      addToast('Water Rationing Protocol lifted. Standard supply restored.', 'info');
    }
  };

  return (
    <div className="glass-card h-[420px] flex flex-col justify-between">
      <div className="mb-3 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-poppins font-medium text-base">Water Intelligence</h3>
            {isRationing && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-warning/20 text-warning border border-warning/30 font-bold uppercase animate-pulse">
                Rationing Active
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Reservoir & Demand Analysis</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCloudSeeding}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
          >
            <CloudLightning className="w-3.5 h-3.5" />
            Cloud Seed
          </button>
          <button
            onClick={toggleWaterRationing}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
              isRationing
                ? 'bg-warning text-black border-warning font-bold'
                : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            {isRationing ? 'Lift Rationing' : 'Enforce Rationing'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div 
          onClick={() => setReservoir(prev => (prev >= 90 ? 30 : prev + 10))}
          className="bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-all group"
        >
          <Droplets className="w-7 h-7 text-primary mb-1.5 opacity-80 group-hover:scale-110 transition-transform" />
          <div className="text-2xl font-mono font-bold text-white mb-0.5">{reservoir}%</div>
          <div className="text-[9px] text-gray-400 uppercase font-bold">Avg Reservoir Level</div>
          <div className="text-[9px] text-danger mt-0.5 font-bold">
            {reservoir < 30 ? 'CRITICAL STATUS' : reservoir < 50 ? 'Warning: Low Levels' : 'Safety limits stable'}
          </div>
        </div>
        
        <div 
          onClick={() => setConsumption(prev => (prev >= 550 ? 300 : prev + 20))}
          className="bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-secondary/50 transition-all group"
        >
          <Activity className="w-7 h-7 text-secondary mb-1.5 opacity-80 group-hover:scale-110 transition-transform" />
          <div className="text-2xl font-mono font-bold text-white mb-0.5">{consumption}<span className="text-xs"> MLD</span></div>
          <div className="text-[9px] text-gray-400 uppercase font-bold">Current Consumption</div>
          <div className="text-[9px] text-warning mt-0.5 font-bold">
            {consumption > 420 ? `+${Math.round(((consumption-420)/420)*100)}% vs Baseline` : `${Math.round(((consumption-420)/420)*100)}% vs Baseline`}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center gap-2.5">
            <CloudRain className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs text-white font-medium">Rainfall Forecast (Next 30D)</div>
              <div className="text-[9px] text-gray-400">Runoff Calculation Inflow</div>
            </div>
          </div>
          <div className="text-xs font-mono font-bold text-warning">
            {rainForecast >= 0 ? `+${rainForecast}%` : `${rainForecast}%`}
          </div>
        </div>
        
        <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-danger" />
            <div>
              <div className="text-xs text-white font-medium">Water Scarcity Index</div>
              <div className="text-[9px] text-gray-400">Chennai Regional Area</div>
            </div>
          </div>
          <div className="text-xs font-mono font-bold text-danger">{scarcity} / 10</div>
        </div>
      </div>
    </div>
  );
}

