import { useState } from 'react';
import { Leaf, Droplets, CloudRain, Sprout, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function AgricultureIntelligence() {
  const [cropHealth, setCropHealth] = useState<number>(82);
  const [soilMoisture, setSoilMoisture] = useState<number>(34);
  const [paddyYield, setPaddyYield] = useState<number>(-4);
  const [sugarcaneYield, setSugarcaneYield] = useState<number>(2);
  const [isIrrigated, setIsIrrigated] = useState<boolean>(false);
  const { addToast } = useToast();

  const handleIrrigationBoost = () => {
    setIsIrrigated(true);
    setSoilMoisture(58);
    setCropHealth(94);
    setPaddyYield(8);
    setSugarcaneYield(6);
    addToast('Cauvery Delta Canal Irrigation Boost Triggered! Soil moisture restored to 58%.', 'success');
  };

  return (
    <div className="glass-card h-[420px] flex flex-col justify-between">
      <div className="mb-3 flex justify-between items-start">
        <div>
          <h3 className="text-white font-poppins font-medium text-base">Agriculture Intelligence</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Crop & Soil Forecasting (Delta Region)</p>
        </div>
        <button
          onClick={handleIrrigationBoost}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
            isIrrigated
              ? 'bg-success text-white border-success shadow-md shadow-success/30 font-bold'
              : 'bg-primary/20 text-primary border-primary/40 hover:bg-primary/30'
          }`}
        >
          <Sprout className="w-3.5 h-3.5" />
          {isIrrigated ? 'Irrigation Online' : 'Boost Canal Irrigation'}
        </button>
      </div>

      <div className="space-y-3 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => setCropHealth(prev => (prev >= 95 ? 65 : prev + 5))}
            className="bg-black/20 p-3.5 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-success/50 transition-all group"
          >
            <Leaf className="w-6 h-6 text-success mb-1 opacity-80 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-mono font-bold text-white mb-0.5">{cropHealth}%</div>
            <div className="text-[9px] text-gray-400 uppercase font-bold">Crop Health Index</div>
          </div>
          
          <div 
            onClick={() => setSoilMoisture(prev => (prev >= 80 ? 20 : prev + 10))}
            className="bg-black/20 p-3.5 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-all group"
          >
            <Droplets className="w-6 h-6 text-primary mb-1 opacity-80 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-mono font-bold text-white mb-0.5">{soilMoisture}%</div>
            <div className="text-[9px] text-gray-400 uppercase font-bold">Avg Soil Moisture</div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/5 p-3.5">
          <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-secondary" /> Yield Prediction (Delta Region)
          </h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] mb-1 font-bold">
                <span className="text-gray-300">Paddy Crop Yield</span>
                <span className={paddyYield >= 0 ? 'text-success' : 'text-warning'}>
                  {paddyYield >= 0 ? `+${paddyYield}% expected` : `${paddyYield}% expected`}
                </span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${paddyYield >= 0 ? 'bg-success' : 'bg-warning'}`}
                  style={{ width: `${Math.max(20, 65 + paddyYield * 3)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-[10px] mb-1 font-bold">
                <span className="text-gray-300">Sugarcane Crop Yield</span>
                <span className={sugarcaneYield >= 0 ? 'text-success' : 'text-warning'}>
                  {sugarcaneYield >= 0 ? `+${sugarcaneYield}% expected` : `${sugarcaneYield}% expected`}
                </span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${sugarcaneYield >= 0 ? 'bg-success' : 'bg-warning'}`}
                  style={{ width: `${Math.max(20, 80 + sugarcaneYield * 3)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

