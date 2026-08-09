import { Globe, ArrowRight } from 'lucide-react';

const endpoints = [
  { path: '/api/v1/auth/login', method: 'POST', latency: '42ms', status: '200 OK' },
  { path: '/api/v1/data/upload', method: 'POST', latency: '210ms', status: '201 Created' },
  { path: '/api/v1/simulation/run', method: 'POST', latency: '8.4s', status: '202 Accepted' },
  { path: '/api/v1/predictions/health', method: 'GET', latency: '12ms', status: '200 OK' },
  { path: '/api/v1/agents/status', method: 'GET', latency: '8ms', status: '200 OK' },
  { path: '/api/v1/reports/generate', method: 'POST', latency: '1.2s', status: '500 Error' },
  { path: '/api/v1/users/list', method: 'GET', latency: '24ms', status: '200 OK' },
];

export default function APIMonitor() {
  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-white font-poppins font-medium">API Monitor</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">FastAPI Endpoint Latency</p>
        </div>
        <Globe className="w-5 h-5 text-gray-500" />
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500 bg-black/20">
              <th className="p-3 font-medium">Method</th>
              <th className="p-3 font-medium">Endpoint</th>
              <th className="p-3 font-medium text-right">Latency</th>
              <th className="p-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {endpoints.map((ep, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-3">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    ep.method === 'GET' ? 'bg-primary/20 text-primary' : 
                    ep.method === 'POST' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                  }`}>{ep.method}</span>
                </td>
                <td className="p-3 font-mono text-gray-400">{ep.path}</td>
                <td className="p-3 text-right font-mono text-[10px]">{ep.latency}</td>
                <td className="p-3 text-right">
                  <span className={`text-[10px] font-bold ${ep.status.includes('20') ? 'text-success' : 'text-danger'}`}>{ep.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
