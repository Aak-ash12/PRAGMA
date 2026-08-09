import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Activity, Cpu, Database, Zap, Clock } from 'lucide-react';

interface AgentInspectorProps {
  selectedAgent: string | null;
}

export default function AgentInspector({ selectedAgent }: AgentInspectorProps) {
  if (!selectedAgent) return null;

  return (
    <div className="glass-card w-full h-full flex flex-col relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50 pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accentPurple p-[2px]">
            <div className="w-full h-full bg-[#111827] rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">{selectedAgent.substring(0, 2).toUpperCase()}</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-poppins font-bold text-white leading-tight">{selectedAgent}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              <span className="text-[10px] text-success uppercase tracking-wider font-bold">Online & Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar relative z-10 pr-2">
        <div className="p-3 bg-black/20 border border-white/5 rounded-xl">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Current Task</div>
          <div className="text-sm text-gray-300 font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            Evaluating district-level infrastructure constraints...
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-black/20 border border-white/5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-500 uppercase">Confidence</span>
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
            </div>
            <div className="text-xl font-mono text-white">96.4%</div>
          </div>
          <div className="p-3 bg-black/20 border border-white/5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-500 uppercase">Latency</span>
              <Clock className="w-3.5 h-3.5 text-secondary" />
            </div>
            <div className="text-xl font-mono text-white">42ms</div>
          </div>
          <div className="p-3 bg-black/20 border border-white/5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-500 uppercase">CPU Usage</span>
              <Cpu className="w-3.5 h-3.5 text-warning" />
            </div>
            <div className="text-xl font-mono text-white">48.2%</div>
          </div>
          <div className="p-3 bg-black/20 border border-white/5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-500 uppercase">Memory</span>
              <Database className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="text-xl font-mono text-white">1.2 GB</div>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Decision History</div>
          <div className="space-y-2">
            <div className="p-2 border-l-2 border-success bg-white/5 rounded-r-lg text-xs text-gray-400">
              <span className="text-gray-500 font-mono mr-2">10:42 AM</span> Authorized reroute of 5 emergency vehicles.
            </div>
            <div className="p-2 border-l-2 border-primary bg-white/5 rounded-r-lg text-xs text-gray-400">
              <span className="text-gray-500 font-mono mr-2">10:35 AM</span> Completed simulation of Sector 4 power grid.
            </div>
            <div className="p-2 border-l-2 border-warning bg-white/5 rounded-r-lg text-xs text-gray-400">
              <span className="text-gray-500 font-mono mr-2">10:15 AM</span> Raised warning for water level drop in Reservoir B.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
