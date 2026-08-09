import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { motion } from 'framer-motion';

interface SimulationControlsProps {
  onPlay?: () => void;
  activePeriod: string;
  onPeriodChange: (p: string) => void;
  activeSpeed: string;
  onSpeedChange: (s: string) => void;
}

type SimStatus = 'stopped' | 'playing' | 'paused';

export default function SimulationControls({ onPlay, activePeriod, onPeriodChange, activeSpeed, onSpeedChange }: SimulationControlsProps) {
  const [status, setStatus] = useState<SimStatus>('stopped');
  const { addToast } = useToast();

  const handlePlay = () => {
    setStatus('playing');
    addToast('Simulation started. Executing Live AI Timeline...', 'success');
    if (onPlay) onPlay();
  };

  const handlePause = () => {
    setStatus('paused');
    addToast('Simulation paused.', 'info');
  };

  const handleStop = () => {
    setStatus('stopped');
    addToast('Simulation aborted.', 'error');
  };

  const handleReset = () => {
    setStatus('stopped');
    onSpeedChange('1x');
    onPeriodChange('30 Days');
    addToast('Simulation parameters reset to default.', 'warning');
  };

  const handleSetPeriod = (p: string) => {
    onPeriodChange(p);
    addToast(`Simulation horizon set to ${p}.`, 'info');
  };

  const handleSetSpeed = (s: string) => {
    onSpeedChange(s);
    addToast(`Playback speed set to ${s}.`, 'info');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 justify-end">
        {['7 Days', '30 Days', '90 Days', '1 Year'].map(p => (
          <button 
            key={p} 
            onClick={() => handleSetPeriod(p)}
            className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded border transition-colors ${activePeriod === p ? 'bg-primary border-primary text-white' : 'bg-transparent border-white/20 text-gray-400 hover:border-primary/50'}`}
          >
            {p}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-4 glass-card p-2 px-4 rounded-full">
        <div className="flex gap-2">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay} 
            className={`p-2 rounded-full transition-colors group ${status === 'playing' ? 'bg-success/30 text-success' : 'text-success hover:bg-success/20'}`}
          >
            <Play className={`w-5 h-5 ${status === 'playing' ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]'}`} />
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handlePause}
            className={`p-2 rounded-full transition-colors group ${status === 'paused' ? 'bg-warning/30 text-warning' : 'text-warning hover:bg-warning/20'}`}
          >
            <Pause className={`w-5 h-5 ${status === 'paused' ? 'drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'}`} />
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleStop}
            className={`p-2 text-danger hover:bg-danger/20 rounded-full transition-colors group ${status === 'stopped' ? 'opacity-50' : ''}`}
          >
            <Square className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleReset}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
        
        <div className="w-px h-6 bg-white/10"></div>
        
        <div className="flex gap-1">
          {['1x', '2x', '5x', '10x'].map(s => (
            <button 
              key={s} 
              onClick={() => handleSetSpeed(s)}
              className={`px-2 py-1 text-xs rounded font-mono transition-colors ${activeSpeed === s ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
