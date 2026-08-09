import { Shield, User, FileText, Activity } from 'lucide-react';

const logs = [
  { time: '10:42:15', user: 'Admin User', action: 'Failed login attempt from IP 192.168.1.104', type: 'security' },
  { time: '10:35:22', user: 'System', action: 'Simulation [Flood_Risk_Q3] completed successfully.', type: 'system' },
  { time: '10:15:00', user: 'Dr. Priya V.', action: 'Generated PDF Report: Healthcare Assessment.', type: 'action' },
  { time: '09:45:12', user: 'Arun Kumar', action: 'Suspended user account: Meena K.', type: 'admin' },
  { time: '09:30:00', user: 'System', action: 'Daily database backup completed (2.4TB).', type: 'system' },
];

export default function AuditLogs() {
  return (
    <div className="glass-card h-[350px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium">Audit Logs</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">System-wide Event Timeline</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="relative border-l border-white/10 ml-3 space-y-4 pb-4 mt-2">
          {logs.map((log, i) => (
            <div key={i} className="relative pl-6">
              <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full flex items-center justify-center bg-black border ${
                log.type === 'security' ? 'border-danger text-danger' : 
                log.type === 'system' ? 'border-primary text-primary' : 
                log.type === 'admin' ? 'border-warning text-warning' : 'border-success text-success'
              }`}>
                {log.type === 'security' ? <Shield className="w-2.5 h-2.5" /> : 
                 log.type === 'system' ? <Activity className="w-2.5 h-2.5" /> : 
                 log.type === 'admin' ? <User className="w-2.5 h-2.5" /> : <FileText className="w-2.5 h-2.5" />}
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-[10px] font-mono text-gray-500">{log.time}</div>
                  <div className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{log.user}</div>
                </div>
                <div className="text-[11px] text-gray-300">{log.action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
