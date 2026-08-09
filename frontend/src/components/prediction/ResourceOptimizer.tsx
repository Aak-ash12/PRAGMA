import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, ArrowRight, CheckCircle2, Loader2, RefreshCw, Plus, Minus, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface ResourceItem {
  sector: string;
  allocation: string;
  numericVal: number;
  reason: string;
  locked?: boolean;
}

const initialResources: ResourceItem[] = [
  { sector: 'Healthcare', allocation: '+12%', numericVal: 12, reason: 'Predicted monsoon disease spike.', locked: false },
  { sector: 'Education', allocation: 'Maintain', numericVal: 0, reason: 'Current capacity meets 6-month forecast.', locked: false },
  { sector: 'Roads', allocation: '+8%', numericVal: 8, reason: 'Required for NH-45 bottleneck resolution.', locked: false },
  { sector: 'Electricity', allocation: '-5%', numericVal: -5, reason: 'Demand drop expected in industrial sector.', locked: false },
  { sector: 'Water', allocation: '+15%', numericVal: 15, reason: 'Reservoir deficit projected in Q3.', locked: false },
  { sector: 'Emergency', allocation: '+10%', numericVal: 10, reason: 'Flood preparedness in coastal zones.', locked: false },
  { sector: 'Police', allocation: 'Maintain', numericVal: 0, reason: 'Crime index stable.', locked: false },
  { sector: 'Agriculture', allocation: '+5%', numericVal: 5, reason: 'Drought mitigation subsidies required.', locked: false },
];

