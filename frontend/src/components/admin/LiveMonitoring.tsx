import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { time: '10:00', cpu: 30, ram: 50, req: 120 },
  { time: '10:05', cpu: 45, ram: 55, req: 150 },
  { time: '10:10', cpu: 42, ram: 58, req: 140 },
  { time: '10:15', cpu: 65, ram: 65, req: 220 },
  { time: '10:20', cpu: 48, ram: 68, req: 180 },
  { time: '10:25', cpu: 42, ram: 68, req: 160 },
];

export default function LiveMonitoring() {
  return (
    <div className="glass-card h-[220px] flex flex-col">
      <div className="mb-2 flex justify-between items-center">
        <div>
          <h3 className="text-white font-poppins font-medium text-sm">Live Telemetry</h3>
        </div>
        <div className="flex gap-2 text-[9px] uppercase tracking-wider text-gray-500 font-bold">
          <span className="text-warning">CPU</span>
          <span className="text-primary">RAM</span>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#9CA3AF" fontSize={9} tickLine={false} axisLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={9} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', fontSize: '10px' }} />
            <Line type="monotone" dataKey="cpu" stroke="#F59E0B" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="ram" stroke="#2563EB" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
