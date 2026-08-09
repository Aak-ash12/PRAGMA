import { ArrowLeftRight, ArrowUpDown, MoreHorizontal, Database } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock datasets map
const datasetMocks: Record<string, { headers: string[], data: string[][] }> = {
  'Population Census 2026': {
    headers: ['district_id', 'population', 'growth_rate', 'urban_pct', 'avg_income', 'hospitals', 'schools'],
    data: [
      ['TN01', '4200500', '+1.2%', '100%', '₹45,000', '240', '1250'],
      ['TN02', '3100200', '+0.8%', '85%', '₹32,000', '180', '950'],
      ['TN03', '2800100', '+1.5%', '60%', '₹28,000', '145', '1100'],
      ['TN04', '1500000', '-0.2%', '45%', '₹18,000', '90', '800'],
      ['TN05', '950000', '+0.1%', '30%', '₹15,000', '45', '450'],
    ]
  },
  'State Hospital Occupancy': {
    headers: ['hospital_id', 'district', 'total_beds', 'icu_beds', 'occupied_pct', 'staff_ratio', 'status'],
    data: [
      ['H-101', 'Chennai', '1500', '250', '88%', '1:4', 'Critical'],
      ['H-102', 'Coimbatore', '850', '120', '65%', '1:5', 'Normal'],
      ['H-103', 'Madurai', '600', '80', '92%', '1:6', 'Critical'],
      ['H-104', 'Salem', '450', '50', '45%', '1:4', 'Normal'],
      ['H-105', 'Trichy', '500', '60', '78%', '1:5', 'Warning'],
    ]
  },
  'Chennai Traffic Flow': {
    headers: ['junction_id', 'zone', 'vehicles_per_hr', 'avg_speed_kmh', 'congestion_index', 'last_updated'],
    data: [
      ['J-01', 'Anna Salai', '4500', '12', '0.85', '2 mins ago'],
      ['J-02', 'OMR Toll', '3200', '24', '0.60', '2 mins ago'],
      ['J-03', 'Guindy', '5100', '8', '0.95', '2 mins ago'],
      ['J-04', 'Velachery', '2800', '18', '0.72', '2 mins ago'],
      ['J-05', 'T-Nagar', '1900', '14', '0.81', '2 mins ago'],
    ]
  }
};

const defaultData = datasetMocks['Population Census 2026'];

export default function DatasetPreview() {
  const [activeDataset, setActiveDataset] = useState<any>(null);
  const [tableData, setTableData] = useState(defaultData);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handleSelected = (e: Event) => {
      const customEvent = e as CustomEvent;
      setActiveDataset(customEvent.detail);
      
      // Look up mock data, fallback to default if not found
      const mock = datasetMocks[customEvent.detail.name];
      if (mock) {
        setTableData(mock);
      } else {
        // Generate generic mock data
        setTableData({
          headers: ['id', 'col_1', 'col_2', 'col_3', 'col_4', 'status'],
          data: [
            ['1', 'Data A', '142', 'High', 'Pass', 'Active'],
            ['2', 'Data B', '89', 'Medium', 'Pass', 'Active'],
            ['3', 'Data C', '45', 'Low', 'Fail', 'Warning'],
            ['4', 'Data D', '212', 'High', 'Pass', 'Active'],
            ['5', 'Data E', '11', 'Low', 'Pass', 'Inactive'],
          ]
        });
      }
    };

    window.addEventListener('pragma_dataset_selected', handleSelected);
    return () => window.removeEventListener('pragma_dataset_selected', handleSelected);
  }, []);

  return (
    <div className="glass-card flex flex-col h-[350px]">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-white font-poppins font-medium flex items-center gap-2">
            Dataset Preview: <span className="text-primary">{activeDataset ? activeDataset.name : 'Population Census 2026'}</span>
          </h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Previewing rows {(page - 1) * 5 + 1} to {page * 5}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-black/30 border border-white/10 rounded text-[10px] text-gray-300 hover:text-white transition-colors">Columns</button>
          <button className="px-3 py-1 bg-black/30 border border-white/10 rounded text-[10px] text-gray-300 hover:text-white transition-colors">Export</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar border border-white/5 rounded-xl relative">
        <AnimatePresence mode="wait">
          <motion.table 
            key={activeDataset ? activeDataset.id : 'default'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full text-left text-xs border-collapse"
          >
            <thead>
              <tr className="bg-black/40 text-gray-400 text-[10px] uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                {tableData.headers.map((h, i) => (
                  <th key={i} className="p-3 border-b border-white/10 border-r border-white/5 font-medium whitespace-nowrap">
                    <div className="flex items-center justify-between gap-4">
                      {h}
                      <div className="flex gap-1 opacity-50 hover:opacity-100 cursor-pointer">
                        <ArrowUpDown className="w-3 h-3" />
                        <MoreHorizontal className="w-3 h-3" />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-300 font-mono text-[11px]">
              {tableData.data.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="p-3 border-r border-white/5 whitespace-nowrap">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </motion.table>
        </AnimatePresence>
      </div>
      
      <div className="mt-3 flex justify-between items-center text-[10px] text-gray-500">
        <div>Showing {(page - 1) * 5 + 1} to {page * 5} of {activeDataset ? activeDataset.rows : '14.2M'} entries</div>
        <div className="flex gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-2 py-1 bg-black/30 rounded hover:text-white transition-colors">Prev</button>
          {[1, 2, 3].map(p => (
            <button key={p} onClick={() => setPage(p)} className={`px-2 py-1 rounded transition-colors ${page === p ? 'bg-primary/20 text-primary' : 'bg-black/30 hover:text-white'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(3, p + 1))} className="px-2 py-1 bg-black/30 rounded hover:text-white transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}
