import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '../../contexts/ToastContext';

interface Props {
  timelineStep?: number; // 0 to 5
  activePolicy?: any;
}

const stepLabels = [
  'Data Collection',
  'Simulation',
  'Optimization',
  'Policy Generated',
  'Govt. Approval',
  'Resource Allocation'
];

const stepDetails: Record<number, string> = {
  0: 'Collecting real-time IoT sensor data, demographic surveys, and satellite imagery...',
  1: 'Running Mesa ABM agent simulation with 10 concurrent agents...',
  2: 'XGBoost multi-objective optimization across 38 districts...',
  3: 'Policy document generated with AI confidence scoring...',
  4: 'Awaiting government human-in-the-loop approval...',
  5: 'Deploying resources to allocated districts via Digital Twin...'
};

export default function RecommendationTimeline({ timelineStep = 3, activePolicy }: Props) {
  const [currentStep, setCurrentStep] = useState(timelineStep);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    setCurrentStep(3); // Reset to "Policy Generated" state
  }, [activePolicy]);

  const progressPercent = Math.min(100, Math.max(0, (currentStep / (stepLabels.length - 1)) * 100));

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= stepLabels.length - 1) {
            setIsAutoPlaying(false);
            addToast('🎯 Full pipeline cycle complete! All 6 stages executed.', 'success');
            return 0;
          }
          return prev + 1;
        });
      }, 1200);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    addToast(`📌 Jumped to Stage ${index + 1}: ${stepLabels[index]}`, 'info');
  };

  const handleNext = () => {
    if (currentStep < stepLabels.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      addToast('✅ Already at final stage. Reset to restart.', 'warning');
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsAutoPlaying(false);
    addToast('🔄 Timeline reset to Data Collection stage.', 'info');
  };

  return (
    <div className="glass-card flex-1 flex flex-col justify-center">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-poppins font-medium text-sm">Policy Generation Timeline</h3>
        <div className="flex items-center gap-2">
          {/* Controls */}
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title={isAutoPlaying ? 'Pause' : 'Auto-play'}
            >
              {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Next step"
            >
              <SkipForward className="w-3 h-3" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
          <span className="text-[9px] font-mono text-primary font-bold bg-primary/20 border border-primary/30 px-2 py-0.5 rounded">
            STAGE {currentStep + 1} / {stepLabels.length}
          </span>
        </div>
      </div>

      {/* Current stage detail */}
      <div className="mb-4 px-2">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[10px] text-gray-400 italic bg-black/20 px-3 py-1.5 rounded border border-white/5"
        >
          {stepDetails[currentStep]}
        </motion.div>
      </div>
      
      <div className="relative flex justify-between items-center w-full px-2">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0"></div>
        <motion.div 
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-primary z-0"
          animate={{ width: `calc(${progressPercent}% - 24px)` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        
        {stepLabels.map((label, i) => {
          const status = i < currentStep ? 'completed' : i === currentStep ? 'active' : 'pending';
          return (
            <motion.div 
              key={i} 
              className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => handleStepClick(i)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  scale: status === 'active' ? [1, 1.15, 1] : 1,
                  boxShadow: status === 'active' 
                    ? '0 0 15px rgba(245,158,11,0.6)' 
                    : status === 'completed' 
                      ? '0 0 10px rgba(37,99,235,0.5)' 
                      : '0 0 0 transparent'
                }}
                transition={{ 
                  scale: { repeat: status === 'active' ? Infinity : 0, duration: 1.5 },
                  boxShadow: { duration: 0.3 }
                }}
                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  status === 'completed' ? 'bg-primary border-primary' :
                  status === 'active' ? 'bg-black border-warning' :
                  'bg-black border-gray-600 hover:border-gray-400'
                }`}
              >
                {status === 'completed' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                {status === 'active' && <div className="w-1.5 h-1.5 bg-warning rounded-full"></div>}
              </motion.div>
              <div className={`text-[9px] uppercase tracking-wider text-center max-w-[60px] transition-colors ${
                status === 'completed' ? 'text-gray-300 font-bold' :
                status === 'active' ? 'text-warning font-bold' :
                'text-gray-600 hover:text-gray-400'
              }`}>
                {label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
