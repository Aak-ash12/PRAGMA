import { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Download, Search, Filter, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialData = [
  { id: 1, name: 'Population Census 2026', source: 'State Govt', rows: '14.2M', cols: 42, size: '4.2 GB', status: 'Synced', updated: '2h ago' },
  { id: 2, name: 'State Hospital Occupancy', source: 'Health Dept API', rows: '450K', cols: 18, size: '840 MB', status: 'Synced', updated: '15m ago' },
  { id: 3, name: 'Chennai Traffic Flow', source: 'Traffic Police', rows: '8.4M', cols: 24, size: '2.1 GB', status: 'Syncing...', updated: 'Now' },
  { id: 4, name: 'Monsoon Rainfall Data', source: 'IMD API', rows: '1.2M', cols: 12, size: '320 MB', status: 'Synced', updated: '1d ago' },
  { id: 5, name: 'Reservoir Water Levels', source: 'Water Board', rows: '84K', cols: 8, size: '45 MB', status: 'Synced', updated: '4h ago' },
  { id: 6, name: 'Power Grid Load Metrics', source: 'TNEB', rows: '3.4M', cols: 16, size: '1.2 GB', status: 'Error', updated: '2d ago' },
  { id: 7, name: 'Agricultural Yield 2023', source: 'Agri Dept', rows: '890K', cols: 32, size: '940 MB', status: 'Synced', updated: '1w ago' },
  { id: 8, name: 'State Budget Allocation', source: 'Finance Dept', rows: '12K', cols: 45, size: '12 MB', status: 'Synced', updated: '1m ago' },
];

export default function DatasetLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (dataset: any) => {
    setSelectedId(dataset.id);
    const event = new CustomEvent('pragma_dataset_selected', { detail: dataset });
    window.dispatchEvent(event);
  };

  return (
    <div className="glass-card h-[500px] flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-white font-poppins font-medium">Dataset Library</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Governing Data Sources</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search datasets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/30 border border-white/10 text-white text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-primary/50 transition-colors w-64"
            />
          </div>
          <button className="bg-black/30 border border-white/10 text-gray-300 p-2 rounded-lg hover:text-white hover:border-white/30 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500 bg-black/20">
              <th className="p-3 font-medium rounded-tl-lg">Dataset Name</th>
              <th className="p-3 font-medium">Source</th>
              <th className="p-3 font-medium">Rows</th>
              <th className="p-3 font-medium">Cols</th>
              <th className="p-3 font-medium">Size</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Updated</th>
              <th className="p-3 font-medium text-right rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <AnimatePresence>
              {initialData.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).map((d) => (
                <motion.tr 
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => handleSelect(d)}
                  className={`border-b border-white/5 transition-colors group cursor-pointer ${
                    selectedId === d.id ? 'bg-primary/20 border-primary/50' : 'hover:bg-white/5'
                  }`}
                >
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <Database className={`w-4 h-4 ${selectedId === d.id ? 'text-primary' : 'text-gray-500'}`} />
                    {d.name}
                  </td>
                  <td className="p-3 text-gray-400">{d.source}</td>
                  <td className="p-3 font-mono">{d.rows}</td>
                  <td className="p-3 font-mono">{d.cols}</td>
                  <td className="p-3 font-mono text-gray-400">{d.size}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      d.status === 'Synced' ? 'bg-success/20 text-success' :
                      d.status === 'Syncing...' ? 'bg-warning/20 text-warning animate-pulse' :
                      'bg-danger/20 text-danger'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 font-mono text-[10px]">{d.updated}</td>
                  <td className="p-3 text-right">
                    <div className={`flex justify-end gap-2 transition-opacity ${selectedId === d.id ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                      <button className="p-1 hover:text-primary transition-colors" title="Preview"><Eye className="w-4 h-4" /></button>
                      <button className="p-1 hover:text-warning transition-colors" title="Edit Meta"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-1 hover:text-success transition-colors" title="Download"><Download className="w-4 h-4" /></button>
                      <button className="p-1 hover:text-danger transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
