import { FileText, Clock, CheckCircle2, Calendar, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';

const initialStats = [
  { id: 'total', label: 'Total Reports', val: 1248, icon: FileText, color: 'text-primary', bg: 'bg-primary/20' },
  { id: 'today', label: 'Generated Today', val: 14, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/20' },
  { id: 'sched', label: 'Scheduled', val: 32, icon: Calendar, color: 'text-warning', bg: 'bg-warning/20' },
  { id: 'pend', label: 'Pending', val: 3, icon: Clock, color: 'text-accentPurple', bg: 'bg-accentPurple/20' },
];

export default function ReportDashboard() {
  const [stats, setStats] = useState(initialStats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const handleCompleted = () => {
      setStats(prev => prev.map(s => {
        if (s.id === 'total' || s.id === 'today') return { ...s, val: s.val + 1 };
        if (s.id === 'pend') return { ...s, val: Math.max(0, s.val - 1) };
        return s;
      }));
    };

    window.addEventListener('pragma_report_completed', handleCompleted);
    return () => window.removeEventListener('pragma_report_completed', handleCompleted);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setStats(prev => prev.map(s => {
        if (s.id === 'sched') return { ...s, val: Math.floor(Math.random() * 20 + 20) };
        if (s.id === 'pend') return { ...s, val: Math.floor(Math.random() * 5) };
        return s;
      }));
      setIsRefreshing(false);
      addToast('🔄 Dashboard metrics refreshed.', 'success');
    }, 800);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 flex items-center gap-4 group hover:bg-white/5 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <motion.div 
                key={stat.val}
                initial={{ opacity: 0.5, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xl font-mono font-bold text-white leading-tight"
              >
                {stat.val.toLocaleString()}
              </motion.div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          </motion.div>
        );
      })}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors group"
        onClick={handleRefresh}
      >
        <RefreshCw className={`w-6 h-6 text-gray-400 group-hover:text-primary mb-2 transition-colors ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
        <div className="text-[10px] text-gray-500 uppercase tracking-wider group-hover:text-primary transition-colors">
          Sync Metrics
        </div>
      </motion.div>
    </div>
  );
}
