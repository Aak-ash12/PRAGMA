import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface District {
  id: number;
  name: string;
  risk: 'High' | 'Medium' | 'Low';
  icuBeds: number;
  water: number;
  electricity: number;
  emergency: number;
  optimization: number;
}

const initialDistricts: District[] = [
  { id: 1, name: 'Chennai', risk: 'High', icuBeds: 250, water: 45, electricity: 92, emergency: 120, optimization: 88 },
  { id: 2, name: 'Coimbatore', risk: 'Medium', icuBeds: 120, water: 78, electricity: 85, emergency: 45, optimization: 94 },
  { id: 3, name: 'Madurai', risk: 'Low', icuBeds: 180, water: 65, electricity: 98, emergency: 30, optimization: 97 },
  { id: 4, name: 'Salem', risk: 'Medium', icuBeds: 90, water: 55, electricity: 70, emergency: 60, optimization: 82 },
  { id: 5, name: 'Tiruchirappalli', risk: 'Low', icuBeds: 50, water: 82, electricity: 88, emergency: 40, optimization: 95 },
  { id: 6, name: 'Tirunelveli', risk: 'Medium', icuBeds: 85, water: 70, electricity: 80, emergency: 35, optimization: 91 },
  { id: 7, name: 'Vellore', risk: 'High', icuBeds: 140, water: 40, electricity: 89, emergency: 85, optimization: 84 },
  { id: 8, name: 'Erode', risk: 'Low', icuBeds: 30, water: 88, electricity: 94, emergency: 25, optimization: 98 }
];

