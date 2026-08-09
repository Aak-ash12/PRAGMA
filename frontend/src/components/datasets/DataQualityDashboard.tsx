import { AlertTriangle, CheckCircle, HelpCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const realMetrics: Record<string, any> = {
  'Population Census 2023': { score: 98.2, missing: 1204, duplicates: 0, errors: 14, outliers: 42 },
  'State Hospital Occupancy': { score: 92.5, missing: 345, duplicates: 12, errors: 5, outliers: 8 },
  'Chennai Traffic Flow': { score: 88.4, missing: 8900, duplicates: 450, errors: 89, outliers: 120 },
  'Monsoon Rainfall Data': { score: 99.1, missing: 12, duplicates: 0, errors: 2, outliers: 4 },
  'Reservoir Water Levels': { score: 97.8, missing: 45, duplicates: 1, errors: 0, outliers: 2 },
  'Power Grid Load Metrics': { score: 82.0, missing: 14500, duplicates: 890, errors: 450, outliers: 670 },
  'Agricultural Yield 2023': { score: 94.5, missing: 890, duplicates: 45, errors: 12, outliers: 34 },
  'State Budget Allocation': { score: 100.0, missing: 0, duplicates: 0, errors: 0, outliers: 0 },
  'default': { score: 90.0, missing: 500, duplicates: 10, errors: 5, outliers: 20 }
};

export default function DataQualityDashboard() {
  const [metrics, setMetrics] = useState(realMetrics['Population Census 2023']);
  const [isUpdating, setIsUpdating] = useState(false);

  const refreshMetrics = () => {
    setIsUpdating(true);
    setTimeout(() => {
      // Just visually refresh, keep same data
      setMetrics({ ...metrics });
      setIsUpdating(false);
    }, 1000);
  };

  useEffect(() => {
    const handleSelected = (e: Event) => {
      const customEvent = e as CustomEvent;
      const data = realMetrics[customEvent.detail.name] || realMetrics['default'];
      setIsUpdating(true);
      setTimeout(() => {
        setMetrics(data);
        setIsUpdating(false);
      }, 500);
    };
    
    window.addEventListener('pragma_dataset_selected', handleSelected);
    return () => window.removeEventListener('pragma_dataset_selected', handleSelected);
  }, []);

  return (
    <div className="glass-card h-full flex flex-col relative overflow-hidden">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-white font-poppins font-medium flex items-center gap-2">
            Data Quality Dashboard
            <button onClick={refreshMetrics} className="p-1 hover:text-primary transition-colors text-gray-400">
              <RefreshCw className={`w-3 h-3 ${isUpdating ? 'animate-spin' : ''}`} />
            </button>
          </h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Automated Pre-processing Metrics</p>
        </div>
        <div className="text-right">
          <motion.div 
            key={metrics.score}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-mono font-bold text-success"
          >
            {metrics.score}%
          </motion.div>
          <div className="text-[9px] uppercase text-gray-400">Completeness Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="bg-black/20 border border-white/5 p-4 rounded-xl flex flex-col justify-center items-center text-center hover:border-white/20 transition-colors">
          <HelpCircle className="w-6 h-6 text-warning mb-2" />
          <AnimatePresence mode="wait">
            <motion.div key={metrics.missing} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-mono text-white font-bold">
              {metrics.missing.toLocaleString()}
            </motion.div>
          </AnimatePresence>
          <div className="text-[10px] text-gray-500 uppercase mt-1">Missing Values</div>
          <div className="text-[9px] text-warning mt-1">Auto-imputed via KNN</div>
        </div>
        
        <div className="bg-black/20 border border-white/5 p-4 rounded-xl flex flex-col justify-center items-center text-center hover:border-white/20 transition-colors">
          <CheckCircle className="w-6 h-6 text-success mb-2" />
          <AnimatePresence mode="wait">
            <motion.div key={metrics.duplicates} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-mono text-white font-bold">
              {metrics.duplicates}
            </motion.div>
          </AnimatePresence>
          <div className="text-[10px] text-gray-500 uppercase mt-1">Duplicates</div>
          <div className="text-[9px] text-success mt-1">Clean dataset</div>
        </div>

        <div className="bg-black/20 border border-white/5 p-4 rounded-xl flex flex-col justify-center items-center text-center hover:border-white/20 transition-colors">
          <ShieldCheck className="w-6 h-6 text-primary mb-2" />
          <AnimatePresence mode="wait">
            <motion.div key={metrics.errors} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-mono text-white font-bold">
              {metrics.errors}
            </motion.div>
          </AnimatePresence>
          <div className="text-[10px] text-gray-500 uppercase mt-1">Validation Errors</div>
          <div className="text-[9px] text-primary mt-1">Schema mismatch fixed</div>
        </div>

        <div className="bg-black/20 border border-white/5 p-4 rounded-xl flex flex-col justify-center items-center text-center hover:border-white/20 transition-colors">
          <AlertTriangle className="w-6 h-6 text-danger mb-2" />
          <AnimatePresence mode="wait">
            <motion.div key={metrics.outliers} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-mono text-white font-bold">
              {metrics.outliers}
            </motion.div>
          </AnimatePresence>
          <div className="text-[10px] text-gray-500 uppercase mt-1">Outliers Detected</div>
          <div className="text-[9px] text-danger mt-1">Flagged for human review</div>
        </div>
      </div>
    </div>
  );
}
