import { MapPin, Edit2 } from 'lucide-react';

const districts = [
  { name: 'Chennai', pop: '14.2M', risk: 'Critical', officer: 'Meena K.' },
  { name: 'Coimbatore', pop: '4.5M', risk: 'High', officer: 'Rajesh S.' },
  { name: 'Madurai', pop: '3.8M', risk: 'Moderate', officer: 'Priya V.' },
  { name: 'Salem', pop: '2.1M', risk: 'Critical', officer: 'Arun K.' },
];

export default function DistrictManagement() {
  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium">District Management</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Geographic Zones</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
        {districts.map((d, i) => (
          <div key={i} className="bg-black/20 p-3 rounded-lg border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
              <div>
                <div className="text-xs font-bold text-white mb-0.5">{d.name}</div>
                <div className="text-[9px] text-gray-500 font-mono">Pop: {d.pop} | Officer: {d.officer}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${d.risk === 'Critical' ? 'bg-danger/20 text-danger' : d.risk === 'High' ? 'bg-warning/20 text-warning' : 'bg-secondary/20 text-secondary'}`}>
                {d.risk}
              </span>
              <button className="opacity-0 group-hover:opacity-100 p-1 hover:text-primary transition-all"><Edit2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-3 py-2 bg-black/30 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors text-xs uppercase tracking-wider">
        Manage All Districts
      </button>
    </div>
  );
}
