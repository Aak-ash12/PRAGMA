import { Brain, Clock, ShieldCheck, Target, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';

export default function DecisionSummary() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState({
    target: 'Increase healthcare budget by 14% to mitigate incoming viral outbreak.',
    confidence: 96.8,
    risk: 'Medium',
    time: 412,
  });
  const { addToast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        confidence: Math.min(99.9, prev.confidence + (Math.random() * 2 - 1)),
        time: Math.floor(Math.random() * 200 + 300),
      }));
      setIsRefreshing(false);
      addToast('📊 AI summary refreshed with latest model outputs.', 'success');
    }, 1200);
  };

  return (
    <div className="glass-card h-full flex flex-col justify-center relative overflow-hidden">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-white font-poppins font-medium">AI Decision Summary</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Top Recommendation Overview</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-[9px] uppercase tracking-wider font-bold text-gray-400 hover:text-primary flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          {isRefreshing ? 'Recalculating...' : 'Refresh Analysis'}
        </motion.button>
      </div>

      <div className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="bg-black/20 p-3 rounded-xl border border-white/5"
        >
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Target Prediction</div>
          <div className="text-sm text-white font-medium">{metrics.target}</div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex gap-2">
            <Target className="w-4 h-4 text-success flex-shrink-0" />
            <div>
              <div className="text-[9px] text-gray-500 uppercase">Confidence</div>
              <motion.div 
                key={metrics.confidence}
                initial={{ opacity: 0.5, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-xs font-mono font-bold text-success"
              >
                {metrics.confidence.toFixed(1)}%
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex gap-2">
            <ShieldCheck className="w-4 h-4 text-warning flex-shrink-0" />
            <div>
              <div className="text-[9px] text-gray-500 uppercase">Risk Level</div>
              <div className="text-xs font-mono font-bold text-warning">{metrics.risk}</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex gap-2">
            <Brain className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <div className="text-[9px] text-gray-500 uppercase">Decision Status</div>
              <div className="text-xs font-bold text-primary uppercase">Ready for Review</div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex gap-2">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div>
              <div className="text-[9px] text-gray-500 uppercase">Processing Time</div>
              <motion.div 
                key={metrics.time}
                initial={{ opacity: 0.5, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-xs font-mono font-bold text-white"
              >
                {metrics.time} ms
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="pt-2 border-t border-white/5 text-right flex justify-between items-center">
          {isRefreshing && <span className="text-[9px] text-primary animate-pulse font-mono">Re-evaluating vector weights...</span>}
          <span className="text-[9px] text-gray-600 font-mono ml-auto">AI Engine: PRAGMA Core v4.2.1-llm</span>
        </div>
      </div>
    </div>
  );
}
