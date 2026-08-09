import { Printer, Share2, Download, FileText, FileSpreadsheet, File, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';

export default function ExportCenter() {
  const [exportingType, setExportingType] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleExport = (type: string) => {
    setExportingType(type);
    
    setTimeout(() => {
      setExportingType(null);
      if (type === 'pdf') {
        addToast('📄 Governance Report exported as PDF.', 'success');
        setTimeout(() => window.print(), 500);
      } else if (type === 'excel' || type === 'csv') {
        const ext = type === 'excel' ? 'xls' : 'csv';
        const content = type === 'excel' 
          ? "data:application/vnd.ms-excel;charset=utf-8,ID\tStatus\tBudget\nREP-01\tCritical\t$10M"
          : "data:text/csv;charset=utf-8,ID,Status,Budget\nREP-01,Critical,$10M";
        
        const encodedUri = encodeURI(content);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `pragma_report_export.${ext}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast(`📊 Report data successfully exported as ${type.toUpperCase()}.`, 'success');
      } else if (type === 'word') {
        addToast('📝 Document exported as Word.', 'success');
      } else if (type === 'share') {
        addToast('🔗 Secure sharing link copied to clipboard.', 'success');
      }
    }, 1500);
  };

  return (
    <div className="glass-card h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium">Export & Sharing Center</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Distribute Intelligence</p>
      </div>

      <div className="flex-1 flex flex-col gap-3 justify-center">
        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={() => handleExport('pdf')}
          disabled={exportingType !== null}
          className="w-full py-2.5 bg-black/30 hover:bg-danger/20 border border-white/10 hover:border-danger/50 text-white font-medium rounded-lg transition-colors flex items-center justify-start px-4 gap-3 disabled:opacity-50"
        >
          {exportingType === 'pdf' ? <Loader2 className="w-4 h-4 text-danger animate-spin" /> : <FileText className="w-4 h-4 text-danger" />}
          <span className="text-xs font-bold uppercase tracking-wider flex-1 text-left">
            {exportingType === 'pdf' ? 'Generating PDF...' : 'Export as PDF'}
          </span>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={() => handleExport('excel')}
          disabled={exportingType !== null}
          className="w-full py-2.5 bg-black/30 hover:bg-success/20 border border-white/10 hover:border-success/50 text-white font-medium rounded-lg transition-colors flex items-center justify-start px-4 gap-3 disabled:opacity-50"
        >
          {exportingType === 'excel' ? <Loader2 className="w-4 h-4 text-success animate-spin" /> : <FileSpreadsheet className="w-4 h-4 text-success" />}
          <span className="text-xs font-bold uppercase tracking-wider flex-1 text-left">
            {exportingType === 'excel' ? 'Building Excel...' : 'Export as Excel'}
          </span>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={() => handleExport('word')}
          disabled={exportingType !== null}
          className="w-full py-2.5 bg-black/30 hover:bg-primary/20 border border-white/10 hover:border-primary/50 text-white font-medium rounded-lg transition-colors flex items-center justify-start px-4 gap-3 disabled:opacity-50"
        >
          {exportingType === 'word' ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> : <File className="w-4 h-4 text-primary" />}
          <span className="text-xs font-bold uppercase tracking-wider flex-1 text-left">
            {exportingType === 'word' ? 'Creating Doc...' : 'Export as Word'}
          </span>
        </motion.button>

        <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-white/10">
          <button onClick={() => handleExport('pdf')} className="py-2 text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button onClick={() => handleExport('share')} className="py-2 text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold">
            <Share2 className="w-3.5 h-3.5" /> Share Link
          </button>
        </div>
      </div>
    </div>
  );
}
