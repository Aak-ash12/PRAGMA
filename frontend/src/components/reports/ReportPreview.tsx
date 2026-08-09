import { useState, useEffect } from 'react';
import { Maximize2, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportPreview() {
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed'>('idle');
  const [reportTitle, setReportTitle] = useState('STATE GOVERNANCE & RISK ASSESSMENT REPORT');

  useEffect(() => {
    const handleGenerating = (e: Event) => {
      setStatus('generating');
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.type) {
        setReportTitle(customEvent.detail.type.toUpperCase());
      }
    };
    const handleCompleted = () => setStatus('completed');

    window.addEventListener('pragma_report_generating', handleGenerating);
    window.addEventListener('pragma_report_completed', handleCompleted);

    return () => {
      window.removeEventListener('pragma_report_generating', handleGenerating);
      window.removeEventListener('pragma_report_completed', handleCompleted);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-card relative">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-white font-poppins font-medium">{reportTitle || 'Government Report Preview'}</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">A4 Printable Layout Visualization</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            disabled={status !== 'completed'}
            className="flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-medium rounded transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Export
          </button>
          <div className={`px-3 py-1.5 border text-[10px] uppercase font-bold rounded flex items-center whitespace-nowrap ${
            status === 'completed' ? 'bg-success/20 text-success border-success/50' : 
            status === 'generating' ? 'bg-warning/20 text-warning border-warning/50 animate-pulse' : 
            'bg-gray-800 text-gray-400 border-gray-600'
          }`}>
            {status === 'completed' ? 'Live Preview Mode' : status === 'generating' ? 'Drafting Document...' : 'Waiting for Input'}
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto bg-black/50 p-8 rounded-xl flex justify-center custom-scrollbar relative min-h-[600px]">
        {/* A4 Paper Approximation */}
        <AnimatePresence mode="wait">
          {status === 'generating' ? (
            <motion.div 
              key="skeleton"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-[800px] h-[1130px] bg-white shadow-2xl p-16 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-gray-100/50 to-white/0 animate-shimmer" style={{ backgroundSize: '100% 200%' }}></div>
              <div className="border-b-2 border-gray-200 pb-4 mb-8 flex justify-between items-end">
                <div>
                  <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="w-64 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-10"></div>
              
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3 mb-12">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="h-32 bg-gray-100 border border-gray-200 rounded animate-pulse"></div>
                <div className="h-32 bg-gray-100 border border-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="w-full h-48 bg-gray-100 border border-gray-200 rounded animate-pulse mb-12"></div>
            </motion.div>
          ) : (
            <motion.div 
              key="document"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: status === 'completed' ? 1 : 0.2, y: 0, filter: status === 'idle' ? 'blur(4px)' : 'none' }}
              transition={{ duration: 0.5 }}
              className={`w-[800px] h-[1130px] bg-white shadow-2xl p-16 text-black relative ${status === 'idle' ? 'pointer-events-none select-none' : ''}`}
            >
              {/* Header */}
              <div className="border-b-2 border-blue-900 pb-4 mb-8 flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-blue-900">PRAGMA</h1>
                  <p className="text-xs font-mono text-gray-600 uppercase mt-1">Predictive Risk Analysis & Governance Management Assistant Intelligence Report</p>
                </div>
                <div className="text-right text-xs font-mono text-gray-500">
                  Date: October 24, 2023<br />
                  ID: REP-8472-GOV
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center break-words leading-tight">{reportTitle}</h2>

              {/* Executive Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-3">1. Executive Summary</h3>
                <p className="text-sm text-gray-800 leading-relaxed text-justify">
                  This report, generated by the PRAGMA Artificial Intelligence engine, outlines the projected governance risks and recommended resource allocations for the upcoming fiscal quarter. Based on aggregate simulation data, the state demonstrates a baseline efficiency of 94%. However, critical vulnerabilities have been detected in the Healthcare and Infrastructure sectors correlating with impending monsoon forecasts. Immediate preemptive action is advised to mitigate a projected 15% deficit in ICU capacity and subsequent economic impacts.
                </p>
              </div>

              {/* Risk Analysis Grid */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4">2. Risk Analysis Matrix</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border border-red-200 bg-red-50 p-4">
                    <h4 className="font-bold text-red-800 text-sm mb-2">Primary Risk: Healthcare Overflow</h4>
                    <p className="text-xs text-gray-700">Projected 40% surge in respiratory illnesses will overwhelm current bed capacity within 14 days in Chennai and Tiruvallur districts.</p>
                  </div>
                  <div className="border border-orange-200 bg-orange-50 p-4">
                    <h4 className="font-bold text-orange-800 text-sm mb-2">Secondary Risk: Logistics Halts</h4>
                    <p className="text-xs text-gray-700">Waterlogging on major transport arteries (NH-45) expected to reduce supply chain efficiency by 22%.</p>
                  </div>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4">3. Predictive Trends</h3>
                <div className="w-full h-48 bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400 text-sm italic">
                  [ AI Generated Chart: Resource Demand vs Capacity Projection ]
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-3">4. Strategic Recommendations</h3>
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="p-2 border border-blue-900">Action item</th>
                      <th className="p-2 border border-blue-900">Budget Impact</th>
                      <th className="p-2 border border-blue-900">Expected ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="p-2 border border-gray-300">Establish temporary triage centers</td>
                      <td className="p-2 border border-gray-300">₹400 Cr</td>
                      <td className="p-2 border border-gray-300 font-bold text-green-700">Prevents ICU Collapse</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-2 border border-gray-300">Pre-deploy road repair teams to NH-45</td>
                      <td className="p-2 border border-gray-300">₹85 Cr</td>
                      <td className="p-2 border border-gray-300 font-bold text-green-700">Maintains 90% Logistics flow</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="absolute bottom-16 left-16 right-16 border-t border-gray-300 pt-4 text-xs text-center text-gray-500 font-mono">
                CONFIDENTIAL - FOR GOVERNMENT USE ONLY<br />
                Generated automatically by PRAGMA Core v4.2.1-llm | Confidence Score: 96.8%
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 100%; }
          100% { background-position: 0% -100%; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
