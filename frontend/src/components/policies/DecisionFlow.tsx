import { motion } from 'framer-motion';
import { ArrowRight, RotateCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';

const flow = [
  { label: 'Citizen Data', desc: 'IoT Sensors, Surveys, Demographics', icon: '📊' },
  { label: 'AI Agents', desc: 'Mesa ABM + LLM Swarm', icon: '🤖' },
  { label: 'Prediction', desc: 'XGBoost + Prophet + SIR', icon: '📈' },
  { label: 'Optimization', desc: 'Multi-Objective Solver', icon: '⚙️' },
  { label: 'Govt Policy', desc: 'Human-in-the-Loop Review', icon: '🏛️' },
  { label: 'Expected Outcome', desc: 'Digital Twin Simulation', icon: '✅' }
];

interface Props {
  activePolicy?: any;
}

export default function DecisionFlow({ activePolicy }: Props) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setActiveStep(null);
  }, [activePolicy]);

  const handleStepClick = (index: number) => {
    setActiveStep(activeStep === index ? null : index);
  };

  const handleRerunPipeline = () => {
    setIsRunning(true);
    let step = 0;
    const interval = setInterval(() => {
      setActiveStep(step);
      step++;
      if (step >= flow.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRunning(false);
          setActiveStep(null);
          addToast('🔄 Decision pipeline re-executed successfully! All stages validated.', 'success');
        }, 600);
      }
    }, 500);
  };

  return (
    <div className="glass-card flex flex-col justify-center">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-poppins font-medium text-sm">Decision Flow Architecture</h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRerunPipeline}
          disabled={isRunning}
          className="text-[9px] uppercase tracking-wider font-bold text-gray-400 hover:text-primary flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <RotateCw className={`w-3 h-3 ${isRunning ? 'animate-spin text-primary' : ''}`} />
          {isRunning ? 'Running...' : 'Re-Run Pipeline'}
        </motion.button>
      </div>
      
      <div className="flex justify-between items-start w-full flex-wrap gap-2">
        {flow.map((step, i) => (
          <div key={i} className="flex items-start gap-2">
            <motion.div
              onClick={() => handleStepClick(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative cursor-pointer px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-300 ${
                activeStep === i 
                  ? 'bg-primary/30 border-primary/70 text-primary shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105' 
                  : i === flow.length - 2 
                    ? 'bg-primary/20 border-primary/50 text-primary shadow-[0_0_10px_rgba(37,99,235,0.3)]' 
                    : i === flow.length - 1 
                      ? 'bg-success/20 border-success/50 text-success' 
                      : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{step.icon}</span>
                <span>{step.label}</span>
              </div>
              
              {/* Tooltip on click */}
              {activeStep === i && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#0D1527] border border-primary/30 rounded-lg px-3 py-2 text-[10px] text-gray-300 whitespace-nowrap z-20 shadow-xl"
                >
                  <div className="text-primary font-bold mb-0.5">Stage {i + 1}</div>
                  {step.desc}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0D1527] border-l border-t border-primary/30 rotate-45" />
                </motion.div>
              )}

              {/* Running indicator */}
              {isRunning && activeStep === i && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </motion.div>
            {i < flow.length - 1 && (
              <motion.div
                animate={{ 
                  color: isRunning && activeStep !== null && i < activeStep ? '#3B82F6' : '#4B5563',
                  scale: isRunning && activeStep === i ? [1, 1.3, 1] : 1 
                }}
                transition={{ duration: 0.3 }}
                className="mt-2"
              >
                <ArrowRight className="w-3 h-3" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
