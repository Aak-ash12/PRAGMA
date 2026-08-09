import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

const initialLogs = [
  { id: 1, time: '08:00:15', event: 'Data Loaded', desc: 'Ingested 1.2M records from 7 state APIs.', status: 'success' },
  { id: 2, time: '08:02:40', event: 'Prediction Started', desc: 'LLM Coordinator initiated heuristic evaluation.', status: 'success' },
  { id: 3, time: '08:05:12', event: 'Simulation Completed', desc: '10,000 Monte Carlo simulations run for validation.', status: 'success' },
  { id: 4, time: '08:06:05', event: 'Recommendation Generated', desc: 'Top policy formulated with 96% confidence.', status: 'success' },
  { id: 5, time: '08:06:10', event: 'Policy Approved', desc: 'Human-in-the-loop authorization completed.', status: 'success' },
];

const mockNewLogs = [
  { event: 'Background Check', desc: 'Cross-referencing budget constraints.', status: 'success' },
  { event: 'Sensor Ping', desc: 'IoT gateway returned nominal latency.', status: 'success' },
  { event: 'Heuristic Re-eval', desc: 'Model drifted by 0.02%, auto-corrected.', status: 'warning' },
  { event: 'API Sync', desc: 'Weather API updated successfully.', status: 'success' },
];

export default function AIAuditLog() {
  const [logs, setLogs] = useState(initialLogs);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 20) clearInterval(interval);
      
      const newLogData = mockNewLogs[Math.floor(Math.random() * mockNewLogs.length)];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const newLog = {
        id: Date.now(),
        time: timeStr,
        event: newLogData.event,
        desc: newLogData.desc,
        status: newLogData.status
      };

      setLogs(prev => {
        const updated = [newLog, ...prev].slice(0, 8); // Keep last 8
        return updated;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card h-[250px] flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/10">
          <Activity className="w-3 h-3 text-primary animate-pulse" />
          <span className="text-[9px] text-gray-300 font-mono tracking-widest">Live Stream</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium">AI Audit Log</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Immutable execution timeline</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="relative border-l border-white/10 ml-3 space-y-4 pb-4">
          <AnimatePresence>
            {logs.map((log) => (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                className="relative pl-6"
              >
                <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 ${
                  log.status === 'success' ? 'bg-black border-success' : 
                  log.status === 'warning' ? 'bg-black border-warning' : 
                  'bg-black border-accentPurple animate-pulse'
                }`}></div>
                <div className="flex items-start gap-4">
                  <div className={`text-[10px] font-mono mt-0.5 ${log.status === 'success' ? 'text-gray-500' : log.status === 'warning' ? 'text-warning' : 'text-accentPurple font-bold'}`}>{log.time}</div>
                  <div>
                    <div className={`text-sm font-bold ${log.status === 'success' ? 'text-white' : log.status === 'warning' ? 'text-warning' : 'text-gray-400'}`}>{log.event}</div>
                    <div className="text-xs text-gray-400">{log.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
