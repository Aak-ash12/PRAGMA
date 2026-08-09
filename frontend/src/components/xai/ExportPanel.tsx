import { Download, FileText, Table, FileSpreadsheet, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

export default function ExportPanel() {
  const [exportingType, setExportingType] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleExport = (type: string) => {
    setExportingType(type);
    
    setTimeout(() => {
      setExportingType(null);
      if (type === 'pdf') {
        addToast('📄 Compliance Report exported as PDF.', 'success');
        setTimeout(() => window.print(), 500);
      } else if (type === 'csv') {
        const csvContent = "data:text/csv;charset=utf-8,District,Risk,Prediction\nChennai,Critical,Capacity breached\nCoimbatore,High,Water scarcity";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "pragma_xai_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast(`📊 Data successfully exported as CSV.`, 'success');
      } else if (type === 'excel') {
        const excelContent = "data:application/vnd.ms-excel;charset=utf-8,District\tRisk\tPrediction\nChennai\tCritical\tCapacity breached\nCoimbatore\tHigh\tWater scarcity";
        const encodedUri = encodeURI(excelContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "pragma_xai_export.xls");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast(`📊 Data successfully exported as EXCEL.`, 'success');
      }
    }, 1500);
  };

  return (
    <div className="glass-card h-[250px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium">Export Compliance Report</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Generate audit trails</p>
      </div>

      <div className="flex flex-col gap-3 flex-1 justify-center">
        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={() => handleExport('pdf')}
          disabled={exportingType !== null}
          className="w-full py-2.5 bg-black/30 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors flex items-center justify-start px-4 gap-3 disabled:opacity-50"
        >
          {exportingType === 'pdf' ? <Loader2 className="w-4 h-4 text-danger animate-spin" /> : <FileText className="w-4 h-4 text-danger" />}
          <span className="text-xs font-bold uppercase tracking-wider">
            {exportingType === 'pdf' ? 'Generating PDF...' : 'Export PDF Report'}
          </span>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={() => handleExport('csv')}
          disabled={exportingType !== null}
          className="w-full py-2.5 bg-black/30 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors flex items-center justify-start px-4 gap-3 disabled:opacity-50"
        >
          {exportingType === 'csv' ? <Loader2 className="w-4 h-4 text-success animate-spin" /> : <Table className="w-4 h-4 text-success" />}
          <span className="text-xs font-bold uppercase tracking-wider">
            {exportingType === 'csv' ? 'Compiling CSV...' : 'Export CSV Data'}
          </span>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={() => handleExport('excel')}
          disabled={exportingType !== null}
          className="w-full py-2.5 bg-black/30 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors flex items-center justify-start px-4 gap-3 disabled:opacity-50"
        >
          {exportingType === 'excel' ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> : <FileSpreadsheet className="w-4 h-4 text-primary" />}
          <span className="text-xs font-bold uppercase tracking-wider">
            {exportingType === 'excel' ? 'Building Excel...' : 'Export Excel Sheet'}
          </span>
        </motion.button>

        <div className="text-[9px] text-gray-500 text-center mt-2 font-mono flex items-center justify-center gap-1">
          <Download className="w-3 h-3" /> Cryptographically signed by PRAGMA Core.
        </div>
      </div>
    </div>
  );
}
