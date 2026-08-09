import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  delay?: number;
  progress?: number;
  onClick?: () => void;
  badge?: {
    text: string;
    color: 'success' | 'warning' | 'danger';
  };
}

export default function KPICard({ title, value, subtitle, delay = 0, progress, badge, onClick }: KPICardProps) {
  const badgeColors = {
    success: 'bg-success/20 text-success border-success/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    danger: 'bg-danger/20 text-danger border-danger/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      className="glass-card relative overflow-hidden group p-5 cursor-pointer hover:border-primary/60 hover:shadow-[0_0_20px_rgba(37,99,235,0.25)] transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex justify-between items-start mb-2 relative z-10">
        <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</h3>
        {badge && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${badgeColors[badge.color]}`}>
            {badge.text}
          </span>
        )}
      </div>
      
      <div className="flex items-end justify-between relative z-10 mt-1">
        <div>
          <div className="text-3xl font-mono font-bold text-white">{value}</div>
          {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
        </div>
        
        {progress !== undefined && (
          <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-700" />
              <circle 
                cx="24" 
                cy="24" 
                r="20" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="transparent" 
                strokeDasharray={125.6} 
                strokeDashoffset={125.6 - (125.6 * progress) / 100}
                className="text-primary drop-shadow-[0_0_5px_rgba(37,99,235,0.8)] transition-all duration-1000" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white">
              {progress}%
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
