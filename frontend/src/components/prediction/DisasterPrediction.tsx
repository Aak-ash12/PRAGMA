import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, ShieldAlert, CheckCircle2, Loader2, Play } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface DisasterItem {
  id?: string;
  type: string;
  prob: number;
  conf: number;
  dist: string;
  action: string;
  executed?: boolean;
}

const fallbackDisasters: DisasterItem[] = [
  { id: '1', type: 'Flood', prob: 85, conf: 92, dist: 'Chennai, Tiruvallur', action: 'Evacuate low-lying zones.' },
  { id: '2', type: 'Cyclone', prob: 60, conf: 88, dist: 'Nagapattinam', action: 'Issue early warning to fishermen.' },
  { id: '3', type: 'Heatwave', prob: 25, conf: 75, dist: 'Vellore', action: 'Prepare cooling shelters.' },
  { id: '4', type: 'Drought', prob: 40, conf: 82, dist: 'Ramanathapuram', action: 'Initiate water rationing phase 1.' },
  { id: '5', type: 'Earthquake', prob: 2, conf: 99, dist: 'N/A', action: 'Routine monitoring.' },
  { id: '6', type: 'Fire Risk', prob: 15, conf: 80, dist: 'Nilgiris', action: 'Forest patrol deployment.' },
];

interface Props {
  data?: DisasterItem[];
}

export default function DisasterPrediction({ data: propData }: Props) {
  const [items, setItems] = useState<DisasterItem[]>(propData || fallbackDisasters);
  const [executingType, setExecutingType] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<'All' | 'High'>('All');
  const { addToast } = useToast();

  const handleExecuteAction = (disaster: DisasterItem) => {
    setExecutingType(disaster.type);

    setTimeout(() => {
      setItems(prev =>
        prev.map(item =>
          item.type === disaster.type
            ? { ...item, prob: Math.max(5, item.prob - 40), executed: true }
            : item
        )
      );
      setExecutingType(null);
      addToast(`Action Executed: "${disaster.action}" in ${disaster.dist}`, 'success');
    }, 1800);
  };

  const filteredItems = items.filter(d => (riskFilter === 'High' ? d.prob >= 50 : true));

  return (
    <div className="glass-card h-[420px] flex flex-col justify-between">
      <div className="mb-3 flex justify-between items-start">
        <div>
          <h3 className="text-white font-poppins font-medium text-base">Disaster Prediction</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Natural Calamity Risk Index</p>
        </div>

        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10 text-[10px]">
          <button
            onClick={() => setRiskFilter('All')}
            className={`px-2 py-0.5 rounded transition-all font-bold ${
              riskFilter === 'All' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            All Risks
          </button>
          <button
            onClick={() => setRiskFilter('High')}
            className={`px-2 py-0.5 rounded transition-all font-bold ${
              riskFilter === 'High' ? 'bg-danger text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            High Risk (&gt;50%)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2.5">
        {filteredItems.map((d, i) => {
          const isHighRisk = d.prob >= 50;
          const isExecuting = executingType === d.type;

          return (
            <motion.div 
              key={d.type}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-3 rounded-xl border transition-all ${
                isHighRisk 
                  ? 'border-danger/40 bg-danger/10 hover:bg-danger/15' 
                  : 'border-white/10 bg-black/20 hover:bg-white/5'
              } relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div className="flex items-center gap-2">
                  {isHighRisk && <AlertOctagon className="w-4 h-4 text-danger animate-pulse" />}
                  <span className={`text-sm font-bold ${isHighRisk ? 'text-danger' : 'text-white'}`}>{d.type}</span>
                  {d.executed && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-success/20 text-success border border-success/30 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Mitigated
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-white">{d.prob}% Prob</div>
                  <div className="text-[9px] text-success font-bold">{d.conf}% Conf</div>
                </div>
              </div>
              
              <div className="text-[10px] text-gray-400 mb-2">Affected Region: <span className="text-gray-200 font-medium">{d.dist}</span></div>
              
              <button
                onClick={() => handleExecuteAction(d)}
                disabled={isExecuting || d.executed}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between border ${
                  d.executed
                    ? 'bg-success/20 text-success border-success/30 cursor-default'
                    : isHighRisk
                    ? 'bg-danger/20 hover:bg-danger/30 text-danger border-danger/40'
                    : 'bg-primary/20 hover:bg-primary/30 text-primary border-primary/40'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Play className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Action: {d.action}</span>
                </div>

                {isExecuting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0 ml-1" />
                ) : d.executed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 ml-1" />
                ) : (
                  <span className="text-[9px] uppercase tracking-wider opacity-80 flex-shrink-0 ml-1">Execute</span>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

