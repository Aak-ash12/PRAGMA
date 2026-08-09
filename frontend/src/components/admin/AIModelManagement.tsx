import { Server, Settings, Zap } from 'lucide-react';

const models = [
  { name: 'Llama 3.1 (8B)', version: 'v1.2', status: 'Loaded', mem: '4.8 GB', temp: 0.2, tokens: '8192' },
  { name: 'Gemma (7B)', version: 'v1.0', status: 'Standby', mem: '0 GB', temp: 0.5, tokens: '8192' },
  { name: 'Mistral (v0.3)', version: 'v0.3', status: 'Standby', mem: '0 GB', temp: 0.7, tokens: '32768' },
  { name: 'Phi-3 (Mini)', version: 'v1.1', status: 'Standby', mem: '0 GB', temp: 0.1, tokens: '4096' },
];

export default function AIModelManagement() {
  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-white font-poppins font-medium">AI Model Management (Ollama)</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Local LLM Infrastructure</p>
        </div>
        <div className="text-xs font-mono text-primary bg-primary/10 border border-primary/30 px-2 py-1 rounded">VRAM: 4.8/24 GB</div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500 bg-black/20">
              <th className="p-3 font-medium">Model</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">VRAM</th>
              <th className="p-3 font-medium">Context</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {models.map((m, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="p-3 font-bold text-white flex items-center gap-2"><Server className="w-3 h-3 text-gray-500" /> {m.name}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold ${m.status === 'Loaded' ? 'text-success bg-success/10' : 'text-gray-500 bg-white/5'}`}>{m.status}</span>
                </td>
                <td className="p-3 font-mono text-gray-400">{m.mem}</td>
                <td className="p-3 font-mono text-gray-400">{m.tokens}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:text-success" title="Load Model"><Zap className="w-4 h-4" /></button>
                    <button className="p-1 hover:text-primary" title="Configure"><Settings className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
