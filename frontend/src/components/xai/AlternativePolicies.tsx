import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, Info } from 'lucide-react';

const alternatives = [
  { id: 1, title: 'Reallocate existing budget (No increase)', cost: 'Nil', risk: 'High', time: '5 Days', prob: '45%', adv: 'No financial strain.', dis: '60% chance of bed shortage.',
    reasoning: 'Models indicate that merely shifting existing funds will not create new capacity. Historical data shows this approach fails during spikes >30%.' },
  { id: 2, title: 'Deploy military medical tents', cost: '₹500 Cr', risk: 'Medium', time: '3 Days', prob: '82%', adv: 'Extremely fast deployment.', dis: 'Temporary solution, high logistical cost.',
    reasoning: 'While fast, military tents lack the specialized HVAC and isolation infrastructure needed for respiratory outbreaks. Rejected due to secondary infection risks.' },
  { id: 3, title: 'Mandatory private hospital requisition', cost: '₹1200 Cr', risk: 'Low', time: '7 Days', prob: '88%', adv: 'Utilizes existing high-quality infra.', dis: 'Political resistance, legal delays.',
    reasoning: 'Simulation of legal injunctions suggests a 40% probability of implementation delays exceeding 14 days, missing the critical intervention window.' },
  { id: 4, title: 'Divert funds from transport sector', cost: '₹2500 Cr', risk: 'Medium', time: '14 Days', prob: '90%', adv: 'Fully covers medical requirement.', dis: 'Halts critical road repairs.',
    reasoning: 'Monsoon season requires active transport maintenance. Diverting these funds increases supply chain disruption risks for the very medical supplies we need.' },
  { id: 5, title: 'Implement strict lockdown', cost: '₹15000 Cr (Econ Loss)', risk: 'Low (Health) / Critical (Econ)', time: '24 Hours', prob: '99%', adv: 'Stops viral spread immediately.', dis: 'Devastating economic impact.',
    reasoning: 'Economic impact modeling shows disproportionate harm to daily wage workers in Chennai and Coimbatore, leading to secondary crises.' },
];

export default function AlternativePolicies() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="glass-card h-full flex flex-col">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-white font-poppins font-medium flex items-center gap-2">Alternative Policies Considered <Info className="w-4 h-4 text-gray-500" /></h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">AI Explored Counterfactuals (Click rows to expand)</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500 bg-black/20">
              <th className="p-3 font-medium rounded-tl-lg">Alternative Action</th>
              <th className="p-3 font-medium">Cost</th>
              <th className="p-3 font-medium">Risk Level</th>
              <th className="p-3 font-medium">Success Prob.</th>
              <th className="p-3 font-medium">Key Advantage</th>
              <th className="p-3 font-medium rounded-tr-lg">Key Disadvantage</th>
              <th className="p-3 w-8"></th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {alternatives.map((alt) => {
              const isExpanded = expandedRow === alt.id;
              return (
                <React.Fragment key={alt.id}>
                  <tr 
                    onClick={() => toggleRow(alt.id)}
                    className={`border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer ${isExpanded ? 'bg-white/5' : ''}`}
                  >
                    <td className="p-3 font-medium text-white">{alt.title}</td>
                    <td className="p-3 font-mono text-gray-400">{alt.cost}</td>
                    <td className={`p-3 font-bold ${alt.risk.includes('High') || alt.risk.includes('Critical') ? 'text-danger' : alt.risk.includes('Medium') ? 'text-warning' : 'text-success'}`}>{alt.risk}</td>
                    <td className="p-3 font-mono font-bold text-gray-300">{alt.prob}</td>
                    <td className="p-3 text-[10px] text-success leading-tight max-w-[150px]">{alt.adv}</td>
                    <td className="p-3 text-[10px] text-danger leading-tight max-w-[150px]">{alt.dis}</td>
                    <td className="p-3">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </td>
                  </tr>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-black/40 border-b border-white/5"
                      >
                        <td colSpan={7} className="p-0">
                          <div className="p-4 flex gap-3 text-sm text-gray-300 items-start">
                            <AlertCircle className="w-5 h-5 text-accentPurple flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-[10px] uppercase text-accentPurple tracking-wider font-bold mb-1">Counterfactual Reasoning Trace</div>
                              <p className="leading-relaxed">{alt.reasoning}</p>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
