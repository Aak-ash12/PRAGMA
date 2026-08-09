import { UploadCloud, File } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { motion } from 'framer-motion';

export default function UploadDataset() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addToast } = useToast();

  const handleUpload = () => {
    setIsUploading(true);
    // Notify other components (AIValidation, DataQualityDashboard, DatasetOverview, VersionHistory)
    window.dispatchEvent(new Event('pragma_dataset_uploading'));
    
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setProgress(0);
          addToast('✅ Dataset successfully uploaded to secure enclave.', 'success');
          window.dispatchEvent(new Event('pragma_dataset_uploaded'));
        }, 500);
      }
    }, 150); // Takes ~3 seconds total
  };

  return (
    <div className="glass-card flex-1 flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-poppins font-medium">Upload Dataset</h3>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">CSV, Excel, JSON, ZIP</p>
      </div>

      <motion.div 
        whileHover={{ scale: isUploading ? 1 : 1.02 }}
        whileTap={{ scale: isUploading ? 1 : 0.98 }}
        className="flex-1 border-2 border-dashed border-white/20 rounded-xl bg-black/20 flex flex-col items-center justify-center p-6 text-center hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden"
        onClick={!isUploading ? handleUpload : undefined}
      >
        {isUploading ? (
          <div className="w-full flex flex-col items-center">
            <File className="w-8 h-8 text-primary mb-3 animate-pulse" />
            <div className="text-sm font-bold text-white mb-2">Transferring Data...</div>
            <div className="w-full bg-black rounded-full h-2 mb-1 overflow-hidden">
              <div className="bg-primary h-full transition-all duration-150 ease-linear" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-[10px] text-gray-400 font-mono">{progress}%</div>
          </div>
        ) : (
          <>
            <UploadCloud className="w-10 h-10 text-gray-400 mb-3 group-hover:text-primary transition-colors" />
            <div className="text-sm font-bold text-white mb-1">Drag and drop file here</div>
            <div className="text-[10px] text-gray-500">or click to browse</div>
          </>
        )}
      </motion.div>
    </div>
  );
}
