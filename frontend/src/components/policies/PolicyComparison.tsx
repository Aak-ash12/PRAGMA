import { motion } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface ComparisonRow {
  metric: string;
  current: string;
  currentColor: string;
  ai: string;
  aiColor: string;
  manual: string;
  manualColor: string;
}

interface Props {
  activePolicy?: any;
}

const initialData: ComparisonRow[] = [
  { metric: 'Cost', current: '₹1,200 Cr', currentColor: 'text-gray-300', ai: '₹2,500 Cr', aiColor: 'text-primary', manual: '₹3,100 Cr', manualColor: 'text-gray-300' },
  { metric: 'Risk Level', current: 'Critical', currentColor: 'text-danger', ai: 'Low', aiColor: 'text-success', manual: 'Medium', manualColor: 'text-warning' },
  { metric: 'Time to Implement', current: 'N/A', currentColor: 'text-gray-300', ai: '14 Days', aiColor: 'text-primary', manual: '45 Days', manualColor: 'text-gray-300' },
  { metric: 'Efficiency Score', current: '42/100', currentColor: 'text-danger', ai: '96/100', aiColor: 'text-success', manual: '74/100', manualColor: 'text-warning' },
  { metric: 'Success Rate', current: '28%', currentColor: 'text-danger', ai: '94%', aiColor: 'text-success', manual: '65%', manualColor: 'text-warning' },
  { metric: 'Population Impact', current: '2.1M', currentColor: 'text-gray-300', ai: '12.4M', aiColor: 'text-primary', manual: '5.8M', manualColor: 'text-gray-300' },
  { metric: 'ROI Multiplier', current: '1.2x', currentColor: 'text-danger', ai: '3.4x', aiColor: 'text-success', manual: '2.1x', manualColor: 'text-warning' },
];

export default function PolicyComparison({ activePolicy }: Props) {
  const [data, setData] = useState(initialData);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [selectedApproach, setSelectedApproach] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [advantages, setAdvantages] = useState({ efficiency: 54, speed: 31, success: 66 });
  const { addToast } = useToast();

  useEffect(() => {
    setData(prev => prev.map(row => ({
      ...row,
      ai: row.metric === 'Efficiency Score' 
        ? `${Math.floor(Math.random() * 5 + 92)}/100` 
        : row.metric === 'Success Rate'
          ? `${Math.floor(Math.random() * 6 + 90)}%`
        : row.metric === 'Cost'
          ? `₹${Math.floor(Math.random() * 400 + (activePolicy?.rawCost || 2100))},000`
        : row.metric === 'Time to Implement'
          ? `${Math.floor(Math.random() * 4 + 11)} Days`
        : row.metric === 'ROI Multiplier'
          ? `${(Math.random() * 1.5 + 2.5).toFixed(1)}x`
        : row.metric === 'Population Impact'
          ? `${(Math.random() * 3 + 10).toFixed(1)}M`
          : row.ai
    })));
  }, [activePolicy]);

  const handleSelectApproach = (approach: string) => {
    setSelectedApproach(approach === selectedApproach ? null : approach);
    if (approach !== selectedApproach) {
      addToast(`📊 ${approach} approach selected for detailed analysis.`, 'info');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate slight variation in AI scores
      setData(prev => prev.map(row => ({
        ...row,
        ai: row.metric === 'Efficiency Score' 
          ? `${Math.floor(Math.random() * 5 + 92)}/100` 
          : row.metric === 'Success Rate'
            ? `${Math.floor(Math.random() * 6 + 90)}%`
          : row.metric === 'Cost'
            ? `₹${Math.floor(Math.random() * 400 + 2100)},000`
          : row.metric === 'Time to Implement'
            ? `${Math.floor(Math.random() * 4 + 11)} Days`
          : row.metric === 'ROI Multiplier'
            ? `${(Math.random() * 1.5 + 2.5).toFixed(1)}x`
          : row.metric === 'Population Impact'
            ? `${(Math.random() * 3 + 10).toFixed(1)}M`
            : row.ai
      })));
      
      setAdvantages({
        efficiency: Math.floor(Math.random() * 15 + 45),
        speed: Math.floor(Math.random() * 10 + 25),
        success: Math.floor(Math.random() * 15 + 55)
      });
      
      setIsRefreshing(false);
      addToast('🔄 Comparison matrix refreshed with latest model outputs.', 'success');
    }, 1200);
  };

  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-white font-poppins font-medium">Policy Comparison Matrix</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">AI vs Manual vs Current ({activePolicy?.category || 'General'})</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-[9px] uppercase tracking-wider font-bold text-gray-400 hover:text-primary flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </motion.button>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500">
              <th className="p-3 font-medium">Metric</th>
              <th 
                className={`p-3 font-medium cursor-pointer transition-all ${
                  selectedApproach === 'Current' ? 'text-white bg-white/10' : 'text-white bg-black/20 hover:bg-black/30'
                }`}
                onClick={() => handleSelectApproach('Current')}
              >
                Current Policy
                {selectedApproach === 'Current' && <span className="ml-1 text-danger">●</span>}
              </th>
              <th 
                className={`p-3 font-bold cursor-pointer transition-all ${
                  selectedApproach === 'AI' ? 'text-primary bg-primary/20' : 'text-primary bg-primary/10 hover:bg-primary/15'
                }`}
                onClick={() => handleSelectApproach('AI')}
              >
                AI Suggested ★
                {selectedApproach === 'AI' && <span className="ml-1 text-success">●</span>}
              </th>
              <th 
                className={`p-3 font-medium cursor-pointer transition-all ${
                  selectedApproach === 'Manual' ? 'text-white bg-white/10' : 'text-white bg-black/20 hover:bg-black/30'
                }`}
                onClick={() => handleSelectApproach('Manual')}
              >
                Manual Alternative
                {selectedApproach === 'Manual' && <span className="ml-1 text-warning">●</span>}
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {data.map((row, i) => (
              <motion.tr
                key={row.metric}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`border-b border-white/5 transition-colors ${
                  hoveredRow === i ? 'bg-white/5' : ''
                } ${i === data.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="p-3 font-medium text-gray-400">{row.metric}</td>
                <td className={`p-3 font-mono bg-black/20 ${row.currentColor} ${selectedApproach === 'Current' ? 'font-bold' : ''}`}>
                  {row.current}
                </td>
                <td className={`p-3 font-mono font-bold bg-primary/10 ${row.aiColor} ${selectedApproach === 'AI' ? 'shadow-inner' : ''}`}>
                  {row.ai}
                </td>
                <td className={`p-3 font-mono bg-black/20 ${row.manualColor} ${selectedApproach === 'Manual' ? 'font-bold' : ''}`}>
                  {row.manual}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Advantage Summary */}
      <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
        <span className="text-[9px] text-gray-500 uppercase tracking-wider">AI Advantage</span>
        <div className="flex gap-3 text-[10px]">
          <span className="text-success font-bold">↑ {advantages.efficiency}% better efficiency</span>
          <span className="text-primary font-bold">↓ {advantages.speed} days faster</span>
          <span className="text-warning font-bold">↑ {advantages.success}% higher success</span>
        </div>
      </div>
    </div>
  );
}
