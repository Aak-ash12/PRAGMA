import { useState } from 'react';
import { Map, AlertCircle, Bus, Car, Navigation, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function TrafficAnalytics() {
  const [congestion, setCongestion] = useState<number>(84);
  const [avgSpeed, setAvgSpeed] = useState<number>(18);
  const [transitUsers, setTransitUsers] = useState<number>(4.2);
  const [isRerouted, setIsRerouted] = useState<boolean>(false);
  const { addToast } = useToast();

  const handlePreemptiveReroute = () => {
    setIsRerouted(true);
    setCongestion(52);
    setAvgSpeed(34);
    setTransitUsers(4.8);
    addToast('Preemptive Traffic Rerouting Activated! NH-45 bottleneck cleared.', 'success');
  };

  const handleAddBuses = () => {
    setTransitUsers(prev => parseFloat((prev + 0.3).toFixed(1)));
    setCongestion(prev => Math.max(30, prev - 4));
    addToast('Deployed +50 Express Buses on Metropolitan Corridors.', 'info');
  };

  return (
    <div className="glass-card h-[420px] flex flex-col justify-between">
      <div className="mb-3 flex justify-between items-start">
        <div>
          <h3 className="text-white font-poppins font-medium text-base">Traffic Intelligence</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Mobility & Congestion Analysis</p>
        </div>
        {isRerouted && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-success/20 text-success border border-success/30 font-bold uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Rerouted
          </span>
        )}
      </div>

      <div className="space-y-3 flex-1 flex flex-col justify-between">
        {/* Congestion Bar */}
        <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
          <div className="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center flex-shrink-0">
            <Map className="w-5 h-5 text-danger" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-white font-medium">Road Congestion (Chennai)</span>
              <span className={`text-xs font-mono font-bold ${congestion > 70 ? 'text-danger' : 'text-success'}`}>
                {congestion}%
              </span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${congestion > 70 ? 'bg-danger' : 'bg-success'}`}
                style={{ width: `${congestion}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Speed & Public Transit cards */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => setAvgSpeed(prev => (prev >= 45 ? 15 : prev + 5))}
            className="bg-white/5 p-3 rounded-xl border border-white/5 cursor-pointer hover:border-primary/40 transition-all"
          >
            <div className="flex items-center gap-2 mb-1">
              <Car className="w-4 h-4 text-primary" />
              <span className="text-xs text-gray-300 font-medium">Avg Speed</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              {avgSpeed} <span className="text-xs text-gray-400 font-sans">km/h</span>
            </div>
            <div className={`text-[10px] font-bold mt-1 ${avgSpeed < 20 ? 'text-danger' : 'text-success'}`}>
              {avgSpeed < 20 ? '-12% vs avg' : '+18% vs avg'}
            </div>
          </div>

          <div 
            onClick={handleAddBuses}
            className="bg-white/5 p-3 rounded-xl border border-white/5 cursor-pointer hover:border-success/40 transition-all group"
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-success" />
                <span className="text-xs text-gray-300 font-medium">Public Transit</span>
              </div>
              <span className="text-[9px] bg-success/20 text-success px-1.5 py-0.5 rounded font-bold">+50 Buses</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              {transitUsers}M <span className="text-xs text-gray-400 font-sans">users</span>
            </div>
            <div className="text-[10px] text-success mt-1 font-bold">+5% vs avg</div>
          </div>
        </div>

        {/* Workable Reroute Forecast Box */}
        <div className="p-3 bg-warning/10 border border-warning/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="text-xs text-warning font-bold">Traffic Forecast Alert</div>
              <button
                onClick={handlePreemptiveReroute}
                disabled={isRerouted}
                className="bg-warning text-black px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-warning/90 transition-colors disabled:opacity-50"
              >
                <Navigation className="w-3 h-3" />
                {isRerouted ? 'Reroute Applied' : 'Reroute Traffic Now'}
              </button>
            </div>
            <p className="text-[10px] text-gray-300 mt-1 leading-tight">
              {isRerouted
                ? 'Traffic successfully diverted to Outer Ring Road. Traffic congestion reduced from 84% to 52%.'
                : 'Severe gridlock expected on NH-45 between 17:00 and 19:30 due to festival weekend exodus. AI recommends preemptive rerouting.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

