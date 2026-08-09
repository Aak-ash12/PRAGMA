import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const initialData = [
  { month: 'Jan', budgetEff: 82, riskIndex: 65 },
  { month: 'Feb', budgetEff: 84, riskIndex: 58 },
  { month: 'Mar', budgetEff: 85, riskIndex: 45 },
  { month: 'Apr', budgetEff: 89, riskIndex: 30 },
  { month: 'May', budgetEff: 92, riskIndex: 25 },
  { month: 'Jun', budgetEff: 94, riskIndex: 20 },
  { month: 'Jul', budgetEff: 91, riskIndex: 22 },
  { month: 'Aug', budgetEff: 88, riskIndex: 28 },
  { month: 'Sep', budgetEff: 85, riskIndex: 35 },
  { month: 'Oct', budgetEff: 82, riskIndex: 42 },
  { month: 'Nov', budgetEff: 78, riskIndex: 50 },
  { month: 'Dec', budgetEff: 75, riskIndex: 60 },
];

export default function ReportCharts() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const handleCompleted = () => {
      // Simulate new generated data
      setData(prev => prev.map(d => ({
        ...d,
        budgetEff: Math.min(100, Math.max(60, d.budgetEff + (Math.random() * 10 - 3))),
        riskIndex: Math.max(5, d.riskIndex + (Math.random() * 15 - 10))
      })));
    };

    window.addEventListener('pragma_report_completed', handleCompleted);
    return () => window.removeEventListener('pragma_report_completed', handleCompleted);
  }, []);

  return (
    <div className="glass-card h-[400px] flex flex-col relative overflow-hidden">
      <div className="mb-4 flex justify-between items-center relative z-10">
        <div>
          <h3 className="text-white font-poppins font-medium">Aggregated Intelligence Trends</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Annual State Metrics</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 text-[9px] text-gray-400 uppercase"><div className="w-2 h-2 rounded-full bg-primary"></div> Budget Eff.</div>
          <div className="flex items-center gap-1 text-[9px] text-gray-400 uppercase"><div className="w-2 h-2 rounded-full bg-danger"></div> Risk Index</div>
        </div>
      </div>

      <motion.div 
        key={JSON.stringify(data)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 w-full relative z-10"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="budgetEff" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} name="Budget Efficiency" animationDuration={1500} />
            <Area type="monotone" dataKey="riskIndex" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} strokeWidth={2} name="Risk Index" animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
