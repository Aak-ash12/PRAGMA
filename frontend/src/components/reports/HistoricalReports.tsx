import { Download, Search, Trash2, Filter } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import { jsPDF } from 'jspdf';

const historyData = [
  { id: 'REP-8475', title: 'Q1 AI Infrastructure Review', type: 'Infrastructure', date: 'Jul 15, 2026', author: 'System Auto' },
  { id: 'REP-8474', title: 'Chennai Flood Risk 2026', type: 'Disaster Risk', date: 'Jun 10, 2026', author: 'Admin User' },
  { id: 'REP-8473', title: 'Healthcare Capacity Forecast', type: 'Prediction Report', date: 'May 22, 2026', author: 'Health Agent' },
  { id: 'REP-8472', title: 'Education Policy Impact', type: 'Policy Recommendation', date: 'May 02, 2026', author: 'System Auto' },
  { id: 'REP-8471', title: 'State Demographics Projection', type: 'Prediction Report', date: 'Apr 28, 2026', author: 'Admin User' },
  { id: 'REP-8470', title: 'Q4 Budget Analysis', type: 'Budget Allocation', date: 'Mar 15, 2026', author: 'Finance Agent' },
  { id: 'REP-8469', title: 'Traffic Gridlock Stress Test', type: 'Simulation Report', date: 'Feb 10, 2026', author: 'System Auto' },
  { id: 'REP-8468', title: 'Power Grid Failure Sim', type: 'Simulation Report', date: 'Jan 05, 2026', author: 'Infra Agent' },
];

export default function HistoricalReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState(historyData);
  const { addToast } = useToast();

  const filteredHistory = history.filter(h => 
    h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (id: string, title: string, type: string, date: string, author: string) => {
    addToast(`⬇️ Downloading report ${id}...`, 'success');
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(30, 58, 138); // bg-blue-900
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("PRAGMA", 20, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Predictive Risk Analysis & Governance Management Assistant", 20, 28);
    
    // Metadata
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const splitTitle = doc.splitTextToSize(`Historical Report: ${title}`, 170);
    doc.text(splitTitle, 20, 55);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Report ID: ${id}`, 20, 75);
    doc.text(`Type: ${type}`, 20, 82);
    doc.text(`Generation Date: ${date}`, 20, 89);
    doc.text(`Author: ${author}`, 20, 96);
    
    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 105, 190, 105);
    
    // Section 1: Executive Summary
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("1. Historical Context & Executive Summary", 20, 120);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const summaryText = `This historical document archives the predictive models and data collected for ${title}. At the time of generation (${date}), the state exhibited baseline efficiency metrics aligned with Q3 operational targets. The primary focus of this analysis was identifying systemic vulnerabilities within the ${type} sector and projecting long-term impacts on state resources.`;
    const splitSummary = doc.splitTextToSize(summaryText, 170);
    doc.text(splitSummary, 20, 130);
    
    // Section 2: Collected Data Points
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("2. Key Data Metrics Collected", 20, 160);
    
    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 168, 170, 10, 'F');
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Metric Parameter", 25, 175);
    doc.text("Recorded Value", 120, 175);
    doc.text("Variance", 165, 175);
    
    // Table Rows
    doc.setFont("helvetica", "normal");
    doc.text("Resource Allocation Deficit", 25, 185);
    doc.text("14.2%", 120, 185);
    doc.setTextColor(220, 38, 38);
    doc.text("+4.1%", 165, 185);
    
    doc.setTextColor(50, 50, 50);
    doc.text("Infrastructure Strain Index", 25, 193);
    doc.text("88/100", 120, 193);
    doc.setTextColor(220, 38, 38);
    doc.text("+12.0%", 165, 193);
    
    doc.setTextColor(50, 50, 50);
    doc.text("Operational Readiness", 25, 201);
    doc.text("94.5%", 120, 201);
    doc.setTextColor(22, 163, 74);
    doc.text("-1.2%", 165, 201);
    
    // Section 3: AI Post-Mortem
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("3. AI Agent Post-Mortem & Validity", 20, 220);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const postMortem = `The ${author} agent generated this report with a confidence interval of 94.2%. Post-event analysis indicates that the models presented herein accurately predicted 87% of the systemic load events that occurred following the report's generation.`;
    const splitPostMortem = doc.splitTextToSize(postMortem, 170);
    doc.text(splitPostMortem, 20, 230);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("CONFIDENTIAL - STATE GOVERNANCE ARCHIVE", 105, 285, { align: 'center' });
    doc.text(`Generated by PRAGMA Core Analytics Engine`, 105, 290, { align: 'center' });
    
    doc.save(`${id}_${title.replace(/\s+/g, '_')}.pdf`);
  };

  const handleDelete = (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
    addToast(`🗑️ Report ${id} moved to trash.`, 'success');
  };

  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-white font-poppins font-medium">Historical Reports</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Report Archive</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/30 border border-white/10 text-white text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-primary/50 transition-colors w-48"
            />
          </div>
          <button className="bg-black/30 border border-white/10 text-gray-300 p-2 rounded-lg hover:text-white hover:border-white/30 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500 bg-black/20">
              <th className="p-3 font-medium">Report ID</th>
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Author</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <AnimatePresence>
              {filteredHistory.map((h) => (
                <motion.tr 
                  key={h.id} 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="p-3 font-mono text-gray-500">{h.id}</td>
                  <td className="p-3 font-bold text-white">{h.title}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-white/5 rounded text-[9px] uppercase tracking-wider text-primary">{h.type}</span>
                  </td>
                  <td className="p-3 font-mono text-[10px] text-gray-400">{h.date}</td>
                  <td className="p-3 text-gray-400">{h.author}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDownload(h.id, h.title, h.type, h.date, h.author)} className="p-1 hover:text-primary transition-colors" title="Download PDF"><Download className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(h.id)} className="p-1 hover:text-danger transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filteredHistory.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">No reports found matching "{searchTerm}"</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
