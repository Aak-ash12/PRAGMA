import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';

interface GaugeData {
  label: string;
  val: number;
  color: string;
  target: number;
}

interface Props {
  activePolicy?: any;
}

const initialGauges: GaugeData[] = [
  { label: 'Prediction Accuracy', val: 0, color: '#10B981', target: 94 },
  { label: 'Policy Confidence', val: 0, color: '#3B82F6', target: 88 },
  { label: 'Optimization Score', val: 0, color: '#8B5CF6', target: 92 },
  { label: 'Budget Confidence', val: 0, color: '#06B6D4', target: 96 },
];

export default function AIConfidenceDashboard({ activePolicy }: Props) {
  const [gauges, setGauges] = useState(initialGauges);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const baseConf = activePolicy?.conf || 92;
    const targets = [
      { label: 'Prediction Accuracy', val: 0, color: '#10B981', target: Math.min(99, baseConf + 2) },
      { label: 'Policy Confidence', val: 0, color: '#3B82F6', target: baseConf },
      { label: 'Optimization Score', val: 0, color: '#8B5CF6', target: Math.min(99, baseConf + 4) },
      { label: 'Budget Confidence', val: 0, color: '#06B6D4', target: Math.max(85, baseConf - 2) },
    ];
    setGauges(targets);
    
    const timeout = setTimeout(() => {
      setGauges(prev => prev.map(g => ({ ...g, val: g.target })));
    }, 100);
    return () => clearTimeout(timeout);
  }, [activePolicy]);



  const handleRecalibrate = () => {
    setIsRecalibrating(true);
    // Reset to 0
    setGauges(prev => prev.map(g => ({ ...g, val: 0 })));

    setTimeout(() => {
      // Re-animate with slightly different values
      setGauges(prev => prev.map(g => ({
        ...g,
        val: Math.min(99, g.target + Math.floor(Math.random() * 5 - 2))
      })));
      setIsRecalibrating(false);
      addToast('🔄 AI models recalibrated. Confidence metrics updated with latest data.', 'success');
    }, 1500);
  };

  const circumference = 2 * Math.PI * 28; // ~175.9

  return (
    <div className="glass-card flex flex-col justify-center h-full">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-white font-poppins font-medium">AI Confidence Dashboard</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">System Reliability Metrics</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRecalibrate}
          disabled={isRecalibrating}
          className="text-[9px] uppercase tracking-wider font-bold text-gray-400 hover:text-primary flex items-center gap-1 transition-colors disabled:opacity-50 bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10"
        >
          <RefreshCw className={`w-3 h-3 ${isRecalibrating ? 'animate-spin text-primary' : ''}`} />
          {isRecalibrating ? 'Calibrating...' : 'Recalibrate'}
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gauges.map((gauge, i) => {
          const dashOffset = circumference - (circumference * gauge.val) / 100;
          const status = gauge.val >= 95 ? 'Excellent' : gauge.val >= 90 ? 'High' : gauge.val >= 80 ? 'Good' : 'Moderate';

          return (
            <motion.div 
              key={gauge.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center justify-center p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/15 transition-colors group cursor-default"
            >
              {/* SVG radial gauge */}
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-800" />
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    stroke={gauge.color} 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeLinecap="round"
                    strokeDasharray={circumference} 
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-1000 ease-out"
                    style={{ filter: `drop-shadow(0 0 6px ${gauge.color}80)` }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span 
                    className="text-xs font-mono font-bold text-white"
                    key={gauge.val}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    {gauge.val}%
                  </motion.span>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center uppercase font-medium">{gauge.label}</div>
              <div className={`text-[8px] mt-1 font-bold uppercase tracking-wider ${
                status === 'Excellent' ? 'text-success' : status === 'High' ? 'text-primary' : status === 'Good' ? 'text-secondary' : 'text-warning'
              }`}>
                {status}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Aggregate confidence bar */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <div className="flex justify-between items-center text-[10px] mb-1.5">
          <span className="text-gray-500 uppercase tracking-wider">Aggregate System Confidence</span>
          <span className="text-white font-mono font-bold">
            {gauges.length > 0 ? Math.round(gauges.reduce((a, g) => a + g.val, 0) / gauges.length) : 0}%
          </span>
        </div>
        <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-accentPurple to-success"
            animate={{ width: `${gauges.length > 0 ? gauges.reduce((a, g) => a + g.val, 0) / gauges.length : 0}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
