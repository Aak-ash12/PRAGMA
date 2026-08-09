import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialLogs = [
  { time: '09:30:11', text: '[Citizen Agent] detected increased population density in Sector 4.' },
  { time: '09:31:05', text: '[Hospital Agent] predicts ICU overload at General Hospital.' },
  { time: '09:32:42', text: '[Emergency Agent] recommends ambulance deployment.' },
  { time: '09:33:15', text: '[Government Agent] evaluating policy constraints for deployment.' },
  { time: '09:34:02', text: '[LLM Coordinator] generated final intervention recommendation.' },
];

export default function AgentCommunicationLog() {
  const [logs, setLogs] = useState(initialLogs);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulate incoming logs
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const newLogs = [
        '[Traffic Agent] rerouting logistics via Highway 7.',
        '[Water Agent] pressure drop detected in Reservoir B.',
        '[Electricity Agent] load balancing initiated for industrial zone.',
        '[Hospital Agent] oxygen supply levels verified.'
      ];
      
      setLogs(prev => {
        const newLog = { time: timeString, text: newLogs[Math.floor(Math.random() * newLogs.length)] };
        const updated = [...prev, newLog];
        if (updated.length > 50) return updated.slice(updated.length - 50);
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card w-full h-full p-0 flex flex-col overflow-hidden relative">
      <div className="bg-black/40 border-b border-white/5 p-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-400" />
          <h3 className="text-white font-mono text-sm tracking-wider uppercase">Live Communication Log</h3>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-danger"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-warning"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 bg-[#050B14] font-mono text-xs custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {logs.map((log, index) => {
            const isAgent = log.text.includes('[');
            const agentName = isAgent ? log.text.substring(log.text.indexOf('[') + 1, log.text.indexOf(']')) : '';
            let color = 'text-gray-400';
            if (agentName.includes('Hospital')) color = 'text-success';
            if (agentName.includes('Traffic')) color = 'text-warning';
            if (agentName.includes('Emergency')) color = 'text-danger';
            if (agentName.includes('LLM')) color = 'text-accentPurple';
            if (agentName.includes('Government')) color = 'text-primary';

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-2 leading-relaxed"
              >
                <span className="text-gray-600 mr-3">[{log.time}]</span>
                <span className="text-gray-300">
                  {isAgent ? (
                    <>
                      <span className={`${color} font-bold`}>[{agentName}]</span>
                      {log.text.substring(log.text.indexOf(']') + 1)}
                    </>
                  ) : (
                    log.text
                  )}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Blinking cursor */}
        <div className="mt-2 flex items-center">
          <span className="text-gray-600 mr-3">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
          <span className="w-2 h-4 bg-primary animate-pulse"></span>
        </div>
      </div>
    </div>
  );
}
