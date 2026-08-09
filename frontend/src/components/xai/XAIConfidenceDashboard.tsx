import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const initialGauges = [
  { label: 'Prediction Confidence', val: 96.2, color: '#10B981' },
  { label: 'Simulation Confidence', val: 92.5, color: '#3B82F6' },
  { label: 'Recommendation Confidence', val: 94.8, color: '#8B5CF6' },
  { label: 'Optimization Confidence', val: 89.1, color: '#F59E0B' },
];

export default function XAIConfidenceDashboard() {
  const [gauges, setGauges] = useState(initialGauges);

  useEffect(() => {
    const interval = setInterval(() => {
      setGauges(prev => prev.map(g => {
        // Fluctuate by -0.3 to +0.3
        const change = (Math.random() * 0.6) - 0.3;
        const newVal = Math.min(99.9, Math.max(85, g.val + change));
        return { ...g, val: Number(newVal.toFixed(1)) };
      }));
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card h-[400px] flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping"></span>
          <span className="text-[8px] text-gray-500 uppercase tracking-widest font-mono">Live</span>
        </div>
      </div>

      <div className="mb-6 text-center">
        <h3 className="text-white font-poppins font-medium">Confidence Dashboard</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Sub-system Reliability (Real-time)</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {gauges.map((gauge, i) => (
          <motion.div 
            key={gauge.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center justify-center p-2 group"
          >
            <div className="relative w-20 h-20 mb-3 transition-transform group-hover:scale-110 duration-300">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-800" />
                <circle 
                  cx="40" 
                  cy="40" 
                  r="36" 
                  stroke={gauge.color} 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray={226} 
                  strokeDashoffset={226 - (226 * gauge.val) / 100}
                  className="transition-all duration-1000 drop-shadow-md"
                  style={{ filter: `drop-shadow(0 0 6px ${gauge.color}60)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  key={gauge.val}
                  initial={{ opacity: 0.5, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-mono font-bold text-white leading-none"
                >
                  {gauge.val}%
                </motion.span>
              </div>
            </div>
            <div className="text-[9px] text-gray-400 text-center uppercase tracking-wider h-6">{gauge.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
