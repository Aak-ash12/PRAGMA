import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Healthcare', value: 30, color: '#2563EB' },
  { name: 'Education', value: 25, color: '#7C3AED' },
  { name: 'Infrastructure', value: 20, color: '#06B6D4' },
  { name: 'Emergency', value: 15, color: '#10B981' },
  { name: 'Savings (AI Optimized)', value: 10, color: '#F59E0B' },
];

export default function BudgetIntelligence() {
  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-white font-poppins font-medium">Budget Intelligence</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">AI Optimized Allocation</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-mono font-bold text-success">+12.4%</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Predicted ROI</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="bg-black/20 p-2 rounded border border-white/5 text-center">
          <div className="text-[10px] text-gray-500 uppercase mb-1">Current Budget</div>
          <div className="text-sm text-white font-mono font-bold">₹12,400 Cr</div>
        </div>
        <div className="bg-primary/10 p-2 rounded border border-primary/30 text-center">
          <div className="text-[10px] text-primary uppercase mb-1 font-bold">AI Identified Savings</div>
          <div className="text-sm text-primary font-mono font-bold">₹1,240 Cr</div>
        </div>
      </div>

      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="rgba(255,255,255,0.1)"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
