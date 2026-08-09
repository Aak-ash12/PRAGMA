import { motion } from 'framer-motion';
import { BrainCircuit, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function AgentDecisionConsole() {
  return (
    <div className="glass-card w-full h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-0"></div>
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <div>
          <h3 className="text-white font-poppins font-medium">AI Decision Console</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">LLM Coordinator Reasoning</p>
        </div>
        <BrainCircuit className="w-5 h-5 text-accentPurple animate-pulse" />
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar relative z-10 pr-2">
        {/* Live Reasoning Animation */}
        <div className="p-3 border border-accentPurple/30 bg-accentPurple/5 rounded-xl">
          <div className="text-[10px] text-accentPurple uppercase tracking-wider mb-2 font-bold">Live Reasoning Chain</div>
          <div className="space-y-1 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-success" /> Collecting district data...</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-success" /> Analyzing hospital occupancy...</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-success" /> Running resource optimization...</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-accentPurple border-t-transparent animate-spin"></span> 
              <span className="text-white">Generating policy recommendation...</span>
            </div>
          </div>
        </div>

        {/* Final Decision Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 border border-primary/50 bg-primary/10 rounded-xl relative overflow-hidden group hover:bg-primary/20 transition-colors"
        >
          <div className="absolute top-0 right-0 p-2">
            <span className="px-2 py-1 bg-primary text-white text-[9px] font-bold uppercase rounded tracking-wider">Ready for Review</span>
          </div>
          
          <h4 className="text-sm font-bold text-white mb-1 pr-16">Deploy Tier-2 Medical Resupply</h4>
          
          <div className="flex gap-4 mb-3">
            <div>
              <div className="text-[9px] text-gray-500 uppercase">Priority</div>
              <div className="text-xs text-danger font-bold flex items-center gap-1"><AlertOctagon className="w-3 h-3" /> Critical</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500 uppercase">Confidence</div>
              <div className="text-xs text-success font-bold">98.2%</div>
            </div>
          </div>
          
          <p className="text-xs text-gray-300 mb-4 line-clamp-2">
            Based on a 15% surge in respiratory admissions reported by the Hospital Agent over the last 12 hours, predictive models suggest current oxygen reserves will deplete by 0400 hours. Immediate resupply is required.
          </p>

          <div className="flex gap-2 w-full">
            <button className="flex-1 py-2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
              Approve Action
            </button>
            <button className="flex-1 py-2 glass text-white text-xs font-bold rounded hover:bg-white/10 transition-colors">
              Request Alternatives
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
