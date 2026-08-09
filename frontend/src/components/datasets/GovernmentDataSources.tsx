import { Link2, Cloud, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

const initialSources = [
  { id: 1, name: 'Data.gov.in', status: 'Connected', sync: '1h ago', type: 'REST API' },
  { id: 2, name: 'IMD Weather', status: 'Connected', sync: '15m ago', type: 'WebSocket' },
  { id: 3, name: 'OpenStreetMap', status: 'Connected', sync: '1d ago', type: 'GraphQL' },
  { id: 4, name: 'Census 2021', status: 'Static', sync: 'Never', type: 'CSV Upload' },
  { id: 5, name: 'Smart Cities Mission', status: 'Error', sync: 'Failed', type: 'REST API' },
  { id: 6, name: 'TNEB Electricity Board', status: 'Connected', sync: '5m ago', type: 'REST API' },
];

export default function GovernmentDataSources() {
  const [sources, setSources] = useState(initialSources);
  const [pingingId, setPingingId] = useState<number | null>(null);
  const { addToast } = useToast();

  const handlePing = (id: number, name: string) => {
    setPingingId(id);
    setTimeout(() => {
      setSources(prev => prev.map(s => 
        s.id === id ? { ...s, status: 'Connected', sync: 'Just now' } : s
      ));
      setPingingId(null);
      addToast(`🔌 Connection to ${name} re-established.`, 'success');
    }, 1500);
  };

  return (
    <div className="glass-card flex-1 flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-white font-poppins font-medium">Data Connectors</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Gov Data Sources</p>
        </div>
        <Cloud className="w-5 h-5 text-primary" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
        {sources.map((src) => (
          <div key={src.id} className="bg-black/20 p-2.5 rounded-lg border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              {pingingId === src.id ? <RefreshCw className="w-4 h-4 text-primary animate-spin" /> :
               src.status === 'Connected' ? <CheckCircle2 className="w-4 h-4 text-success" /> : 
               src.status === 'Error' ? <AlertCircle className="w-4 h-4 text-danger animate-pulse" /> :
               <Link2 className="w-4 h-4 text-gray-500" />}
              <div>
                <div className="text-xs font-bold text-white">{src.name}</div>
                <div className="text-[9px] text-gray-500 font-mono">{src.type}</div>
              </div>
            </div>
            <div className="text-right flex items-center gap-3">
              <div className="text-right">
                <div className={`text-[9px] uppercase tracking-wider font-bold ${
                  src.status === 'Connected' ? 'text-success' : src.status === 'Error' ? 'text-danger' : 'text-gray-500'
                }`}>{src.status}</div>
                <div className="text-[9px] text-gray-500 font-mono">Sync: {src.sync}</div>
              </div>
              <button 
                onClick={() => handlePing(src.id, src.name)}
                disabled={pingingId !== null || src.status === 'Static'}
                className="opacity-0 group-hover:opacity-100 p-1.5 bg-black/40 hover:bg-primary/20 text-gray-400 hover:text-primary rounded transition-all disabled:opacity-0"
                title="Ping Connection"
              >
                <RefreshCw className={`w-3 h-3 ${pingingId === src.id ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
