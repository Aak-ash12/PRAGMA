import { Database, Search } from 'lucide-react';

const tables = [
  { name: 'Users', rows: '1,245', storage: '12 MB', health: 'Optimal' },
  { name: 'Datasets', rows: '142', storage: '18.4 TB', health: 'Optimal' },
  { name: 'Policies', rows: '8,420', storage: '45 MB', health: 'Optimal' },
  { name: 'Predictions', rows: '142,000', storage: '840 MB', health: 'Optimal' },
  { name: 'Simulations', rows: '450', storage: '2.1 GB', health: 'Warning' },
  { name: 'Reports', rows: '1,248', storage: '340 MB', health: 'Optimal' },
  { name: 'Logs', rows: '4.2M', storage: '4.8 GB', health: 'Indexing' },
];

export default function DatabaseMonitor() {
  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-white font-poppins font-medium">Database Monitor</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">SQLite / Vector DB Stats</p>
        </div>
        <Database className="w-5 h-5 text-gray-500" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
        {tables.map((t, i) => (
          <div key={i} className="bg-black/20 p-2.5 rounded-lg border border-white/5 flex justify-between items-center hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-gray-500" />
              <div className="text-xs font-bold text-white">{t.name}</div>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400">
              <span className="w-16 text-right">{t.rows}</span>
              <span className="w-16 text-right text-gray-500">{t.storage}</span>
              <span className={`w-16 text-right font-bold uppercase tracking-wider ${t.health === 'Optimal' ? 'text-success' : t.health === 'Warning' ? 'text-warning' : 'text-primary animate-pulse'}`}>{t.health}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
