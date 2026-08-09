import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Filter } from 'lucide-react';

const allDistricts = [
  { name: 'Chennai', risk: 'Critical', pred: 'ICU capacity breached in 14 days.', reason: 'Dense population + monsoon convergence.', action: 'Allocate ₹400Cr for temp triage.', localData: '142 hospitals tracking', conf: '96%', pop: '4.5M' },
  { name: 'Coimbatore', risk: 'High Risk', pred: 'Localized water scarcity.', reason: 'Reservoir inflow deficit.', action: 'Deploy mobile water distribution.', localData: '24 reservoirs tracking', conf: '88%', pop: '2.1M' },
  { name: 'Madurai', risk: 'Moderate', pred: 'Traffic gridlock on NH-44.', reason: 'Festival weekend exodus.', action: 'Pre-emptive AI traffic rerouting.', localData: '314 traffic cameras', conf: '92%', pop: '1.5M' },
  { name: 'Salem', risk: 'Critical', pred: 'Industrial grid brownout.', reason: 'Peak load exceeds supply by 15%.', action: 'Initiate load shedding protocol.', localData: 'Smart grid sensors', conf: '99%', pop: '1.2M' },
  { name: 'Trichy', risk: 'Safe', pred: 'Normal operations.', reason: 'Resources balanced.', action: 'Maintain current state.', localData: 'All nominal', conf: '94%', pop: '1.8M' },
];

export default function DistrictAnalysis() {
  const [filter, setFilter] = useState<string>('All');
  const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null);

  const filteredDistricts = filter === 'All' 
    ? allDistricts 
    : allDistricts.filter(d => d.risk.includes(filter) || (filter === 'Critical' && d.risk === 'Critical'));

  return (
    <div className="glass-card overflow-hidden relative">
      <div className="mb-4 flex justify-between items-end">
        <div>
          <h3 className="text-white font-poppins font-medium">District-Level XAI Analysis</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Localized Context</p>
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="w-3 h-3 text-gray-400" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-black/30 border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="All" className="bg-[#0D1527]">All Districts</option>
            <option value="Critical" className="bg-[#0D1527]">Critical Only</option>
            <option value="High" className="bg-[#0D1527]">High Risk</option>
            <option value="Moderate" className="bg-[#0D1527]">Moderate</option>
            <option value="Safe" className="bg-[#0D1527]">Safe</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-[220px]">
        <AnimatePresence mode="popLayout">
          {filteredDistricts.map((d, i) => (
            <motion.div 
              key={d.name}
              layout
              onClick={() => setExpandedDistrict(expandedDistrict === d.name ? null : d.name)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.03, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.1)' }}
              transition={{ duration: 0.2 }}
              className={`p-3 bg-black/20 border border-white/5 rounded-xl transition-colors group flex flex-col justify-between shadow-lg cursor-pointer ${expandedDistrict === d.name ? 'ring-1 ring-primary/50 bg-white/5' : ''}`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{d.name}</h4>
                  <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                    d.risk === 'Critical' ? 'bg-danger/20 text-danger border border-danger/30' : 
                    d.risk === 'High Risk' ? 'bg-warning/20 text-warning border border-warning/30' : 
                    d.risk === 'Moderate' ? 'bg-secondary/20 text-secondary border border-secondary/30' : 'bg-success/20 text-success border border-success/30'
                  }`}>{d.risk}</span>
                </div>
                
                <div className="mb-2">
                  <div className="text-[9px] text-gray-500 uppercase mb-0.5">Prediction</div>
                  <div className="text-xs text-gray-300 leading-tight">{d.pred}</div>
                </div>
                
                <div className="mb-3">
                  <div className="text-[9px] text-gray-500 uppercase mb-0.5">Reason</div>
                  <div className="text-[11px] text-gray-400 italic leading-tight">{d.reason}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 mt-auto">
                <div className="text-[9px] text-primary uppercase font-bold mb-0.5">Suggested Action</div>
                <div className="text-xs text-white leading-tight">{d.action}</div>
              </div>

              <AnimatePresence>
                {expandedDistrict === d.name && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden border-t border-white/10"
                  >
                    <div className="pt-3 grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest">Confidence</div>
                        <div className="text-[11px] font-mono font-bold text-success">{d.conf}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest">Pop. Impact</div>
                        <div className="text-[11px] font-mono font-bold text-white">{d.pop}</div>
                      </div>
                      <div className="col-span-2 mt-1">
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest">Data Source</div>
                        <div className="text-[10px] text-gray-400">{d.localData}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
