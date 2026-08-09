import { Database, HardDrive, Clock, BrainCircuit, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function DatasetOverview() {
  const [datasets, setDatasets] = useState(142);
  const [records, setRecords] = useState(2.4);
  const [lastUpdated, setLastUpdated] = useState('2m ago');

  useEffect(() => {
    const handleUploaded = () => {
      setDatasets(prev => prev + 1);
      setRecords(prev => parseFloat((prev + 0.1).toFixed(1)));
      setLastUpdated('Just now');
    };
    
    window.addEventListener('pragma_dataset_uploaded', handleUploaded);
    return () => window.removeEventListener('pragma_dataset_uploaded', handleUploaded);
  }, []);

  const stats = [
    { label: 'Total Datasets', val: datasets.toString(), icon: Database, color: 'text-primary', bg: 'bg-primary/20' },
    { label: 'Total Records', val: `${records}B`, icon: FileSpreadsheet, color: 'text-success', bg: 'bg-success/20' },
    { label: 'Storage Used', val: '18.4 TB', icon: HardDrive, color: 'text-warning', bg: 'bg-warning/20' },
    { label: 'Last Updated', val: lastUpdated, icon: Clock, color: 'text-secondary', bg: 'bg-secondary/20' },
    { label: 'Active AI Models', val: '14', icon: BrainCircuit, color: 'text-accentPurple', bg: 'bg-accentPurple/20' },
  ];

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
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <motion.div 
                key={stat.val}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xl font-mono font-bold text-white leading-tight"
              >
                {stat.val}
              </motion.div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
