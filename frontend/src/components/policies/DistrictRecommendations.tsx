import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';

const generateDistricts = (policy: any) => {
  const isHealthcare = policy?.category === 'Healthcare' || policy?.title?.toLowerCase().includes('health');
  const isInfrastructure = policy?.category === 'Infrastructure' || policy?.title?.toLowerCase().includes('grid');
  
  if (isHealthcare) {
    return [
      { name: 'Chennai', risk: 'Critical', priority: 'High', budget: '₹120 Cr', action: 'Deploy emergency medical stockpiles.', details: 'Hospital bed occupancy at 98%.', population: '8.6M', score: 94 },
      { name: 'Madurai', risk: 'High', priority: 'High', budget: '₹45 Cr', action: 'Setup temporary triage centers.', details: 'Viral spread rate increasing.', population: '1.5M', score: 87 },
      { name: 'Salem', risk: 'Moderate', priority: 'Medium', budget: '₹12 Cr', action: 'Distribute prophylactic kits.', details: 'Vulnerable population clusters identified.', population: '0.9M', score: 78 },
      { name: 'Trichy', risk: 'Moderate', priority: 'Medium', budget: '₹22 Cr', action: 'Deploy mobile healthcare units.', details: 'Hospital bed occupancy at 78%. SIR model predicts viral wave in 21 days. 4 mobile units recommended.', population: '1.0M', score: 82 },
    ];
  } else if (isInfrastructure) {
    return [
      { name: 'Salem', risk: 'Critical', priority: 'High', budget: '₹85 Cr', action: 'Upgrade power grid substations immediately.', details: 'Mettur thermal station frequency dipping to 49.8 Hz. Peak load expected to exceed capacity by 320 MW.', population: '0.9M', score: 91 },
      { name: 'Coimbatore', risk: 'High', priority: 'High', budget: '₹45 Cr', action: 'Implement intelligent traffic rerouting.', details: 'Avinashi Road corridor gridlock index 89%. AI signal override can reduce transit delay by 62%.', population: '2.1M', score: 87 },
      { name: 'Erode', risk: 'High', priority: 'High', budget: '₹34 Cr', action: 'Setup early warning flood sensors.', details: 'Bhavani River basin shows 72% flood probability. 8 additional sensors needed across upstream villages.', population: '0.5M', score: 85 },
      { name: 'Vellore', risk: 'Critical', priority: 'High', budget: '₹60 Cr', action: 'Establish cooling shelters for predicted heatwave.', details: 'WRF model forecasts 46°C peak. 15 cooling shelters needed. Vulnerable population: 28,000 elderly residents.', population: '0.5M', score: 88 },
    ];
  }
  
  return [
    { name: 'Chennai', risk: 'Critical', priority: 'High', budget: '₹120 Cr', action: 'Expand drainage networks in Sector A & B.', details: 'Buckingham Canal overflow risk at 87%. 12 IoT flood sensors deployed. Estimated 45,000 residents affected in Velachery, Adyar zones.', population: '8.6M', score: 94 },
    { name: 'Coimbatore', risk: 'High', priority: 'High', budget: '₹45 Cr', action: 'Implement intelligent traffic rerouting.', details: 'Avinashi Road corridor gridlock index 89%. AI signal override can reduce transit delay by 62%.', population: '2.1M', score: 87 },
    { name: 'Madurai', risk: 'Moderate', priority: 'Medium', budget: '₹12 Cr', action: 'Increase agricultural water subsidies.', details: 'Vaigai Dam at 42% capacity. Crop stress index elevated across 3 taluks. Monsoon deficit -18%.', population: '1.5M', score: 78 },
    { name: 'Tirunelveli', risk: 'Low', priority: 'Low', budget: '₹5 Cr', action: 'Routine maintenance of reservoirs.', details: 'All systems nominal. Scheduled maintenance for Papanasam dam. Water quality index: Good.', population: '0.5M', score: 96 },
  ];
};

interface Props {
  activePolicy?: any;
}

