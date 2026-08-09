import { motion } from 'framer-motion';
import { Settings2, FileBarChart, Zap, Target, ShieldAlert, PieChart, Map, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

const reportTypes = [
  { name: 'Government Governance Report', icon: FileBarChart },
  { name: 'Simulation Report', icon: Zap },
  { name: 'Prediction Report', icon: Target },
  { name: 'Policy Recommendation Report', icon: FileBarChart },
  { name: 'Disaster Risk Report', icon: ShieldAlert },
  { name: 'Budget Allocation Report', icon: PieChart },
  { name: 'District Performance Report', icon: Map },
];

export default function GenerateReport() {
  const [selectedType, setSelectedType] = useState('Government Governance Report');
  const [isGenerating, setIsGenerating] = useState(false);
  const { addToast } = useToast();

  const handleGenerate = () => {
    setIsGenerating(true);
    const event = new CustomEvent('pragma_report_generating', { detail: { type: selectedType } });
    window.dispatchEvent(event);
    
    setTimeout(() => {
      setIsGenerating(false);
      window.dispatchEvent(new Event('pragma_report_completed'));
      addToast('📄 Report successfully generated and compiled.', 'success');
    }, 4000);
  };

  return (
    <div className="glass-card flex flex-col gap-6">
      <div>
        <div className="mb-4">
          <h3 className="text-white font-poppins font-medium">Generate New Report</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Select Report Template</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {reportTypes.map((rt, i) => (
            <button 
              key={i} 
              onClick={() => setSelectedType(rt.name)}
              className={`px-3 py-2 border text-xs rounded-lg transition-all flex items-center gap-2 ${
                selectedType === rt.name 
                  ? 'bg-primary/20 border-primary text-white shadow-[0_0_10px_rgba(37,99,235,0.2)]' 
                  : 'bg-black/30 border-white/10 hover:border-primary/50 text-gray-400 hover:text-white'
              }`}
            >
              <rt.icon className={`w-4 h-4 ${selectedType === rt.name ? 'text-primary' : 'text-gray-500'}`} /> {rt.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="mb-4 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-gray-400" />
          <h4 className="text-sm font-bold text-white">Report Builder Parameters</h4>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">District</label>
            <select className="w-full bg-[#0D1527] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-primary">
              <option>All Districts (Statewide)</option>
              <option>Chennai</option>
              <option>Coimbatore</option>
              <option>Madurai</option>
              <option>Salem</option>
              <option>Trichy</option>
              <option>Tirunelveli</option>
              <option>Vellore</option>
              <option>Erode</option>
              <option>Thoothukudi</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">Date Range</label>
            <select className="w-full bg-[#0D1527] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-primary">
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">Simulation Run</label>
            <select className="w-full bg-[#0D1527] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-primary">
              <option>None</option>
              <option>Monsoon Flood Simulation_v2</option>
              <option>Drought Impact Analysis</option>
              <option>Pandemic Resource Strain</option>
              <option>Traffic Gridlock Stress Test</option>
              <option>Power Grid Failure Sim</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">Prediction Model</label>
            <select className="w-full bg-[#0D1527] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-primary">
              <option>Default Ensemble</option>
              <option>Demographic Prophet</option>
              <option>Economic Time-Series Forecasting</option>
              <option>Spatial Risk CNN</option>
              <option>Climate Pattern Analyzer</option>
              <option>Resource Allocation Optimizer</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">AI Agent Lens</label>
            <select className="w-full bg-[#0D1527] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-primary">
              <option>Multi-Agent Consensus (All)</option>
              <option>Healthcare Agent Only</option>
              <option>Infrastructure Agent Only</option>
              <option>Finance Agent Only</option>
              <option>Education Agent Only</option>
              <option>Environment Agent Only</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">Output Format</label>
            <select className="w-full bg-[#0D1527] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-primary">
              <option>PDF (Printable)</option>
              <option>Excel (Data-rich)</option>
              <option>Word (Editable)</option>
              <option>CSV (Raw)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isGenerating ? 'Compiling Agents...' : 'Compile & Generate Report'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