export default function DashboardResourceMatrix() {
  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDeployed, setIsDeployed] = useState(() => sessionStorage.getItem('pragma_directive_deployed') === 'true');
  const { addToast } = useToast();

  useEffect(() => {
    const handleUpdate = () => {
      setIsDeployed(sessionStorage.getItem('pragma_directive_deployed') === 'true');
    };
    window.addEventListener('pragma_directive_updated', handleUpdate);
    return () => window.removeEventListener('pragma_directive_updated', handleUpdate);
  }, []);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setIsDeployed(false);
    sessionStorage.setItem('pragma_directive_deployed', 'false');
    localStorage.removeItem('pragma_directive_deployed');
    window.dispatchEvent(new Event('pragma_directive_updated'));

    addToast('AI Swarm Solver optimizing high & medium risk sector allocations...', 'info');

    setTimeout(() => {
      setDistricts(prev =>
        prev.map(d => {
          if (d.risk === 'Low') return d;

          const newIcu = Math.min(500, d.icuBeds + (d.risk === 'High' ? 150 : 75));
          const newWater = Math.min(100, d.water + (d.risk === 'High' ? 25 : 15));
          const newElec = Math.min(100, d.electricity + (d.risk === 'High' ? 12 : 6));
          const newEmg = Math.max(20, d.emergency + (d.risk === 'High' ? 35 : 20));
          const newOpt = Math.min(99, Math.round((newIcu * 0.25) + (newWater * 0.25) + (newElec * 0.3) + Math.min(20, newEmg * 0.2)));
          return {
            ...d,
            icuBeds: newIcu,
            water: newWater,
            electricity: newElec,
            emergency: newEmg,
            optimization: newOpt
          };
        })
      );
      setIsOptimizing(false);
      addToast('⚡ Simplex Matrix Re-Optimized! Dispatched surge resources to High & Medium risk areas.', 'success');
    }, 1200);
  };

  const handleDeploy = () => {
    setIsDeployed(true);
    sessionStorage.setItem('pragma_directive_deployed', 'true');
    localStorage.setItem('pragma_directive_deployed', 'true');
    window.dispatchEvent(new Event('pragma_directive_updated'));
    addToast('🏥 Resource Allocation Directive Deployed! High & Medium risk areas mitigated.', 'success');
  };


  const handleReset = () => {
    setIsDeployed(false);
    sessionStorage.setItem('pragma_directive_deployed', 'false');
    localStorage.removeItem('pragma_directive_deployed');
    window.dispatchEvent(new Event('pragma_directive_updated'));
    addToast('Reset to initial multi-color risk assessment state.', 'info');
  };

  const updateDistrictVal = (id: number, field: 'icuBeds' | 'water' | 'electricity' | 'emergency', val: number) => {
    setDistricts(prev =>
      prev.map(d => {
        if (d.id !== id) return d;
        const updated = { ...d, [field]: val };
        const newOpt = Math.min(99, Math.round(((updated.icuBeds/500)*25) + (updated.water * 0.25) + (updated.electricity * 0.3) + Math.min(20, updated.emergency * 0.2)));
        return { ...updated, optimization: newOpt };
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 border-l-4 border-l-primary"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white font-poppins flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" /> Resource Allocation Matrix
            </h3>
            {isDeployed && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-success/20 text-success border border-success/40 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Directive Deployed Live
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Interactive AI-driven distribution of state resources across districts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] text-xs uppercase tracking-wider disabled:opacity-70"
          >
            {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {isOptimizing ? 'Optimizing Bounds...' : '⚡ Re-Optimize Matrix Distribution'}
          </button>

          <button
            onClick={handleDeploy}
            disabled={isOptimizing || isDeployed}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all text-xs uppercase tracking-wider shadow-lg ${
              isDeployed
                ? 'bg-success/20 text-success border border-success/40 cursor-default opacity-80'
                : 'bg-gradient-to-r from-success to-emerald-600 hover:from-success/90 hover:to-emerald-700 text-white shadow-success/30 animate-pulse'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isDeployed ? 'Directive Deployed' : '✓ Apply & Deploy Allocation Directive'}
          </button>

          {isDeployed && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-2.5 rounded-xl font-medium transition-all text-xs uppercase tracking-wider border border-white/10"
              title="Reset state to view initial multi-color risk map"
            >
              ↺ Reset State
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
              <th className="py-3 px-3 font-semibold">District</th>
              <th className="py-3 px-3 font-semibold">Predicted Risk</th>
              <th className="py-3 px-3 font-semibold text-rose-400">ICU Bed & Surge Solution</th>
              <th className="py-3 px-3 font-semibold">Water Allocation</th>
              <th className="py-3 px-3 font-semibold">Power Distribution</th>
              <th className="py-3 px-3 font-semibold">Emergency Units</th>
              <th className="py-3 px-3 font-semibold">AI Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {districts.map(district => (
              <tr key={district.id} className="hover:bg-white/5 transition-colors text-xs">
                <td className="py-3 px-3 font-medium text-white">{district.name}</td>
                <td className="py-3 px-3">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      isDeployed && district.risk === 'High'
                        ? 'bg-success/20 text-success border border-success/30'
                        : isDeployed && district.risk === 'Medium'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : district.risk === 'High'
                        ? 'bg-danger/20 text-danger border border-danger/30'
                        : district.risk === 'Medium'
                        ? 'bg-warning/20 text-warning border border-warning/30'
                        : 'bg-success/20 text-success border border-success/30'
                    }`}
                  >
                    {isDeployed && district.risk === 'High'
                      ? 'Mitigated (Green)'
                      : isDeployed && district.risk === 'Medium'
                      ? 'Stabilized (Cyan)'
                      : district.risk === 'Low'
                      ? 'Low Risk (Safe)'
                      : `${district.risk} Risk`}
                  </span>
                </td>


                {/* ICU Bed Overload & Surge Solution Column */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      value={district.icuBeds}
                      onChange={e => updateDistrictVal(district.id, 'icuBeds', Number(e.target.value))}
                      className="w-20 h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer accent-rose-500"
                    />
                    <span className="font-mono text-rose-300 w-16 text-right">+{district.icuBeds} Beds</span>
                  </div>
                </td>

                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={district.water}
                      onChange={e => updateDistrictVal(district.id, 'water', Number(e.target.value))}
                      className="w-20 h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer accent-secondary"
                    />
                    <span className="font-mono text-gray-300 w-8 text-right">{district.water}%</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={district.electricity}
                      onChange={e => updateDistrictVal(district.id, 'electricity', Number(e.target.value))}
                      className="w-20 h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer accent-warning"
                    />
                    <span className="font-mono text-gray-300 w-8 text-right">{district.electricity}%</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateDistrictVal(district.id, 'emergency', Math.max(0, district.emergency - 5))}
                      className="w-4 h-4 bg-white/10 rounded flex items-center justify-center text-xs font-bold text-gray-300 hover:bg-white/20"
                    >
                      -
                    </button>
                    <span className="font-mono text-gray-300 w-14 text-center">{district.emergency} U</span>
                    <button
                      onClick={() => updateDistrictVal(district.id, 'emergency', district.emergency + 5)}
                      className="w-4 h-4 bg-white/10 rounded flex items-center justify-center text-xs font-bold text-gray-300 hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-success font-bold">{district.optimization}/100</span>
                    {district.optimization >= 90 && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
