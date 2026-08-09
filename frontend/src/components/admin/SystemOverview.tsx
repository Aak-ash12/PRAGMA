import { Activity, Cpu, HardDrive, Database, Server, BrainCircuit, Webhook, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'System Health', val: '99.9%', icon: Activity, color: 'text-success', bg: 'bg-success/20' },
  { label: 'CPU Usage', val: '42%', icon: Cpu, color: 'text-warning', bg: 'bg-warning/20' },
  { label: 'Memory Usage', val: '68%', icon: HardDrive, color: 'text-primary', bg: 'bg-primary/20' },
  { label: 'Disk Usage', val: '2.4 TB', icon: Database, color: 'text-secondary', bg: 'bg-secondary/20' },
  { label: 'Database Status', val: 'Healthy', icon: Database, color: 'text-success', bg: 'bg-success/20' },
  { label: 'Backend API', val: 'Online', icon: Server, color: 'text-success', bg: 'bg-success/20' },
  { label: 'AI Engine', val: 'Active', icon: BrainCircuit, color: 'text-accentPurple', bg: 'bg-accentPurple/20' },
  { label: 'WebSocket', val: 'Connected', icon: Webhook, color: 'text-success', bg: 'bg-success/20' },
];

export default function SystemOverview() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex flex-col justify-center gap-2 relative overflow-hidden group"
          >
            <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-100 transition-opacity">
              <ShieldCheck className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <div className="text-xl font-mono font-bold text-white leading-tight">{stat.val}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
