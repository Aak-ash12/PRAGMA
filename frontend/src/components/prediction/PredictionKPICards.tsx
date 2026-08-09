import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Filter, X, Sliders, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useToast } from '../../contexts/ToastContext';

export interface KPIMetric {
  title: string;
  category: 'Utilities' | 'Social' | 'Risk' | 'Governance';
  current: string;
  predicted: string;
  unit: string;
  variance: string;
  trend: 'up' | 'down' | 'flat';
  conf: number;
  data: number[];
  historical: { time: string; value: number; pred: number }[];
  description: string;
}

const defaultKpis: KPIMetric[] = [
  { 
    title: 'Population Growth', 
    category: 'Social',
    current: '83.2M', 
    predicted: '84.1M', 
    unit: 'Citizens',
    variance: '+1.08%',
    trend: 'up', 
    conf: 94, 
    data: [20, 25, 28, 32, 40, 48, 55],
    historical: [
      { time: 'M1', value: 82.5, pred: 82.5 },
      { time: 'M2', value: 82.8, pred: 82.9 },
      { time: 'M3', value: 83.2, pred: 83.4 },
      { time: 'M4', value: 83.2, pred: 84.1 },
    ],
    description: 'Demographic expansion rate calculated using census trends and employment immigration data.'
  },
  { 
    title: 'Hospital Occupancy', 
    category: 'Social',
    current: '78%', 
    predicted: '92%', 
    unit: 'Bed Capacity',
    variance: '+14.0%',
    trend: 'up', 
    conf: 89, 
    data: [60, 62, 65, 68, 72, 78, 92],
    historical: [
      { time: 'M1', value: 65, pred: 65 },
      { time: 'M2', value: 70, pred: 72 },
      { time: 'M3', value: 78, pred: 82 },
      { time: 'M4', value: 78, pred: 92 },
    ],
    description: 'ICU and emergency bed pressure across regional medical centers during seasonal illness peaks.'
  },
  { 
    title: 'Water Demand', 
    category: 'Utilities',
    current: '420 MLD', 
    predicted: '480 MLD', 
    unit: 'Million Liters/Day',
    variance: '+14.2%',
    trend: 'up', 
    conf: 91, 
    data: [40, 41, 43, 44, 45, 47, 48],
    historical: [
      { time: 'M1', value: 400, pred: 405 },
      { time: 'M2', value: 410, pred: 415 },
      { time: 'M3', value: 420, pred: 440 },
      { time: 'M4', value: 420, pred: 480 },
    ],
    description: 'Statewide municipal reservoir discharge rate measured against seasonal temperature forecasts.'
  },
  { 
    title: 'Electricity Usage', 
    category: 'Utilities',
    current: '14.2 GW', 
    predicted: '14.5 GW', 
    unit: 'Gigawatts Peak',
    variance: '+2.1%',
    trend: 'up', 
    conf: 96, 
    data: [12, 13, 13.5, 14, 14.1, 14.2, 14.5],
    historical: [
      { time: 'M1', value: 13.0, pred: 13.1 },
      { time: 'M2', value: 13.8, pred: 13.9 },
      { time: 'M3', value: 14.2, pred: 14.3 },
      { time: 'M4', value: 14.2, pred: 14.5 },
    ],
    description: 'Grid consumption peak monitoring powered by industrial telemetry sensors.'
  },
  { 
    title: 'Traffic Index', 
    category: 'Utilities',
    current: '6.4', 
    predicted: '5.8', 
    unit: 'Congestion Score',
    variance: '-9.3%',
    trend: 'down', 
    conf: 82, 
    data: [7, 6.8, 6.5, 6.7, 6.6, 6.4, 5.8],
    historical: [
      { time: 'M1', value: 7.2, pred: 7.0 },
      { time: 'M2', value: 6.8, pred: 6.6 },
      { time: 'M3', value: 6.4, pred: 6.1 },
      { time: 'M4', value: 6.4, pred: 5.8 },
    ],
    description: 'Average travel delay ratio across arterial expressways and metropolitan corridors.'
  },
  { 
    title: 'Disaster Risk', 
    category: 'Risk',
    current: 'Medium', 
    predicted: 'High', 
    unit: 'Threat Level',
    variance: 'Escalating',
    trend: 'up', 
    conf: 98, 
    data: [2, 3, 3, 4, 5, 7, 8],
    historical: [
      { time: 'M1', value: 2, pred: 2 },
      { time: 'M2', value: 4, pred: 4 },
      { time: 'M3', value: 5, pred: 6 },
      { time: 'M4', value: 6, pred: 8 },
    ],
    description: 'Multi-vector catastrophe probability matrix evaluating rainfall, wind, and river gauge levels.'
  },
  { 
    title: 'Budget Utilization', 
    category: 'Governance',
    current: '62%', 
    predicted: '75%', 
    unit: 'Allocated Funds',
    variance: '+13.0%',
    trend: 'up', 
    conf: 95, 
    data: [40, 45, 50, 55, 58, 62, 75],
    historical: [
      { time: 'M1', value: 45, pred: 45 },
      { time: 'M2', value: 52, pred: 55 },
      { time: 'M3', value: 62, pred: 65 },
      { time: 'M4', value: 62, pred: 75 },
    ],
    description: 'Fiscal expenditure velocity compared to annual capital allocation targets.'
  },
  { 
    title: 'Governance Efficiency', 
    category: 'Governance',
    current: '94/100', 
    predicted: '96/100', 
    unit: 'Quality Index',
    variance: '+2.1%',
    trend: 'up', 
    conf: 88, 
    data: [88, 89, 90, 92, 93, 94, 96],
    historical: [
      { time: 'M1', value: 89, pred: 90 },
      { time: 'M2', value: 92, pred: 93 },
      { time: 'M3', value: 94, pred: 95 },
      { time: 'M4', value: 94, pred: 96 },
    ],
    description: 'Composite public satisfaction score derived from complaint resolution and SLA tracking.'
  },
];

