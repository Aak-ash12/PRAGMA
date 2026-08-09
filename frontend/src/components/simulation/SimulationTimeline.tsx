// @ts-nocheck
import { motion } from 'framer-motion';

const standard5Steps = [
  { step: 1, label: 'Step 1: Collect Live Data', desc: 'Real-time telemetry parameter ingestion' },
  { step: 2, label: 'Step 2: Load Historical Data', desc: 'Historical benchmark pattern matching' },
  { step: 3, label: 'Step 3: AI Model Engine', desc: 'XGBoost / LSTM model probability calculation' },
  { step: 4, label: 'Step 4: Digital Twin Simulation', desc: 'Spatial physics & flow simulation' },
  { step: 5, label: 'Step 5: AI Recommendation', desc: 'Prescriptive action plan & explanation' },
];

interface Props {
  activeScenario: string;
  simulationStep: number;
  pipelinePayload?: any;
}

export default function SimulationTimeline({ activeScenario, simulationStep, pipelinePayload }: Props) {
  const isAllCompleted = simulationStep >= 4;

  return (
    <div className="glass-card flex-1 flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-white font-poppins font-medium">5-Step AI Pipeline</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Standard Predictive Flow</p>
        </div>
        <span className={`text-[9px] font-mono border px-2 py-0.5 rounded font-bold transition-all ${
          isAllCompleted
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
        }`}>
          {isAllCompleted ? 'PIPELINE COMPLETE' : 'ML WORKFLOW'}
        </span>
      </div>
      
      {simulationStep === -1 ? (
        <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
          <span className="text-xs text-gray-500 font-mono tracking-widest animate-pulse">AWAITING RUN...</span>
        </div>
      ) : (
        <div className="flex-1 relative pl-2">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/10 z-0"></div>
          <div className="space-y-3 relative z-10">
            {standard5Steps.map((stepItem, i) => {
              // When simulation finishes (step >= 4), ALL steps including Step 5 are green/completed!
              const status = isAllCompleted
                ? 'completed'
                : i < simulationStep
                  ? 'completed'
                  : i === simulationStep
                    ? 'active'
                    : 'pending';
              
              return (
                <div key={i} className="flex items-start gap-3 group">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 transition-all duration-300 ${
                    status === 'completed' ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                    status === 'active' ? 'bg-warning text-black animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                    'bg-black border border-white/20 text-gray-500'
                  }`}>
                    {stepItem.step}
                  </div>
                  <div>
                    <div className={`text-xs font-semibold transition-colors duration-300 ${
                      status === 'completed' ? 'text-emerald-300' :
                      status === 'active' ? 'text-warning font-bold' :
                      'text-gray-500'
                    }`}>
                      {stepItem.label}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {stepItem.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
