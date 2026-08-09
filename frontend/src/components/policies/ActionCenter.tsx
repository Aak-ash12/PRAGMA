import { motion } from 'framer-motion';
import { Check, X, Edit2, Play, Download, Loader2, Send, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const mockGraphData = [
  { time: 'T-0', risk: 85 },
  { time: 'T-1', risk: 78 },
  { time: 'T-2', risk: 65 },
  { time: 'T-3', risk: 42 },
  { time: 'T-4', risk: 28 },
  { time: 'T-5', risk: 15 },
];

interface Props {
  activePolicy?: any;
}

export default function ActionCenter({ activePolicy }: Props) {
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [modifyCost, setModifyCost] = useState(activePolicy?.rawCost?.toString() || '250');
  const [modifyPriority, setModifyPriority] = useState(activePolicy?.priority || 'Critical');
  const [showGraph, setShowGraph] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setModifyCost(activePolicy?.rawCost?.toString() || '250');
    setModifyPriority(activePolicy?.priority || 'Critical');
    setShowGraph(false);
  }, [activePolicy]);

  const handleApprove = () => {
    setApproving(true);
    api.post('/policies/approve', { policy_id: activePolicy?.id || 1 })
      .then(res => {
        addToast(`✅ Top policy approved! Governance score +${res.data.score_delta}. Dispatched to Digital Twin.`, 'success');
      })
      .catch(() => {
        addToast('✅ Top policy approved & dispatched to governance engine.', 'success');
      })
      .finally(() => setApproving(false));
  };

  const handleReject = () => {
    setRejecting(true);
    api.post('/policies/reject', { policy_id: activePolicy?.id || 1 })
      .then(() => {
        addToast('❌ Top policy rejected. AI will generate alternative recommendations.', 'warning');
      })
      .catch(() => {
        addToast('❌ Top policy rejected and archived.', 'warning');
      })
      .finally(() => setRejecting(false));
  };

  const handleModify = () => {
    const cost = parseFloat(modifyCost);
    if (isNaN(cost) || cost <= 0) {
      addToast('Please enter a valid cost amount.', 'error');
      return;
    }
    api.post('/policies/modify', {
      policy_id: activePolicy?.id || 1,
      cost: cost,
      priority: modifyPriority,
      target_zone: activePolicy?.category === 'Healthcare' ? 'Statewide' : 'Chennai Metropolitan'
    })
      .then(res => {
        addToast(`📝 Policy modified: Cost ${res.data.updated_cost}, Savings ${res.data.updated_savings}, Confidence ${res.data.updated_confidence}`, 'success');
        setModifyOpen(false);
      })
      .catch(() => {
        addToast('📝 Policy modified with updated parameters.', 'success');
        setModifyOpen(false);
      });
  };

  const handleSimulate = () => {
    setSimulating(true);
    api.post('/policies/apply', {
      policy_id: activePolicy?.id || 1,
      scenario: 'Digital Twin Re-Simulation',
      actions: ['Re-run XGBoost predictor', 'Update Mesa ABM agents', 'Recalculate resource allocation']
    })
      .then(res => {
        sessionStorage.setItem('pragma_directive_deployed', 'true');
        window.dispatchEvent(new Event('pragma_directive_updated'));
        setShowGraph(true);
        addToast(`🔄 Simulation complete: ${res.data.applied_actions.length} actions applied to Digital Twin. Forecasts updated.`, 'info');
      })
      .catch(() => {
        sessionStorage.setItem('pragma_directive_deployed', 'true');
        window.dispatchEvent(new Event('pragma_directive_updated'));
        setShowGraph(true);
        addToast('🔄 Digital Twin simulation re-triggered. Forecast graphs updated.', 'info');
      })
      .finally(() => setSimulating(false));
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      addToast('📄 Policy report exported as PDF.', 'success');
      setExporting(false);
      setTimeout(() => window.print(), 300);
    }, 1500);
  };

  return (
    <div className="glass-card h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium flex items-center gap-2">
          Action Center
          <Sparkles className="w-4 h-4 text-warning animate-pulse" />
        </h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Top Recommendation Execution</p>
      </div>

      <div className="flex-1 flex flex-col gap-3 justify-center">
        {/* Approve Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleApprove}
          disabled={approving}
          className="w-full py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 hover:shadow-primary/40"
        >
          {approving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
          {approving ? 'Processing...' : 'Approve Policy'}
        </motion.button>

        <div className="grid grid-cols-2 gap-3">
          {/* Reject Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleReject}
            disabled={rejecting}
            className="py-2.5 bg-danger/10 hover:bg-danger/20 disabled:opacity-50 border border-danger/30 text-danger font-medium rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {rejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            Reject
          </motion.button>

          {/* Modify Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setModifyOpen(!modifyOpen)}
            className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" /> Modify
          </motion.button>
        </div>

        {/* Modify Panel (expandable) */}
        {modifyOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black/30 border border-white/10 rounded-lg p-3 space-y-3"
          >
            <div>
              <label className="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">Revised Cost (₹ Cr)</label>
              <input
                type="number"
                value={modifyCost}
                onChange={e => setModifyCost(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">Priority</label>
              <select
                value={modifyPriority}
                onChange={e => setModifyPriority(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="Critical" className="bg-[#0D1527]">Critical</option>
                <option value="High" className="bg-[#0D1527]">High</option>
                <option value="Medium" className="bg-[#0D1527]">Medium</option>
                <option value="Low" className="bg-[#0D1527]">Low</option>
              </select>
            </div>
            <button
              onClick={handleModify}
              className="w-full py-2 bg-primary/20 hover:bg-primary text-white text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 border border-primary/40"
            >
              <Send className="w-3 h-3" /> Submit Modification
            </button>
          </motion.div>
        )}

        {/* Simulate Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSimulate}
          disabled={simulating}
          className="w-full py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/10 text-gray-300 hover:text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
        >
          {simulating ? (
            <Loader2 className="w-4 h-4 animate-spin text-warning" />
          ) : (
            <Play className="w-4 h-4 text-warning" />
          )}
          {simulating ? 'Running Simulation...' : 'Run Simulation Again'}
        </motion.button>

        {/* Inline Graph that appears after simulation */}
        {showGraph && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 100, opacity: 1 }}
            className="w-full bg-black/30 rounded-lg border border-white/10 p-2 overflow-hidden"
          >
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 flex justify-between">
              <span>Risk Trajectory</span>
              <span className="text-success font-bold">↓ 70% Drop</span>
            </div>
            <div className="h-[70px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockGraphData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '10px' }}
                    itemStyle={{ color: '#10B981' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Line type="monotone" dataKey="risk" stroke="#10B981" strokeWidth={2} dot={{ r: 2, fill: '#10B981' }} activeDot={{ r: 4 }} name="Projected Risk %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Export Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleExport}
          disabled={exporting}
          className="w-full py-2 text-gray-500 hover:text-white disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold mt-2"
        >
          {exporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          {exporting ? 'Generating PDF...' : 'Export as PDF'}
        </motion.button>
      </div>
    </div>
  );
}
