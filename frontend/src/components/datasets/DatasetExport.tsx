import { Download, Table, FileText, Code, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

export default function DatasetExport() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleExport = (type: string, ext: string, content: string) => {
    setDownloading(type);
    
    setTimeout(() => {
      let mimeType = 'text/plain';
      if (ext === 'csv') mimeType = 'text/csv';
      if (ext === 'json') mimeType = 'application/json';
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pragma_dataset_export.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setDownloading(null);
      addToast(`✅ Dataset exported successfully as ${ext.toUpperCase()}`, 'success');
    }, 1500);
  };

  return (
    <div className="glass-card h-[250px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium">Export Dataset</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Download pre-processed data</p>
      </div>

      <div className="flex flex-col gap-3 flex-1 justify-center">
        <button 
          onClick={() => handleExport('csv', 'csv', 'district_id,population,growth_rate,urban_pct,avg_income,hospitals,schools\nTN01,4200500,+1.2%,100%,45000,240,1250\nTN02,3100200,+0.8%,85%,32000,180,950\nTN03,2800100,+1.5%,60%,28000,145,1100\nTN04,1500000,-0.2%,45%,18000,90,800\nTN05,950000,+0.1%,30%,15000,45,450')}
          disabled={downloading !== null}
          className="w-full py-2.5 bg-black/30 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors flex items-center justify-start px-4 gap-3 disabled:opacity-50"
        >
          {downloading === 'csv' ? <Loader2 className="w-4 h-4 text-success animate-spin" /> : <Table className="w-4 h-4 text-success" />}
          <span className="text-xs font-bold uppercase tracking-wider flex-1 text-left">Export as CSV</span>
          <span className="text-[9px] text-gray-500 font-mono">24.2 MB</span>
        </button>

        <button 
          onClick={() => handleExport('xls', 'xls', 'ID\tName\tValue\n1\tDemo\t100\n2\tTest\t200')}
          disabled={downloading !== null}
          className="w-full py-2.5 bg-black/30 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors flex items-center justify-start px-4 gap-3 disabled:opacity-50"
        >
          {downloading === 'xls' ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> : <FileText className="w-4 h-4 text-primary" />}
          <span className="text-xs font-bold uppercase tracking-wider flex-1 text-left">Export as Excel (XLSX)</span>
          <span className="text-[9px] text-gray-500 font-mono">18.5 MB</span>
        </button>

        <button 
          onClick={() => handleExport('json', 'json', '[\n  { "id": 1, "name": "Demo", "value": 100 },\n  { "id": 2, "name": "Test", "value": 200 }\n]')}
          disabled={downloading !== null}
          className="w-full py-2.5 bg-black/30 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors flex items-center justify-start px-4 gap-3 disabled:opacity-50"
        >
          {downloading === 'json' ? <Loader2 className="w-4 h-4 text-warning animate-spin" /> : <Code className="w-4 h-4 text-warning" />}
          <span className="text-xs font-bold uppercase tracking-wider flex-1 text-left">Export as JSON</span>
          <span className="text-[9px] text-gray-500 font-mono">31.4 MB</span>
        </button>
      </div>
    </div>
  );
}
