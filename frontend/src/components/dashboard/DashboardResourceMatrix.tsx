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
  {
    "id": 1,
    "name": "Chennai",
    "risk": "High",
    "icuBeds": 227,
    "water": 40,
    "electricity": 85,
    "emergency": 99,
    "optimization": 86
  },
  {
    "id": 2,
    "name": "Coimbatore",
    "risk": "High",
    "icuBeds": 234,
    "water": 45,
    "electricity": 88,
    "emergency": 108,
    "optimization": 82
  },
  {
    "id": 3,
    "name": "Madurai",
    "risk": "High",
    "icuBeds": 241,
    "water": 50,
    "electricity": 91,
    "emergency": 117,
    "optimization": 86
  },
  {
    "id": 4,
    "name": "Salem",
    "risk": "Medium",
    "icuBeds": 110,
    "water": 76,
    "electricity": 83,
    "emergency": 65,
    "optimization": 92
  },
  {
    "id": 5,
    "name": "Tiruchirappalli",
    "risk": "Low",
    "icuBeds": 45,
    "water": 92,
    "electricity": 92,
    "emergency": 40,
    "optimization": 94
  },
  {
    "id": 6,
    "name": "Ariyalur",
    "risk": "Low",
    "icuBeds": 48,
    "water": 94,
    "electricity": 94,
    "emergency": 43,
    "optimization": 96
  },
  {
    "id": 7,
    "name": "Chengalpattu",
    "risk": "High",
    "icuBeds": 269,
    "water": 45,
    "electricity": 88,
    "emergency": 113,
    "optimization": 86
  },
  {
    "id": 8,
    "name": "Cuddalore",
    "risk": "High",
    "icuBeds": 276,
    "water": 50,
    "electricity": 91,
    "emergency": 122,
    "optimization": 82
  },
  {
    "id": 9,
    "name": "Dharmapuri",
    "risk": "Medium",
    "icuBeds": 135,
    "water": 71,
    "electricity": 93,
    "emergency": 60,
    "optimization": 91
  },
  {
    "id": 10,
    "name": "Dindigul",
    "risk": "Medium",
    "icuBeds": 140,
    "water": 75,
    "electricity": 75,
    "emergency": 65,
    "optimization": 94
  },
  {
    "id": 11,
    "name": "Erode",
    "risk": "Low",
    "icuBeds": 63,
    "water": 89,
    "electricity": 96,
    "emergency": 38,
    "optimization": 96
  },
  {
    "id": 12,
    "name": "Kallakurichi",
    "risk": "Medium",
    "icuBeds": 90,
    "water": 83,
    "electricity": 79,
    "emergency": 45,
    "optimization": 92
  },
  {
    "id": 13,
    "name": "Kanchipuram",
    "risk": "Medium",
    "icuBeds": 95,
    "water": 62,
    "electricity": 81,
    "emergency": 50,
    "optimization": 95
  },
  {
    "id": 14,
    "name": "Kanyakumari",
    "risk": "Medium",
    "icuBeds": 100,
    "water": 66,
    "electricity": 83,
    "emergency": 55,
    "optimization": 90
  },
  {
    "id": 15,
    "name": "Karur",
    "risk": "Medium",
    "icuBeds": 105,
    "water": 70,
    "electricity": 85,
    "emergency": 60,
    "optimization": 93
  },
  {
    "id": 16,
    "name": "Krishnagiri",
    "risk": "Medium",
    "icuBeds": 110,
    "water": 74,
    "electricity": 87,
    "emergency": 65,
    "optimization": 88
  },
  {
    "id": 17,
    "name": "Mayiladuthurai",
    "risk": "Medium",
    "icuBeds": 115,
    "water": 78,
    "electricity": 89,
    "emergency": 70,
    "optimization": 91
  },
  {
    "id": 18,
    "name": "Nagapattinam",
    "risk": "High",
    "icuBeds": 346,
    "water": 50,
    "electricity": 91,
    "emergency": 92,
    "optimization": 82
  },
  {
    "id": 19,
    "name": "Namakkal",
    "risk": "Low",
    "icuBeds": 47,
    "water": 90,
    "electricity": 96,
    "emergency": 42,
    "optimization": 97
  },
  {
    "id": 20,
    "name": "Nilgiris",
    "risk": "High",
    "icuBeds": 360,
    "water": 35,
    "electricity": 82,
    "emergency": 110,
    "optimization": 82
  },
  {
    "id": 21,
    "name": "Perambalur",
    "risk": "Low",
    "icuBeds": 53,
    "water": 94,
    "electricity": 92,
    "emergency": 28,
    "optimization": 96
  },
  {
    "id": 22,
    "name": "Pudukkottai",
    "risk": "Low",
    "icuBeds": 56,
    "water": 96,
    "electricity": 94,
    "emergency": 31,
    "optimization": 98
  },
  {
    "id": 23,
    "name": "Ramanathapuram",
    "risk": "High",
    "icuBeds": 231,
    "water": 50,
    "electricity": 91,
    "emergency": 97,
    "optimization": 86
  },
  {
    "id": 24,
    "name": "Ranipet",
    "risk": "Medium",
    "icuBeds": 90,
    "water": 81,
    "electricity": 83,
    "emergency": 45,
    "optimization": 88
  },
  {
    "id": 25,
    "name": "Sivaganga",
    "risk": "Medium",
    "icuBeds": 95,
    "water": 60,
    "electricity": 85,
    "emergency": 50,
    "optimization": 91
  },
  {
    "id": 26,
    "name": "Tenkasi",
    "risk": "Medium",
    "icuBeds": 100,
    "water": 64,
    "electricity": 87,
    "emergency": 55,
    "optimization": 94
  },
  {
    "id": 27,
    "name": "Thanjavur",
    "risk": "High",
    "icuBeds": 259,
    "water": 45,
    "electricity": 88,
    "emergency": 93,
    "optimization": 86
  },
  {
    "id": 28,
    "name": "Theni",
    "risk": "Medium",
    "icuBeds": 110,
    "water": 72,
    "electricity": 91,
    "emergency": 65,
    "optimization": 92
  },
  {
    "id": 29,
    "name": "Thoothukudi",
    "risk": "Medium",
    "icuBeds": 115,
    "water": 76,
    "electricity": 93,
    "emergency": 70,
    "optimization": 95
  },
  {
    "id": 30,
    "name": "Tirunelveli",
    "risk": "Low",
    "icuBeds": 40,
    "water": 82,
    "electricity": 94,
    "emergency": 35,
    "optimization": 94
  },
  {
    "id": 31,
    "name": "Tirupathur",
    "risk": "Low",
    "icuBeds": 43,
    "water": 84,
    "electricity": 96,
    "emergency": 38,
    "optimization": 96
  },
  {
    "id": 32,
    "name": "Tiruppur",
    "risk": "Medium",
    "icuBeds": 130,
    "water": 63,
    "electricity": 79,
    "emergency": 55,
    "optimization": 88
  },
  {
    "id": 33,
    "name": "Tiruvallur",
    "risk": "Low",
    "icuBeds": 49,
    "water": 88,
    "electricity": 92,
    "emergency": 44,
    "optimization": 95
  },
  {
    "id": 34,
    "name": "Tiruvannamalai",
    "risk": "High",
    "icuBeds": 308,
    "water": 55,
    "electricity": 94,
    "emergency": 116,
    "optimization": 82
  },
  {
    "id": 35,
    "name": "Tiruvarur",
    "risk": "Medium",
    "icuBeds": 145,
    "water": 75,
    "electricity": 85,
    "emergency": 70,
    "optimization": 89
  },
  {
    "id": 36,
    "name": "Vellore",
    "risk": "High",
    "icuBeds": 322,
    "water": 40,
    "electricity": 85,
    "emergency": 94,
    "optimization": 82
  },
  {
    "id": 37,
    "name": "Viluppuram",
    "risk": "Low",
    "icuBeds": 61,
    "water": 96,
    "electricity": 92,
    "emergency": 36,
    "optimization": 98
  },
  {
    "id": 38,
    "name": "Virudhunagar",
    "risk": "High",
    "icuBeds": 336,
    "water": 50,
    "electricity": 91,
    "emergency": 112,
    "optimization": 82
  }
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
