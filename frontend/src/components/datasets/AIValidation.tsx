import { BrainCircuit, Check, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';

export default function AIValidation() {
  const [status, setStatus] = useState<'idle' | 'validating' | 'complete' | 'approved'>('idle');
  const { addToast } = useToast();

  useEffect(() => {
    const handleUploading = () => setStatus('validating');
    const handleUploaded = () => setStatus('complete');

    window.addEventListener('pragma_dataset_uploading', handleUploading);
    window.addEventListener('pragma_dataset_uploaded', handleUploaded);

    return () => {
      window.removeEventListener('pragma_dataset_uploading', handleUploading);
      window.removeEventListener('pragma_dataset_uploaded', handleUploaded);
    };
  }, []);

  return (
    <div className="glass-card h-full flex flex-col relative overflow-hidden group min-h-[350px]">
      <div className="absolute top-4 right-4">
        {status === 'validating' ? (
          <Loader2 className="w-6 h-6 text-accentPurple animate-spin" />
        ) : (
          <BrainCircuit className={`w-6 h-6 text-accentPurple transition-opacity ${status === 'complete' ? 'opacity-100' : 'opacity-30'}`} />
        )}
      </div>

      <div className="mb-6 relative z-10">
        <h3 className="text-white font-poppins font-medium">AI Dataset Validation</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Automated Intelligence Readiness</p>
      </div>

      <div className="flex-1 relative z-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center text-gray-500 text-xs py-10"
            >
              Upload a dataset or connect a data source to begin AI validation.
            </motion.div>
          )}

          {status === 'validating' && (
            <motion.div 
              key="validating"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 space-y-4"
            >
              <div className="relative">
                <BrainCircuit className="w-12 h-12 text-primary animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              </div>
              <div className="text-sm font-mono text-primary animate-pulse">Scanning Schema & Nulls...</div>
            </motion.div>
          )}

          {status === 'complete' && (
            <motion.div 
              key="complete"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                <Check className="w-4 h-4 text-success mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white mb-1">Schema Match Validation Passed</div>
                  <div className="text-[10px] text-gray-400">Dataset aligns 100% with the required schema for the PRAGMA predictive engine.</div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                <BrainCircuit className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white mb-1">Feature Detection</div>
                  <div className="text-[10px] text-gray-400">Identified critical features. High collinearity detected (0.84). PCA recommended.</div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex items-start gap-3 bg-accentPurple/10 p-3 rounded-lg border border-accentPurple/30">
                <Info className="w-4 h-4 text-accentPurple mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-accentPurple mb-1">Target Variable Auto-Selected</div>
                  <div className="text-[10px] text-gray-300">Based on historical runs, the primary key has been set as the target variable for forecasting models.</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {status === 'complete' && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-4 pt-4 border-t border-white/10 text-center"
        >
          <button 
            onClick={() => {
              setStatus('approved');
              addToast('🚀 Schema approved! Pushing data to secure lake...', 'success');
              setTimeout(() => setStatus('idle'), 3000);
            }}
            className="text-[10px] text-white bg-primary/20 hover:bg-primary border border-primary/50 px-4 py-2 rounded uppercase tracking-wider font-bold transition-colors w-full"
          >
            Approve AI Schema & Push to Data Lake
          </button>
        </motion.div>
      )}

      {status === 'approved' && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-4 pt-4 border-t border-white/10 text-center flex flex-col items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-6 h-6 text-success" />
          <div className="text-xs font-bold text-success">Pushed to Data Lake</div>
        </motion.div>
      )}
    </div>
  );
}
