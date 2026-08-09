import { AlertOctagon, CheckCircle2, Database, MapPin, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DecisionExplanation() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="glass-card h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-success/10 rounded border border-success/20">
          <Activity className="w-3 h-3 text-success animate-pulse" />
          <span className="text-[9px] text-success font-bold uppercase tracking-widest">Live Trace</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium">Decision Explanation</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Causal Analysis & Evidence Trace</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 grid grid-cols-2 gap-4"
      >
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
          className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon className="w-4 h-4 text-danger" />
            <span className="text-[10px] text-danger uppercase font-bold tracking-wider">Identified Problem</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Predictive models indicate a 40% surge in respiratory cases based on current climate trajectory and early symptom reports. Existing ICU capacity will be overwhelmed in 14 days.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(37,99,235,0.15)' }}
          className="bg-primary/10 p-4 rounded-xl border border-primary/20 flex flex-col justify-center transition-colors shadow-[0_0_15px_rgba(37,99,235,0.05)]"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Expected Outcome</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            By preemptively allocating ₹2,500 Cr, state hospitals can scale ventilator inventory and deploy temporary triage centers, successfully mitigating the projected 15% mortality risk factor.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
          className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-secondary" />
            <span className="text-[10px] text-secondary uppercase font-bold tracking-wider">Data & Evidence Used</span>
          </div>
          <ul className="text-xs text-gray-300 list-disc list-inside space-y-1">
            <li>Meteorological forecast (IMD API)</li>
            <li>Real-time bed telemetry (State Health Dept)</li>
            <li>Historical viral outbreak patterns (2018-2023)</li>
            <li>Pharmaceutical supply chain inventory</li>
          </ul>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
          className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center transition-colors"
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-warning" />
            <span className="text-[10px] text-warning uppercase font-bold tracking-wider">Primarily Affected Districts</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="px-2 py-1 bg-black/40 border border-white/10 text-[10px] text-white rounded font-bold hover:border-warning/50 transition-colors cursor-default">Chennai</span>
            <span className="px-2 py-1 bg-black/40 border border-white/10 text-[10px] text-white rounded font-bold hover:border-warning/50 transition-colors cursor-default">Coimbatore</span>
            <span className="px-2 py-1 bg-black/40 border border-white/10 text-[10px] text-white rounded font-bold hover:border-warning/50 transition-colors cursor-default">Tiruvallur</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
