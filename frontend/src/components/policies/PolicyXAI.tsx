import { BrainCircuit, Info, Target, Database, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';

const generateFeatures = (policy: any) => {
  if (policy?.category === 'Healthcare') {
    return [
      { name: 'Meteorological Forecasts', weight: 42, color: 'bg-primary', textColor: 'text-primary' },
      { name: 'Current Hospital Occupancy', weight: 35, color: 'bg-warning', textColor: 'text-warning' },
      { name: 'Historical Viral Outbreak Data', weight: 18, color: 'bg-secondary', textColor: 'text-secondary' },
      { name: 'Demographic Migration Trends', weight: 5, color: 'bg-accentPurple', textColor: 'text-accentPurple' },
    ];
  }
  if (policy?.category === 'Infrastructure') {
    return [
      { name: 'Sensor Telemetry', weight: 55, color: 'bg-primary', textColor: 'text-primary' },
      { name: 'Structural Integrity Models', weight: 25, color: 'bg-warning', textColor: 'text-warning' },
      { name: 'Weather Forecasts', weight: 15, color: 'bg-secondary', textColor: 'text-secondary' },
      { name: 'Traffic Loads', weight: 5, color: 'bg-accentPurple', textColor: 'text-accentPurple' },
    ];
  }
  return [
    { name: 'Historical Precedent', weight: 40, color: 'bg-primary', textColor: 'text-primary' },
    { name: 'Economic Impact', weight: 30, color: 'bg-warning', textColor: 'text-warning' },
    { name: 'Public Sentiment Analysis', weight: 20, color: 'bg-secondary', textColor: 'text-secondary' },
    { name: 'Resource Availability', weight: 10, color: 'bg-accentPurple', textColor: 'text-accentPurple' },
  ];
};

interface Props {
  activePolicy?: any;
}

export default function PolicyXAI({ activePolicy }: Props) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [featureWeights, setFeatureWeights] = useState(generateFeatures(activePolicy));
  const [reasoningIndex, setReasoningIndex] = useState(0);
  const { addToast } = useToast();

  useEffect(() => {
    setFeatureWeights(generateFeatures(activePolicy));
    setReasoningIndex(prev => (prev + 1) % 4); // Just rotate through some reasoning text for demo
  }, [activePolicy]);

  const reasoningOptions = [
    "Historical data from similar monsoon seasons combined with current IoT telemetry from district hospitals indicates an 85% probability of bed shortages within 14 days. Proactive budget increases have shown a 94% success rate in mitigating this specific crisis pattern.",
    "Real-time sensor network analysis detects an anomalous 42% spike in respiratory cases, correlating strongly with predicted PM2.5 air quality degradation models. Early intervention reduces hospitalization by 68%.",
    "Predictive mobility models show mass urban migration intersecting with vulnerable supply chain nodes, predicting a 94% chance of localized food shortages. Pre-positioning reserves prevents critical failure.",
    "Satellite imagery analysis combined with upstream rainfall data indicates a high probability of dam overflow, necessitating immediate localized evacuation protocols. Confidence interval exceeds standard safety thresholds."
  ];

  const handleCopyExplanation = () => {
    const text = `PRAGMA XAI Reasoning Trace:
- Top Policy: ${activePolicy?.title || 'Increase Healthcare Emergency ICU Reserve Budget by 14%'}
- Confidence: ${activePolicy?.conf || 96.8}%
- Key Factors: ${featureWeights.map(f => `${f.name} (${f.weight}%)`).join(', ')}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      addToast('📋 XAI reasoning trace copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      addToast('📋 XAI reasoning trace generated.', 'info');
    });
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setFeatureWeights(prev => prev.map(f => ({
        ...f,
        weight: Math.max(3, f.weight + Math.floor(Math.random() * 7 - 3))
      })));
      setReasoningIndex(prev => (prev + 1) % reasoningOptions.length);
      setIsRegenerating(false);
      addToast('🧠 XAI reasoning regenerated with updated feature importance.', 'success');
    }, 1500);
  };

  return (
    <div className="glass-card h-[400px] flex flex-col relative overflow-hidden group">
      <div className="absolute top-4 right-4">
        <BrainCircuit className="w-6 h-6 text-accentPurple opacity-30 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="mb-6 relative z-10 flex justify-between items-start">
        <div>
          <h3 className="text-white font-poppins font-medium flex items-center gap-2">Explainable AI <Info className="w-4 h-4 text-gray-500" /></h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Top Policy Reasoning Trace</p>
        </div>
        <div className="flex gap-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyExplanation}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Copy XAI trace"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Regenerate explanation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-primary' : ''}`} />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 relative z-10">
        <div className="bg-accentPurple/10 border-l-2 border-accentPurple p-3 rounded-r-lg">
          <div className="text-[10px] text-accentPurple uppercase font-bold tracking-wider mb-1">Why AI Selected This?</div>
          <p className="text-[11px] text-gray-300">
            {reasoningOptions[reasoningIndex]}
          </p>
        </div>

        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Feature Importance (SHAP Values)</div>
          <div className="space-y-2">
            {featureWeights.map((feature, i) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-300">{feature.name}</span>
                  <motion.span
                    key={feature.weight}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`${feature.textColor} font-bold`}
                  >
                    {feature.weight}%
                  </motion.span>
                </div>
                <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${feature.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${feature.weight}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
          <div className="flex gap-2">
            <Target className="w-4 h-4 text-success flex-shrink-0" />
            <div>
              <div className="text-[9px] text-gray-500 uppercase">Confidence</div>
              <div className="text-xs font-mono font-bold text-success">{activePolicy?.conf || 96.8}%</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Database className="w-4 h-4 text-secondary flex-shrink-0" />
            <div>
              <div className="text-[9px] text-gray-500 uppercase">Data Sources</div>
              <div className="text-xs font-bold text-white">7 APIs</div>
            </div>
          </div>
        </div>

        {/* Alternatives Section */}
        <div>
          <button
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="text-[10px] text-gray-500 hover:text-white uppercase tracking-wider transition-colors flex items-center gap-1 mb-2"
          >
            {showAlternatives ? '▼' : '►'} Alternatives Considered ({showAlternatives ? 'Hide' : 'Show'})
          </button>
          
          {showAlternatives ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="space-y-2"
            >
              <div className="p-2 bg-danger/5 border border-danger/20 rounded-lg">
                <div className="text-[10px] text-danger font-bold">❌ "Do nothing."</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Rejected (Confidence: 12%) — Unacceptable projected mortality rates and subsequent economic impact.</div>
              </div>
              <div className="p-2 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="text-[10px] text-warning font-bold">⚠️ "Partial budget increase (7%)"</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Rejected (Confidence: 34%) — Insufficient to cover projected ICU demand across 5 critical districts.</div>
              </div>
              <div className="p-2 bg-secondary/5 border border-secondary/20 rounded-lg">
                <div className="text-[10px] text-secondary font-bold">ℹ️ "Redistribute from transport budget"</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Considered (Confidence: 58%) — Would compromise critical traffic infrastructure during monsoon.</div>
              </div>
            </motion.div>
          ) : (
            <div className="text-xs text-gray-400 italic">"Do nothing." Rejected (Confidence: 12%) due to unacceptable projected mortality rates and subsequent economic impact.</div>
          )}
        </div>
      </div>
    </div>
  );
}
