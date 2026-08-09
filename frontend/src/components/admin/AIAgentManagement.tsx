import { BrainCircuit, RefreshCw, Square, FileText } from 'lucide-react';

const agents = [
  { name: 'LLM Coordinator', status: 'Active', cpu: '12%', mem: '1.2GB' },
  { name: 'Healthcare Agent', status: 'Active', cpu: '8%', mem: '840MB' },
  { name: 'Traffic Agent', status: 'Active', cpu: '15%', mem: '1.4GB' },
  { name: 'Water Agent', status: 'Idle', cpu: '1%', mem: '210MB' },
  { name: 'Electricity Agent', status: 'Active', cpu: '22%', mem: '1.8GB' },
  { name: 'Agriculture Agent', status: 'Idle', cpu: '0%', mem: '150MB' },
  { name: 'Emergency Agent', status: 'Active', cpu: '4%', mem: '520MB' },
  { name: 'Policy Agent', status: 'Processing', cpu: '45%', mem: '3.2GB' },
];

export default function AIAgentManagement() {
  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium">AI Agent Management (CrewAI)</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Multi-Agent Swarm Status</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        {agents.map((agent, i) => (
          <div key={i} className="bg-black/20 p-3 rounded-lg border border-white/5 flex flex-col justify-between group hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <BrainCircuit className={`w-4 h-4 ${agent.status === 'Active' ? 'text-success' : agent.status === 'Processing' ? 'text-warning animate-pulse' : 'text-gray-500'}`} />
                <span className="text-xs font-bold text-white">{agent.name}</span>
              </div>
            </div>
            
            <div className="flex justify-between text-[9px] text-gray-400 font-mono mb-3">
              <span>CPU: {agent.cpu}</span>
              <span>MEM: {agent.mem}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
              <span className={`text-[9px] uppercase tracking-wider font-bold ${agent.status === 'Active' ? 'text-success' : agent.status === 'Processing' ? 'text-warning' : 'text-gray-500'}`}>{agent.status}</span>
              <div className="flex gap-2">
                <button className="hover:text-primary transition-colors" title="Restart"><RefreshCw className="w-3 h-3" /></button>
                <button className="hover:text-danger transition-colors" title="Stop"><Square className="w-3 h-3" /></button>
                <button className="hover:text-secondary transition-colors" title="View Logs"><FileText className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
