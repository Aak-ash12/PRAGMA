import { History, ArrowUpCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const initialHistory = [
  { id: 1, version: 'v4.2', date: 'Today, 08:30 AM', user: 'Auto-Sync (Gov API)', action: 'Delta update appended 14,200 rows.', type: 'sync' },
  { id: 2, version: 'v4.1', date: 'Yesterday, 14:15 PM', user: 'AI Pre-processor', action: 'Cleaned 1,204 missing values in income col.', type: 'ai' },
  { id: 3, version: 'v4.0', date: 'Oct 12, 09:00 AM', user: 'Admin User', action: 'Initial bulk upload of Census 2023 CSV.', type: 'upload' },
];

export default function VersionHistory() {
  const [history, setHistory] = useState(initialHistory);

  useEffect(() => {
    const handleUploaded = () => {
      setHistory(prev => [
        {
          id: Date.now(),
          version: `v4.${prev.length + 1}`,
          date: 'Just now',
          user: 'Admin User',
          action: 'Uploaded new dataset to secure enclave.',
          type: 'upload'
        },
        ...prev
      ]);
    };
    window.addEventListener('pragma_dataset_uploaded', handleUploaded);
    return () => window.removeEventListener('pragma_dataset_uploaded', handleUploaded);
  }, []);

  return (
    <div className="glass-card h-[250px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium">Version History</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Dataset Modification Timeline</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="relative border-l border-white/10 ml-3 space-y-4 pb-4 mt-2">
          <AnimatePresence>
            {history.map((log, i) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                className="relative pl-6"
              >
                <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full flex items-center justify-center bg-black border ${
                  log.type === 'sync' ? 'border-primary text-primary' : 
                  log.type === 'ai' ? 'border-accentPurple text-accentPurple' : 'border-success text-success'
                }`}>
                  {log.type === 'sync' ? <RefreshCw className="w-2.5 h-2.5" /> : 
                   log.type === 'ai' ? <History className="w-2.5 h-2.5" /> : <ArrowUpCircle className="w-2.5 h-2.5" />}
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs font-bold text-white">{log.version} <span className="text-[10px] font-normal text-gray-500 ml-2">by {log.user}</span></div>
                    <div className="text-[10px] font-mono text-gray-500">{log.date}</div>
                  </div>
                  <div className="text-[11px] text-gray-400">{log.action}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
