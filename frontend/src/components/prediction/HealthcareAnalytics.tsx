import { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { ShieldAlert, Plus, Minus, CheckCircle2, Zap } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function HealthcareAnalytics({ data: propData }: Props) {
  const initialItems = [
    { id: 'hosp', name: 'Hospital Occ.', value: 78, max: 100, fill: '#EF4444', desc: 'General & Emergency ward bed occupancy' },
    { id: 'icu', name: 'ICU Beds', value: 92, max: 100, fill: '#F59E0B', desc: 'Critical care ventilator unit strain' },
    { id: 'er', name: 'ER Cases', value: 45, max: 100, fill: '#3B82F6', desc: 'Hourly emergency admissions' },
    { id: 'meds', name: 'Meds Stock', value: 65, max: 100, fill: '#10B981', desc: 'Essential pharmaceutical reserves' },
    { id: 'docs', name: 'Dr. Avail.', value: 85, max: 100, fill: '#8B5CF6', desc: 'On-duty medical staff capacity' },
    { id: 'amb', name: 'Ambulance', value: 70, max: 100, fill: '#EC4899', desc: 'Active dispatch fleet status' },
  ];

  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [surgeMode, setSurgeMode] = useState<boolean>(false);
  const [isDeployed, setIsDeployed] = useState<boolean>(() => localStorage.getItem('pragma_directive_deployed') === 'true');
  const { addToast } = useToast();

  useEffect(() => {
    const handleUpdate = () => {
      const deployed = localStorage.getItem('pragma_directive_deployed') === 'true';
      setIsDeployed(deployed);
      if (deployed) {
        setItems([
          { id: 'hosp', name: 'Hospital Occ.', value: 48, max: 100, fill: '#10B981', desc: 'Directive #PRAGMA-2026: Bed occupancy pressure mitigated' },
          { id: 'icu', name: 'ICU Beds', value: 42, max: 100, fill: '#10B981', desc: 'Directive #PRAGMA-2026: 150 Field Ventilator Units active' },
          { id: 'er', name: 'ER Cases', value: 30, max: 100, fill: '#3B82F6', desc: 'Hourly emergency admissions stabilized' },
          { id: 'meds', name: 'Meds Stock', value: 95, max: 100, fill: '#10B981', desc: 'Pharmaceutical reserves fully replenished (+30%)' },
          { id: 'docs', name: 'Dr. Avail.', value: 98, max: 100, fill: '#8B5CF6', desc: 'Reserve medical staff mobilized' },
          { id: 'amb', name: 'Ambulance', value: 92, max: 100, fill: '#EC4899', desc: '+25 Emergency units dispatched' },
        ]);
        setSurgeMode(true);
      }
    };
    handleUpdate();
    window.addEventListener('pragma_directive_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('pragma_directive_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateVal = (id: string, delta: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, value: Math.min(100, Math.max(10, item.value + delta)) }
          : item
      )
    );
  };

  const toggleSurgeMode = () => {
    const newSurge = !surgeMode;
    setSurgeMode(newSurge);

    if (newSurge) {
      setItems(prev =>
        prev.map(item => {
          if (item.id === 'icu' || item.id === 'hosp') return { ...item, value: Math.max(30, item.value - 25) };
          if (item.id === 'meds' || item.id === 'docs' || item.id === 'amb') return { ...item, value: Math.min(100, item.value + 20) };
          return item;
        })
      );
      addToast('Emergency Healthcare Surge Protocol Activated! Deploying +500 Field Beds.', 'success');
    } else {
      setItems(initialItems);
      addToast('Healthcare Surge Protocol Deactivated. Returned to baseline.', 'info');
    }
  };

  const activeItem = items.find(i => i.id === selectedId);

  return (
    <div className="glass-card h-[420px] flex flex-col justify-between">
      <div className="mb-2 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-poppins font-medium text-base">Healthcare Analytics</h3>
            {surgeMode && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-danger/20 text-danger border border-danger/30 font-bold uppercase animate-pulse">
                Surge Mode Active
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Capacity & Resource Utilization (%)</p>
        </div>

        <button
          onClick={toggleSurgeMode}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
            surgeMode
              ? 'bg-danger text-white border-danger shadow-md shadow-danger/30'
              : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          {surgeMode ? 'Deactivate Surge' : 'Activate Surge Protocol'}
        </button>
      </div>

      {/* Interactive Bar Chart */}
      <div className="flex-1 w-full h-[210px] cursor-pointer">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={items}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            onClick={(state) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                setSelectedId(state.activePayload[0].payload.id);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} width={85} />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.08)' }} contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
              {items.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={entry.id === selectedId ? '#2563EB' : entry.fill}
                  stroke={entry.id === selectedId ? '#ffffff' : 'none'}
                  strokeWidth={2}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Workable Resource Adjustment Bar */}
      <div className="mt-2 pt-2 border-t border-white/10">
        <div className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-wider">Workable Capacity Adjuster:</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {items.map(item => (
            <div key={item.id} className="bg-black/30 p-1.5 rounded-lg border border-white/5 flex flex-col items-center justify-between text-center">
              <span className="text-[9px] font-bold text-gray-300 truncate w-full">{item.name}</span>
              <span className="text-xs font-mono font-bold text-white my-0.5">{item.value}%</span>
              <div className="flex gap-1">
                <button
                  onClick={() => updateVal(item.id, -5)}
                  className="w-4 h-4 rounded bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center text-[10px] font-bold"
                >
                  -
                </button>
                <button
                  onClick={() => updateVal(item.id, 5)}
                  className="w-4 h-4 rounded bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center text-[10px] font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface Props {
  data?: any[];
}

