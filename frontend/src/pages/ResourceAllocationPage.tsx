import { motion } from 'framer-motion';
import { PieChart, TrendingUp, AlertTriangle, Zap, Droplets, ShieldPlus, ArrowRight, Loader2, Search, Filter, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { useToast } from '../contexts/ToastContext';

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

type SortField = 'name' | 'risk' | 'icuBeds' | 'water' | 'electricity' | 'emergency' | 'optimization';

export default function ResourceAllocationPage() {
  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('optimization');
  const [sortAsc, setSortAsc] = useState(false);

  // State Reserves
  const [stateBudget, setStateBudget] = useState(12500);
  const [waterReserves, setWaterReserves] = useState(18500);
  const [powerCapacity, setPowerCapacity] = useState(16.4);
  const [activeEmergencyUnits, setActiveEmergencyUnits] = useState(120);

  const { addToast } = useToast();

  const [isDeployed, setIsDeployed] = useState(() => sessionStorage.getItem('pragma_directive_deployed') === 'true');

  useEffect(() => {
    const handleUpdate = () => {
      setIsDeployed(sessionStorage.getItem('pragma_directive_deployed') === 'true');
    };
    window.addEventListener('pragma_directive_updated', handleUpdate);
    return () => window.removeEventListener('pragma_directive_updated', handleUpdate);
  }, []);

  const handleDeploy = () => {
    setIsDeployed(true);
    sessionStorage.setItem('pragma_directive_deployed', 'true');
    localStorage.setItem('pragma_directive_deployed', 'true');
    window.dispatchEvent(new Event('pragma_directive_updated'));
    addToast('🏥 Resource Allocation Directive Deployed! High & Medium risk areas mitigated.', 'success');
  };

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
          // Only risk areas (High & Medium) receive re-optimized surge resource allocation
          if (d.risk === 'Low') return d;

          const newIcu = Math.min(500, d.icuBeds + (d.risk === 'High' ? 150 : 75));
          const newWater = Math.min(100, d.water + (d.risk === 'High' ? 25 : 15));
          const newElec = Math.min(100, d.electricity + (d.risk === 'High' ? 12 : 6));
          const newEmg = Math.max(20, d.emergency + (d.risk === 'High' ? 35 : 20));
          const newOpt = Math.min(99, Math.round(((newIcu/500)*25) + (newWater * 0.25) + (newElec * 0.3) + Math.min(20, newEmg * 0.2)));
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredDistricts = districts
    .filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'All' || d.risk === riskFilter;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 lg:pl-[280px]">
        <DashboardNavbar />
        
        <main className="p-8 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-poppins font-bold text-white mb-2">Resource Allocation Matrix</h1>
                  {isDeployed && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-success/20 text-success border border-success/40 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Directive Deployed Live
                    </span>
                  )}
                </div>
                <p className="text-gray-400">Interactive AI-driven distribution of state resources across districts.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-white px-5 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-wider"
                >
                  {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Zap className="w-4 h-4" />}
                  {isOptimizing ? 'Computing Simplex Bounds...' : 'Re-Optimize Matrix Distribution'}
                </button>

                <button 
                  onClick={handleDeploy}
                  disabled={isOptimizing || isDeployed}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-wider shadow-lg ${
                    isDeployed 
                      ? 'bg-success/20 text-success border border-success/40 cursor-default opacity-80'
                      : 'bg-gradient-to-r from-success to-emerald-600 hover:from-success/90 hover:to-emerald-700 text-white shadow-success/30 animate-pulse'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isDeployed ? 'Directive Deployed' : 'Apply & Deploy Allocation Directive'}
                </button>

                {isDeployed && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-gray-300 px-4 py-3 rounded-xl font-medium transition-all text-xs uppercase tracking-wider border border-white/10"
                    title="Reset state to view initial multi-color risk map"
                  >
                    ↺ Reset State
                  </button>
                )}
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div
                onClick={() => {
                  setStateBudget(prev => prev + 250);
                  addToast('Added ₹250 Cr to State Development Pool', 'success');
                }}
                className="glass-card p-6 border-l-4 border-l-primary cursor-pointer hover:border-primary/80 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/20 rounded-lg"><PieChart className="w-5 h-5 text-primary" /></div>
                  <span className="text-xs font-bold text-success flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +2.4%</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Total State Budget Allocated</h3>
                <p className="text-3xl font-mono font-bold text-white">₹{stateBudget.toLocaleString()} Cr</p>
              </div>
              
              <div
                onClick={() => {
                  setWaterReserves(prev => prev + 500);
                  addToast('Injected +500 ML into Deployable Water Reserves', 'success');
                }}
                className="glass-card p-6 border-l-4 border-l-secondary cursor-pointer hover:border-secondary/80 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-secondary/20 rounded-lg"><Droplets className="w-5 h-5 text-secondary" /></div>
                  <span className="text-xs font-bold text-danger flex items-center gap-1"><ArrowRight className="w-3 h-3"/> Deficit</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Water Reserves Deployable</h3>
                <p className="text-3xl font-mono font-bold text-white">{waterReserves.toLocaleString()} ML</p>
              </div>

              <div
                onClick={() => {
                  setPowerCapacity(prev => Number((prev + 0.5).toFixed(1)));
                  addToast('Engaged Peaking Units: +0.5 GW Power Added', 'success');
                }}
                className="glass-card p-6 border-l-4 border-l-warning cursor-pointer hover:border-warning/80 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-warning/20 rounded-lg"><Zap className="w-5 h-5 text-warning" /></div>
                  <span className="text-xs font-bold text-success flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Stable</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Power Grid Capacity</h3>
                <p className="text-3xl font-mono font-bold text-white">{powerCapacity} GW</p>
              </div>

              <div
                onClick={() => {
                  setActiveEmergencyUnits(prev => prev + 25);
                  addToast('Mobilized +25 State Emergency Patrols', 'success');
                }}
                className="glass-card p-6 border-l-4 border-l-danger cursor-pointer hover:border-danger/80 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-danger/20 rounded-lg"><ShieldPlus className="w-5 h-5 text-danger" /></div>
                  <span className="text-xs font-bold text-warning flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Active</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Emergency Units Active</h3>
                <p className="text-3xl font-mono font-bold text-white">{activeEmergencyUnits} Units</p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/10 w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search district..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-xs text-gray-400 font-bold uppercase mr-1">Risk Level:</span>
                {['All', 'High', 'Medium', 'Low'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setRiskFilter(lvl)}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                      riskFilter === lvl
                        ? 'bg-primary text-white font-bold shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* District Allocation Matrix Table */}
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" /> District Allocation Matrix
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Manage ICU bed surge, water allocation, power distribution, and emergency units across Tamil Nadu.</p>
                </div>
                <span className="text-xs text-gray-400 font-mono">Click column headers to sort</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                      <th onClick={() => handleSort('name')} className="py-4 px-4 font-semibold cursor-pointer hover:text-primary transition-colors select-none">
                        District
                      </th>
                      <th onClick={() => handleSort('risk')} className="py-4 px-4 font-semibold cursor-pointer hover:text-primary transition-colors select-none">
                        Predicted Risk
                      </th>
                      <th onClick={() => handleSort('icuBeds')} className="py-4 px-4 font-semibold text-rose-400 cursor-pointer hover:text-rose-300 transition-colors select-none">
                        ICU Bed & Surge Solution
                      </th>
                      <th onClick={() => handleSort('water')} className="py-4 px-4 font-semibold cursor-pointer hover:text-secondary transition-colors select-none">
                        Water Allocation
                      </th>
                      <th onClick={() => handleSort('electricity')} className="py-4 px-4 font-semibold cursor-pointer hover:text-warning transition-colors select-none">
                        Power Distribution
                      </th>
                      <th onClick={() => handleSort('emergency')} className="py-4 px-4 font-semibold cursor-pointer hover:text-danger transition-colors select-none">
                        Emergency Units
                      </th>
                      <th onClick={() => handleSort('optimization')} className="py-4 px-4 font-semibold cursor-pointer hover:text-primary transition-colors select-none">
                        AI Optimization Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDistricts.map(district => (
                      <motion.tr 
                        key={district.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-gray-200">{district.name}</td>
                        <td className="py-4 px-4">
                          {isDeployed && district.risk === 'High' ? (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-success/20 text-success border border-success/40 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3" /> Mitigated (Green)
                            </span>
                          ) : isDeployed && district.risk === 'Medium' ? (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Stabilized (Cyan)
                            </span>
                          ) : (
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
                              district.risk === 'High' ? 'bg-danger/20 text-danger border border-danger/30' : 
                              district.risk === 'Medium' ? 'bg-warning/20 text-warning border border-warning/30' : 
                              'bg-success/20 text-success border border-success/30'
                            }`}>
                              {district.risk === 'Low' ? 'Low Risk (Safe)' : `${district.risk} Risk`}
                            </span>
                          )}
                        </td>


                        {/* ICU Bed & Surge Solution Column */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="500"
                              step="10"
                              value={district.icuBeds}
                              onChange={e => updateDistrictVal(district.id, 'icuBeds', Number(e.target.value))}
                              className="w-24 h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer accent-rose-500"
                            />
                            <span className="text-xs font-mono text-rose-300 w-16">+{district.icuBeds} Beds</span>
                          </div>
                        </td>

                        {/* Water Allocation Slider */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={district.water}
                              onChange={e => updateDistrictVal(district.id, 'water', Number(e.target.value))}
                              className="w-24 h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer accent-secondary"
                            />
                            <span className="text-xs font-mono text-gray-300 w-9">{district.water}%</span>
                          </div>
                        </td>

                        {/* Power Distribution Slider */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={district.electricity}
                              onChange={e => updateDistrictVal(district.id, 'electricity', Number(e.target.value))}
                              className="w-24 h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer accent-warning"
                            />
                            <span className="text-xs font-mono text-gray-300 w-9">{district.electricity}%</span>
                          </div>
                        </td>

                        {/* Emergency Units Counter */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateDistrictVal(district.id, 'emergency', Math.max(0, district.emergency - 5))}
                              className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-xs font-bold text-gray-300 hover:bg-white/20"
                            >
                              -
                            </button>
                            <span className="text-xs font-mono text-gray-300 w-16 text-center">{district.emergency} Units</span>
                            <button
                              onClick={() => updateDistrictVal(district.id, 'emergency', district.emergency + 5)}
                              className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-xs font-bold text-gray-300 hover:bg-white/20"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* AI Score */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-success font-bold">{district.optimization}/100</span>
                            {district.optimization >= 90 && <CheckCircle2 className="w-4 h-4 text-success" />}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
