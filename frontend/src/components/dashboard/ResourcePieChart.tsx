import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Healthcare', value: 35, color: '#2563EB' },
  { name: 'Education', value: 20, color: '#7C3AED' },
  { name: 'Roads', value: 15, color: '#06B6D4' },
  { name: 'Water', value: 10, color: '#10B981' },
  { name: 'Agriculture', value: 8, color: '#F59E0B' },
  { name: 'Electricity', value: 7, color: '#EF4444' },
  { name: 'Emergency', value: 5, color: '#8B5CF6' },
];

export default function ResourcePieChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card h-[350px] flex flex-col"
    >
      <div className="mb-2">
        <h3 className="text-white font-poppins font-medium">Resource Allocation</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">State Budget Distribution</p>
      </div>
      
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={90}
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
    </motion.div>
  );
}