interface Props {
  data?: any[];
  onSelectKpi?: (title: string | null) => void;
}

export default function PredictionKPICards({ data: propData, onSelectKpi }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'current' | 'predicted' | 'variance'>('predicted');
  const [activeKpi, setActiveKpi] = useState<KPIMetric | null>(null);
  const [simulatedValue, setSimulatedValue] = useState<number>(50);
  const [isDeployed, setIsDeployed] = useState<boolean>(() => localStorage.getItem('pragma_directive_deployed') === 'true');
  const { addToast } = useToast();

  useEffect(() => {
    const handleUpdate = () => {
      setIsDeployed(localStorage.getItem('pragma_directive_deployed') === 'true');
    };
    window.addEventListener('pragma_directive_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('pragma_directive_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const categories = ['All', 'Utilities', 'Social', 'Risk', 'Governance'];

  const kpiList = defaultKpis.map(k => {
    if (k.title === 'Hospital Occupancy' && isDeployed) {
      return {
        ...k,
        predicted: '48%',
        variance: '-44.0% (Mitigated)',
        trend: 'down' as const,
        description: 'Directive #PRAGMA-2026 Active: 150 ICU Surge Beds deployed. Occupancy pressure reduced from 92% to 48%.',
        historical: [
          { time: 'M1', value: 65, pred: 65 },
          { time: 'M2', value: 70, pred: 72 },
          { time: 'M3', value: 78, pred: 60 },
          { time: 'M4', value: 48, pred: 48 },
        ]
      };
    }
    if (k.title === 'Disaster Risk' && isDeployed) {
      return {
        ...k,
        predicted: 'Low Risk',
        variance: '-65.0% (Mitigated)',
        trend: 'down' as const,
        description: 'Directive #PRAGMA-2026 Active: Emergency patrols active across Chennai & Vellore.'
      };
    }
    return k;
  });

  const filteredKpis = kpiList.filter(k => 
    selectedCategory === 'All' ? true : k.category === selectedCategory
  );

  const handleCardClick = (kpi: KPIMetric) => {
    setActiveKpi(kpi);
    setSimulatedValue(50);
    if (onSelectKpi) {
      onSelectKpi(kpi.title);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category & View Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-black/20 p-2.5 rounded-xl border border-white/5">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          <Filter className="w-3.5 h-3.5 text-primary ml-1 mr-1" />
          <span className="text-[10px] uppercase font-bold text-gray-400 mr-2">Filter Category:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm shadow-primary/40 font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
          <span className="text-[10px] uppercase text-gray-500 font-bold px-2">Display Mode:</span>
          <button
            onClick={() => setViewMode('current')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
              viewMode === 'current' ? 'bg-primary/30 text-primary border border-primary/40 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setViewMode('predicted')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
              viewMode === 'predicted' ? 'bg-primary/30 text-primary border border-primary/40 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Predicted
          </button>
          <button
            onClick={() => setViewMode('variance')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
              viewMode === 'variance' ? 'bg-primary/30 text-primary border border-primary/40 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Variance
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredKpis.map((kpi, i) => {
          const isUp = kpi.trend === 'up';
          const isDown = kpi.trend === 'down';
          const isSelected = activeKpi?.title === kpi.title;
          const chartData = kpi.data.map((val, idx) => ({ name: idx, val }));

          const displayPrimary = viewMode === 'current' ? kpi.current : viewMode === 'predicted' ? kpi.predicted : kpi.variance;

          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleCardClick(kpi)}
              className={`glass-card p-4 relative overflow-hidden cursor-pointer group transition-all duration-300 ${
                isSelected 
                  ? 'border-primary ring-2 ring-primary/50 shadow-[0_0_20px_rgba(37,99,235,0.3)] bg-primary/10' 
                  : 'hover:border-primary/50 hover:bg-white/5'
              }`}
            >
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-gray-300 text-xs font-semibold uppercase tracking-wider">{kpi.title}</h3>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold">
                  <span className="text-success bg-success/10 border border-success/20 px-1.5 py-0.5 rounded">{kpi.conf}% conf</span>
                </div>
              </div>

              <div className="flex items-end justify-between relative z-10 mt-2">
                <div>
                  <div className="text-2xl font-mono font-bold text-white group-hover:text-primary transition-colors">
                    {displayPrimary}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <span className="text-[10px] text-gray-500 uppercase">
                      {viewMode === 'current' ? 'Predicted:' : 'Current:'}
                    </span>
                    <span className="text-white font-medium">
                      {viewMode === 'current' ? kpi.predicted : kpi.current}
                    </span>
                    {isUp ? <TrendingUp className="w-3 h-3 text-warning ml-0.5" /> : 
                     isDown ? <TrendingDown className="w-3 h-3 text-success ml-0.5" /> : 
                     <Minus className="w-3 h-3 text-gray-400 ml-0.5" />}
                  </div>
                </div>

                <div className="w-16 h-9 opacity-60 group-hover:opacity-100 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <Area
                        type="monotone"
                        dataKey="val"
                        stroke={isUp ? '#F59E0B' : '#10B981'}
                        fill={isUp ? '#F59E0B' : '#10B981'}
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-2 border-t border-primary/30 text-[10px] text-primary flex items-center justify-between font-medium animate-pulse">
                  <span>Selected for Deep Dive Analysis</span>
                  <Sliders className="w-3 h-3" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Detail Drawer / Modal for Selected KPI */}
      <AnimatePresence>
        {activeKpi && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 border-l-4 border-l-primary relative overflow-hidden"
          >
            <button
              onClick={() => { setActiveKpi(null); if (onSelectKpi) onSelectKpi(null); }}
              className="absolute top-4 right-4 p-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-primary/20 rounded-xl border border-primary/40">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white font-poppins">{activeKpi.title} Model Workspace</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-semibold uppercase">
                    {activeKpi.category} Sector
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{activeKpi.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              {/* Historical Trend Chart */}
              <div className="lg:col-span-2 bg-black/30 p-4 rounded-xl border border-white/10 h-[220px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-300">Model Trajectory & Validation Curve</span>
                  <span className="text-[10px] text-success font-mono">XGBoost Ensemble Model ({activeKpi.conf}% R²)</span>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={activeKpi.historical}>
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
                    <YAxis stroke="#9CA3AF" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} name="Actual Telemetry" />
                    <Line type="monotone" dataKey="pred" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" name="ML Prediction" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Workable Scenario Simulator Slider */}
              <div className="bg-black/30 p-4 rounded-xl border border-white/10 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-primary" /> Stress-Test Simulation
                  </h4>
                  <p className="text-[11px] text-gray-400 mb-3">Adjust policy pressure to recalculate AI projection variance:</p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">Policy Intervention Level</span>
                        <span className="text-primary font-bold font-mono">{simulatedValue}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={simulatedValue}
                        onChange={(e) => setSimulatedValue(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>

                    <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-xs space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Baseline Prediction:</span>
                        <span className="text-white font-mono">{activeKpi.predicted}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-300">Simulated Target:</span>
                        <span className="text-success font-mono">
                          {(parseFloat(activeKpi.predicted) * (1 + (simulatedValue - 50) * 0.002)).toFixed(2)} {activeKpi.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => addToast(`Applied ${simulatedValue}% scenario intervention to ${activeKpi.title} model. Graph updated live.`, 'success')}
                    className="flex-1 bg-primary hover:bg-primaryHover text-white text-xs py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Apply Scenario Parameter
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

