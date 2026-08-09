import { ArrowRight, CheckCircle2, Play, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

const steps = [
  'Citizen Data',
  'Data Validation',
  'Agent Analysis',
  'Prediction',
  'Simulation',
  'Optimization',
  'Recommendation'
];

export default function ReasoningChain() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const { addToast } = useToast();

  const handleTrace = () => {
    setIsTracing(true);
    setActiveStep(0);
    
    steps.forEach((_, index) => {
      setTimeout(() => {
        setActiveStep(index);
        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsTracing(false);
            addToast('🧠 Reasoning trace execution completed successfully.', 'success');
          }, 500);
        }
      }, index * 800); // 800ms per step
    });
  };

  return (
    <div className="glass-card h-full flex flex-col justify-center relative overflow-hidden">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-white font-poppins font-medium">Reasoning Chain Trace</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">End-to-End Logic Pipeline</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleTrace}
          disabled={isTracing}
          className="text-[9px] uppercase tracking-wider font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors disabled:opacity-50 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20"
        >
          {isTracing ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Play className="w-3 h-3" />
          )}
          {isTracing ? 'Executing Trace...' : 'Trace Logic'}
        </motion.button>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 w-full">
        {steps.map((step, i) => {
          const isActive = activeStep === i;
          const isPast = activeStep !== null && activeStep > i;
          const isFinalStep = i === steps.length - 1;
          
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <motion.div 
                animate={{
                  scale: isActive ? 1.05 : 1,
                  boxShadow: isActive ? '0 0 15px rgba(37,99,235,0.5)' : 'none'
                }}
                className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${
                  isActive ? 'bg-primary border-primary text-white' :
                  isPast || (activeStep === null && isFinalStep) ? 'bg-primary/20 border-primary/50 text-white' :
                  'bg-black/30 border-white/10 text-gray-400'
                }`}
              >
                {(isPast || (activeStep === null && isFinalStep)) && <CheckCircle2 className="w-4 h-4 text-primary" />}
                {isActive && <Loader2 className="w-4 h-4 text-white animate-spin" />}
                {step}
              </motion.div>
              {i < steps.length - 1 && (
                <div className="relative">
                  <div className={`w-8 h-0.5 transition-colors duration-300 ${
                    isActive || isPast ? 'bg-primary' : 'bg-gradient-to-r from-gray-600 to-gray-400'
                  }`}></div>
                  <ArrowRight className={`w-4 h-4 absolute -right-1 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                    isActive || isPast ? 'text-primary' : 'text-gray-400'
                  }`} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
