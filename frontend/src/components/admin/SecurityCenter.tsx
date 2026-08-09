import { ShieldCheck, Key, Lock, AlertTriangle, Network } from 'lucide-react';

export default function SecurityCenter() {
  return (
    <div className="glass-card h-[350px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium">Security Center</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Access & Encryption Status</p>
      </div>

      <div className="flex-1 space-y-3">
        <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg"><ShieldCheck className="w-4 h-4 text-success" /></div>
            <div>
              <div className="text-xs font-bold text-white">JWT Auth</div>
              <div className="text-[9px] text-gray-500">Tokens expiring every 24h</div>
            </div>
          </div>
          <div className="text-[10px] font-bold text-success uppercase">Active</div>
        </div>

        <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Lock className="w-4 h-4 text-primary" /></div>
            <div>
              <div className="text-xs font-bold text-white">DB Encryption</div>
              <div className="text-[9px] text-gray-500">AES-256 Volume level</div>
            </div>
          </div>
          <div className="text-[10px] font-bold text-success uppercase">Active</div>
        </div>

        <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg"><Network className="w-4 h-4 text-warning" /></div>
            <div>
              <div className="text-xs font-bold text-white">Govt API Keys</div>
              <div className="text-[9px] text-gray-500">3 Keys nearing expiration</div>
            </div>
          </div>
          <div className="text-[10px] font-bold text-warning uppercase">Warning</div>
        </div>

        <div className="bg-black/20 p-3 rounded-lg border border-danger/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger/10 rounded-lg"><AlertTriangle className="w-4 h-4 text-danger" /></div>
            <div>
              <div className="text-xs font-bold text-white">Failed Logins</div>
              <div className="text-[9px] text-gray-500">14 attempts in last 1hr</div>
            </div>
          </div>
          <button className="text-[10px] bg-danger/20 text-danger border border-danger/50 px-2 py-1 rounded hover:bg-danger hover:text-white transition-colors">Review</button>
        </div>
      </div>
    </div>
  );
}
