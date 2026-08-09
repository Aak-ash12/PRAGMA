import { BrainCircuit, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIExecutiveSummary() {
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed'>('idle');

  useEffect(() => {
    const handleGenerating = () => setStatus('generating');
    const handleCompleted = () => setStatus('completed');

    window.addEventListener('pragma_report_generating', handleGenerating);
    window.addEventListener('pragma_report_completed', handleCompleted);

    return () => {
      window.removeEventListener('pragma_report_generating', handleGenerating);
      window.removeEventListener('pragma_report_completed', handleCompleted);
    };
  }, []);

  return (
    <div className="glass-card flex flex-col relative overflow-hidden group min-h-[300px]">
      <div className="absolute top-4 right-4">
        {status === 'generating' ? (
          <Loader2 className="w-6 h-6 text-accentPurple animate-spin" />
        ) : (
          <BrainCircuit className={`w-6 h-6 text-accentPurple transition-opacity ${status === 'completed' ? 'opacity-100' : 'opacity-30'}`} />
        )}
      </div>

      <div className="mb-4 relative z-10">
        <h3 className="text-white font-poppins font-medium">AI Generated Executive Summary</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Preview for Government Governance Report</p>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center text-gray-500 text-xs py-10"
            >
              Select parameters and click "Compile & Generate Report" to generate AI insights.
            </motion.div>
          )}

          {status === 'generating' && (
            <motion.div 
              key="generating"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 space-y-4"
            >
              <div className="relative">
                <BrainCircuit className="w-12 h-12 text-primary animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              </div>
              <div className="text-sm font-mono text-primary animate-pulse">Synthesizing Intelligence...</div>
            </motion.div>
          )}

          {status === 'completed' && (
            <motion.div 
              key="completed"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-4 text-xs text-gray-300"
            >
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="bg-black/20 p-4 rounded-lg border border-white/5 leading-relaxed"
              >
                <span className="text-primary font-bold">Executive Overview: </span> 
                Based on aggregate simulation data from Q3 2023, the state shows a 94% governance efficiency score. However, predictive modeling indicates a severe risk convergence in the Healthcare and Infrastructure sectors within the next 45 days due to impending monsoon patterns.
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
                  className="bg-danger/5 border border-danger/20 p-3 rounded-lg"
                >
                  <div className="text-[10px] text-danger uppercase font-bold tracking-wider mb-1">Major Risks Identified</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>15% ICU capacity deficit in Chennai.</li>
                    <li>Waterlogging on NH-45 causing supply chain halts.</li>
                  </ul>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
                  className="bg-success/5 border border-success/20 p-3 rounded-lg"
                >
                  <div className="text-[10px] text-success uppercase font-bold tracking-wider mb-1">Top Recommendations</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Pre-allocate ₹400Cr for temporary triage centers.</li>
                    <li>Deploy preemptive road maintenance teams to Sector 4.</li>
                  </ul>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                className="grid grid-cols-3 gap-3"
              >
                <div className="p-3 bg-white/5 rounded border border-white/10 text-center">
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Budget Impact</div>
                  <div className="font-mono font-bold text-white">₹850 Cr Required</div>
                </div>
                <div className="p-3 bg-white/5 rounded border border-white/10 text-center">
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Expected Outcome</div>
                  <div className="font-mono font-bold text-success">-42% Risk Reduction</div>
                </div>
                <div className="p-3 bg-white/5 rounded border border-white/10 text-center">
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">AI Confidence</div>
                  <div className="font-mono font-bold text-primary">96.8%</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