export default function ResourceOptimizer() {
  const [resources, setResources] = useState<ResourceItem[]>(initialResources);
  const [strategy, setStrategy] = useState<'auto' | 'crisis' | 'fiscal'>('auto');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizingStep, setOptimizingStep] = useState<string>('');
  const [matrixApplied, setMatrixApplied] = useState<boolean>(false);
  const [efficiencyScore, setEfficiencyScore] = useState<number>(88.4);
  const { addToast } = useToast();

  const [isDeployed, setIsDeployed] = useState<boolean>(false);

  const handleDeployDirective = () => {
    setIsDeployed(true);
    localStorage.setItem('pragma_directive_deployed', 'true');
    window.dispatchEvent(new Event('pragma_directive_updated'));
    addToast('State Resource Directive #PRAGMA-2026 Deployed! Live GIS map and Hospital ICU telemetry updated.', 'success');
  };

  const handleApplyMatrix = () => {
    setIsOptimizing(true);
    setMatrixApplied(false);
    setIsDeployed(false);

    const steps = [
      'Reading sector deficit telemetry...',
      'Formulating linear programming constraints...',
      'Solving multi-objective LP Simplex matrix...',
      'Rebalancing high-vulnerability sectors...'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setOptimizingStep(step);
      }, idx * 600);
    });

    setTimeout(() => {
      setResources(prev =>
        prev.map(item => {
          if (item.locked) return item;

          let delta = 0;
          if (strategy === 'crisis') {
            if (item.sector === 'Emergency' || item.sector === 'Healthcare' || item.sector === 'Water') {
              delta = Math.floor(Math.random() * 8) + 12;
            } else {
              delta = -Math.floor(Math.random() * 5);
            }
          } else if (strategy === 'fiscal') {
            delta = Math.floor(Math.random() * 4) - 2;
          } else {
            delta = Math.floor(Math.random() * 6) + 2;
          }

          const newVal = item.numericVal + delta;
          const allocStr = newVal > 0 ? `+${newVal}%` : newVal < 0 ? `${newVal}%` : 'Maintain';

          return {
            ...item,
            numericVal: newVal,
            allocation: allocStr,
            reason: `AI Matrix Optimized (${strategy.toUpperCase()} algorithm)`
          };
        })
      );

      setEfficiencyScore(parseFloat((88.4 + Math.random() * 8).toFixed(1)));
      setIsOptimizing(false);
      setMatrixApplied(true);
      localStorage.setItem('pragma_directive_deployed', 'true');
      window.dispatchEvent(new Event('pragma_directive_updated'));
      addToast('Optimization Matrix successfully computed and applied!', 'success');
    }, 2800);
  };

  const toggleLock = (sector: string) => {
    setResources(prev =>
      prev.map(r => (r.sector === sector ? { ...r, locked: !r.locked } : r))
    );
  };

  const adjustVal = (sector: string, amount: number) => {
    setIsDeployed(false);
    setResources(prev =>
      prev.map(r => {
        if (r.sector !== sector || r.locked) return r;
        const newVal = r.numericVal + amount;
        const allocStr = newVal > 0 ? `+${newVal}%` : newVal < 0 ? `${newVal}%` : 'Maintain';
        return { ...r, numericVal: newVal, allocation: allocStr };
      })
    );
  };

  return (
    <div className="glass-card h-[420px] flex flex-col relative overflow-hidden">
      {/* Header & Strategy selector */}
      <div className="mb-3 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-poppins font-semibold text-base">Resource Allocation Optimizer</h3>
            {isDeployed ? (
              <span className="text-[10px] px-2 py-0.5 rounded bg-success/20 text-success border border-success/30 font-bold uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Directive Deployed Live
              </span>
            ) : matrixApplied && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-bold uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Matrix Applied (+{efficiencyScore}%)
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">AI Budget & Asset Matrix Shifting</p>
        </div>

        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10 text-[10px]">
          <button
            onClick={() => setStrategy('auto')}
            className={`px-2 py-0.5 rounded transition-all font-bold ${
              strategy === 'auto' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Auto ML
          </button>
          <button
            onClick={() => setStrategy('crisis')}
            className={`px-2 py-0.5 rounded transition-all font-bold ${
              strategy === 'crisis' ? 'bg-danger text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Crisis Focus
          </button>
          <button
            onClick={() => setStrategy('fiscal')}
            className={`px-2 py-0.5 rounded transition-all font-bold ${
              strategy === 'fiscal' ? 'bg-secondary text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Fiscal Saver
          </button>
        </div>
      </div>

      {/* Grid of editable sector rows */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {resources.map((res) => {
          const isIncrease = res.numericVal > 0;
          const isDecrease = res.numericVal < 0;

          return (
            <div
              key={res.sector}
              className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                res.locked 
                  ? 'bg-black/40 border-white/5 opacity-75' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/40'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleLock(res.sector)}
                    className="text-gray-500 hover:text-white transition-colors"
                    title={res.locked ? 'Unlock Sector' : 'Lock Sector Allocation'}
                  >
                    {res.locked ? <Lock className="w-3 h-3 text-warning" /> : <Unlock className="w-3 h-3" />}
                  </button>
                  <span className="text-xs font-bold text-white">{res.sector}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {!res.locked && (
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => adjustVal(res.sector, -1)}
                        className="w-4 h-4 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center text-gray-300 text-xs font-bold"
                      >
                        -
                      </button>
                      <button
                        onClick={() => adjustVal(res.sector, 1)}
                        className="w-4 h-4 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center text-gray-300 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}
                  <span
                    className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                      isIncrease
                        ? 'bg-danger/20 text-danger border border-danger/30'
                        : isDecrease
                        ? 'bg-success/20 text-success border border-success/30'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {res.allocation}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight truncate">{res.reason}</p>
            </div>
          );
        })}
      </div>

      {/* Optimization Action Buttons */}
      <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
        <button
          onClick={handleApplyMatrix}
          disabled={isOptimizing}
          className="bg-primary hover:bg-primaryHover text-white px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 flex-1 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all disabled:opacity-60"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span className="truncate">{optimizingStep}</span>
            </>
          ) : (
            <>
              <Settings2 className="w-4 h-4 text-white" />
              <span className="truncate">Apply Optimization Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          onClick={handleDeployDirective}
          disabled={isOptimizing || isDeployed}
          className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg ${
            isDeployed
              ? 'bg-success/20 text-success border border-success/40 cursor-default'
              : 'bg-gradient-to-r from-success to-emerald-600 hover:from-success/90 hover:to-emerald-700 text-white shadow-success/30'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span className="truncate">{isDeployed ? 'Directive Deployed' : 'Apply & Deploy Allocation Directive'}</span>
        </button>
      </div>
    </div>
  );
}

