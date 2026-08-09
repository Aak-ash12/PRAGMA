import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const forecastByPeriod: Record<string, {
  current: string;
  predicted: string;
  netMigration: string;
  growthRate: string;
  data: { date: string; current: number | null; predicted: number }[];
}> = {
  '7 Days': {
    current: '83.20M',
    predicted: '83.23M',
    netMigration: '+2.4k',
    growthRate: '+0.03%',
    data: [
      { date: 'Day 1', current: 83.20, predicted: 83.20 },
      { date: 'Day 2', current: 83.20, predicted: 83.21 },
      { date: 'Day 3', current: 83.21, predicted: 83.21 },
      { date: 'Day 4', current: 83.21, predicted: 83.22 },
      { date: 'Day 5', current: 83.21, predicted: 83.22 },
      { date: 'Day 6', current: 83.22, predicted: 83.23 },
      { date: 'Day 7', current: null, predicted: 83.23 },
    ]
  },
  '30 Days': {
    current: '83.20M',
    predicted: '83.35M',
    netMigration: '+10k',
    growthRate: '+0.18%',
    data: [
      { date: 'Week 1', current: 83.20, predicted: 83.20 },
      { date: 'Week 2', current: 83.23, predicted: 83.25 },
      { date: 'Week 3', current: 83.26, predicted: 83.30 },
      { date: 'Week 4', current: null, predicted: 83.35 },
    ]
  },
  '90 Days': {
    current: '83.20M',
    predicted: '83.65M',
    netMigration: '+31k',
    growthRate: '+0.54%',
    data: [
      { date: 'Month 1', current: 83.20, predicted: 83.25 },
      { date: 'Month 2', current: 83.35, predicted: 83.45 },
      { date: 'Month 3', current: null, predicted: 83.65 },
    ]
  },
  '6 Months': {
    current: '83.20M',
    predicted: '84.10M',
    netMigration: '+124k',
    growthRate: '+1.08%',
    data: [
      { date: 'Jan', current: 82.5, predicted: 82.5 },
      { date: 'Feb', current: 82.6, predicted: 82.7 },
      { date: 'Mar', current: 82.8, predicted: 82.9 },
      { date: 'Apr', current: 82.9, predicted: 83.2 },
      { date: 'May', current: 83.1, predicted: 83.5 },
      { date: 'Jun', current: 83.2, predicted: 83.8 },
      { date: 'Jul', current: null, predicted: 84.1 },
    ]
  },
  '1 Year': {
    current: '83.20M',
    predicted: '85.00M',
    netMigration: '+250k',
    growthRate: '+2.16%',
    data: [
      { date: 'Q1', current: 82.5, predicted: 82.5 },
      { date: 'Q2', current: 82.9, predicted: 83.2 },
      { date: 'Q3', current: 83.2, predicted: 83.8 },
      { date: 'Q4', current: 83.6, predicted: 84.4 },
      { date: 'Q1 (Next)', current: null, predicted: 85.0 },
    ]
  }
};

interface Props {
  data?: any[];
}

export default function PopulationForecast({ data: propData }: Props) {
  const [period, setPeriod] = useState<string>('6 Months');
  
  const currentForecast = forecastByPeriod[period] || forecastByPeriod['6 Months'];
  const chartData = currentForecast.data;

  // Calculate dynamic tight Y-axis domain so small variations (e.g. 83.20 to 83.23) are visibly sloped
  const numericValues = chartData.flatMap(d => [d.current, d.predicted].filter((v): v is number => v !== null));
  const minVal = Math.min(...numericValues);
  const maxVal = Math.max(...numericValues);
  const padding = (maxVal - minVal) * 0.3 || 0.1;
  const yDomain: [number, number] = [
    parseFloat((minVal - padding).toFixed(2)),
    parseFloat((maxVal + padding).toFixed(2))
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-white font-poppins font-medium">Population Forecast</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Demographic Projections (Millions)</p>
        </div>
        <div className="flex gap-2 bg-black/30 p-1 rounded-lg border border-white/5">
          {['7 Days', '30 Days', '90 Days', '6 Months', '1 Year'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-2 py-1 text-[10px] rounded transition-all duration-200 ${period === p ? 'bg-primary text-white font-bold shadow-sm shadow-primary/50' : 'text-gray-400 hover:text-white'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-black/20 p-2 rounded border border-white/5"><div className="text-[10px] text-gray-500">Current</div><div className="text-sm text-white font-mono font-bold">{currentForecast.current}</div></div>
        <div className="bg-black/20 p-2 rounded border border-white/5"><div className="text-[10px] text-gray-500">Predicted</div><div className="text-sm text-primary font-mono font-bold">{currentForecast.predicted}</div></div>
        <div className="bg-black/20 p-2 rounded border border-white/5"><div className="text-[10px] text-gray-500">Net Migration</div><div className="text-sm text-white font-mono">{currentForecast.netMigration}</div></div>
        <div className="bg-black/20 p-2 rounded border border-white/5"><div className="text-[10px] text-gray-500">Growth Rate</div><div className="text-sm text-success font-mono">{currentForecast.growthRate}</div></div>
      </div>

      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} domain={yDomain} tickFormatter={(v) => `${v}M`} />
            <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} formatter={(val: any) => [`${val}M`, '']} />
            <Line type="monotone" dataKey="predicted" stroke="#7C3AED" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Predicted" />
            <Line type="monotone" dataKey="current" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} name="Current" connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

