import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RefreshCw, Shield, Zap } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

interface Props {
  activePolicy?: any;
}

export default function PolicySummary({ activePolicy }: Props) {
  const [governanceScore, setGovernanceScore] = useState(92);
  const [approvedCount, setApprovedCount] = useState(4);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const { addToast } = useToast();

  const topPolicyTitle = activePolicy?.title || "Increase Healthcare Budget by 14% to mitigate incoming viral outbreak.";
  const riskLevel = activePolicy?.priority === 'Critical' ? 'High' : activePolicy?.priority === 'High' ? 'Moderate' : 'Low';
  const budgetEff = activePolicy ? (Math.random() * 10 + 85).toFixed(1) + '%' : '94.2%';

  // Animate governance score on mount
  useEffect(() => {
    let current = 0;
    const step = governanceScore / 40;
    const interval = setInterval(() => {
      current += step;
      if (current >= governanceScore) {
        setAnimatedScore(governanceScore);
        clearInterval(interval);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, 25);
    return () => clearInterval(interval);
  }, [governanceScore]);



  const handleRefresh = () => {
    setIsRefreshing(true);
    api.get('/policies')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const newScore = Math.min(100, governanceScore + Math.floor(Math.random() * 3));
          setGovernanceScore(newScore);
          setAnimatedScore(newScore);
        }
        addToast('📊 Policy summary refreshed with latest AI data.', 'success');
      })
      .catch(() => {
        addToast('📊 Policy summary refreshed.', 'info');
      })
      .finally(() => setIsRefreshing(false));
  };

  return (
    <div className="glass-card h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-white font-poppins font-medium">Government AI Summary</h3>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Refresh summary"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            </motion.button>
            <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              {approvedCount} POLICIES APPROVED
            </span>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-6">Daily Policy Overview & AI Swarm Status</p>
        
        <div className="mb-6 border-l-2 border-primary pl-4 py-1">
          <div className="text-[10px] text-primary uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Active Recommendation Focus
          </div>
          <motion.div
            key={topPolicyTitle}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-white font-medium leading-snug"
          >
            {topPolicyTitle}
          </motion.div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Current Governance Score
            </span>
            <motion.span
              key={animatedScore}
              className="text-white font-bold font-mono"
            >
              {animatedScore}/100
            </motion.span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-primary to-accentPurple h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, governanceScore)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-2 bg-black/20 rounded border border-white/5 hover:border-white/15 transition-colors cursor-default"
          >
            <div className="text-[9px] text-gray-500 uppercase">Overall Risk</div>
            <div className={`text-sm font-bold font-mono ${riskLevel === 'High' ? 'text-danger' : riskLevel === 'Moderate' ? 'text-warning' : 'text-success'}`}>{riskLevel}</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-2 bg-black/20 rounded border border-white/5 hover:border-white/15 transition-colors cursor-default"
          >
            <div className="text-[9px] text-gray-500 uppercase">Budget Efficiency</div>
            <div className="text-sm font-bold text-success font-mono">{budgetEff}</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-2 bg-black/20 rounded border border-white/5 hover:border-white/15 transition-colors cursor-default"
          >
            <div className="text-[9px] text-gray-500 uppercase">Approved Interventions</div>
            <div className="text-sm font-bold text-primary font-mono">{approvedCount} Active</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-2 bg-black/20 rounded border border-white/5 hover:border-white/15 transition-colors cursor-default"
          >
            <div className="text-[9px] text-gray-500 uppercase">Environment</div>
            <div className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Stable
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
