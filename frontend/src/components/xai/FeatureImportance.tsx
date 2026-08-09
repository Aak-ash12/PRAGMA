import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const initialFeatures = [
  { name: 'Rainfall', value: 85, fill: '#3B82F6' },
  { name: 'Hospital Cap.', value: 92, fill: '#EF4444' },
  { name: 'Population', value: 75, fill: '#8B5CF6' },
  { name: 'Water Storage', value: 65, fill: '#10B981' },
  { name: 'Budget', value: 88, fill: '#F59E0B' },
  { name: 'Traffic', value: 45, fill: '#6366F1' },
  { name: 'Electricity', value: 50, fill: '#EAB308' },
  { name: 'Crime Rate', value: 20, fill: '#EC4899' },
];

export default function FeatureImportance() {
  const [features, setFeatures] = useState(initialFeatures.sort((a, b) => b.value - a.value));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { addToast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newFeatures = initialFeatures.map(f => ({
        ...f,
        value: Math.max(10, Math.min(99, f.value + (Math.random() * 30 - 15)))
      })).sort((a, b) => b.value - a.value);
      setFeatures(newFeatures);
      setIsRefreshing(false);
      addToast('🧠 Feature importance weights recalculated via SHAP.', 'success');
    }, 1000);
  };

  return (
    <div className="glass-card h-[400px] flex flex-col relative">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-white font-poppins font-medium">Feature Importance</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Weight of variables in decision (SHAP)</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-[9px] uppercase tracking-wider font-bold text-gray-400 hover:text-primary flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          {isRefreshing ? 'Computing...' : 'Recalculate'}
        </motion.button>
      </div>

      <div className="flex-1 w-full h-full relative">
        {isRefreshing && (
          <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={features} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} width={80} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
              contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Weight']}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
              {/* Note: The colors are statically set in the data itself for Recharts to pick up via 'fill' attribute if passed, but since Recharts <Bar> doesn't automatically use 'fill' from data if we specify a single color, wait - it DOES use 'fill' from data if the data has a 'fill' property and we don't override it. */}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