export default function DistrictRecommendations({ activePolicy }: Props) {
  const [districts, setDistricts] = useState(generateDistricts(activePolicy));
  const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null);
  const [reviewedDistricts, setReviewedDistricts] = useState<Set<string>>(new Set());
  const { addToast } = useToast();

  useEffect(() => {
    setDistricts(generateDistricts(activePolicy));
    setExpandedDistrict(null);
  }, [activePolicy]);

  const handleReview = (e: React.MouseEvent, districtName: string) => {
    e.stopPropagation();
    if (expandedDistrict === districtName) {
      setExpandedDistrict(null);
    } else {
      setExpandedDistrict(districtName);
      if (!reviewedDistricts.has(districtName)) {
        setReviewedDistricts(prev => new Set([...prev, districtName]));
        addToast(`📋 Reviewing AI intervention plan for ${districtName} district.`, 'info');
      }
    }
  };

  const handleApproveDistrict = (e: React.MouseEvent, districtName: string) => {
    e.stopPropagation();
    addToast(`✅ District intervention approved for ${districtName}. Resources will be allocated.`, 'success');
    setExpandedDistrict(null);
  };

  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-white font-poppins font-medium">District-Level Recommendations</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Localized AI Interventions</p>
        </div>
        <span className="text-[9px] font-mono text-success font-bold bg-success/20 border border-success/30 px-2 py-0.5 rounded">
          {reviewedDistricts.size}/{districts.length} REVIEWED
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        {districts.map((district, i) => {
          const isCritical = district.risk === 'Critical';
          const isExpanded = expandedDistrict === district.name;
          const isReviewed = reviewedDistricts.has(district.name);

          return (
            <motion.div 
              key={district.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              layout
              className={`p-3 rounded-xl border transition-all duration-300 ${
                isExpanded 
                  ? 'border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(37,99,235,0.15)]' 
                  : isCritical 
                    ? 'border-danger/30 bg-danger/5' 
                    : 'border-white/5 bg-black/20'
              } flex flex-col justify-between`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className={`w-3.5 h-3.5 ${isCritical ? 'text-danger' : 'text-gray-400'}`} />
                  <span className={`text-xs font-bold ${isCritical ? 'text-danger' : 'text-white'}`}>{district.name}</span>
                  {isReviewed && <CheckCircle className="w-3 h-3 text-success" />}
                </div>
                <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                  district.risk === 'Critical' ? 'bg-danger/20 text-danger' :
                  district.risk === 'High' ? 'bg-warning/20 text-warning' :
                  district.risk === 'Low' ? 'bg-success/20 text-success' :
                  'bg-secondary/20 text-secondary'
                }`}>
                  {district.priority} Priority
                </span>
              </div>

              <div className="mb-3">
                <div className="text-[10px] text-gray-400 mb-0.5">Recommended Action</div>
                <div className="text-xs text-gray-200 line-clamp-2">{district.action}</div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-2 mb-2 border-t border-white/5 space-y-2">
                      <p className="text-[10px] text-gray-400 leading-relaxed">{district.details}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-black/30 p-1.5 rounded">
                          <div className="text-[8px] text-gray-500 uppercase">Population</div>
                          <div className="text-[10px] font-mono font-bold text-white">{district.population}</div>
                        </div>
                        <div className="bg-black/30 p-1.5 rounded">
                          <div className="text-[8px] text-gray-500 uppercase">AI Score</div>
                          <div className="text-[10px] font-mono font-bold text-primary">{district.score}/100</div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleApproveDistrict(e, district.name)}
                        className="w-full py-1.5 bg-primary/20 hover:bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all border border-primary/40 flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" /> Approve Intervention
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-auto">
                <div>
                  <div className="text-[9px] text-gray-500 uppercase">Suggested Budget</div>
                  <div className="text-xs font-mono font-bold text-primary">{district.budget}</div>
                </div>
                <button 
                  onClick={(e) => handleReview(e, district.name)}
                  className={`text-[10px] flex items-center gap-1 transition-colors ${
                    isExpanded ? 'text-white' : 'text-primary hover:text-white'
                  }`}
                >
                  {isExpanded ? (
                    <>Close <X className="w-3 h-3" /></>
                  ) : (
                    <>Review <ArrowRight className="w-3 h-3" /></>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
