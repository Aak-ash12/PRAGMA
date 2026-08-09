// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, Droplets, Zap, Activity, ArrowRight, ShieldCheck, X, ExternalLink, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

const defaultAlerts = [
  { 
    id: 1, 
    scenario: 'disease',
    minsAgo: 2, 
    type: 'critical', 
    icon: AlertTriangle, 
    title: 'Hospital ICU overload predicted in Chennai', 
    desc: 'ICU bed capacity projected to exceed 98% in 48 hours based on SIR infection trajectory.',
    probability: 98,
    telemetry: 'Active Infections: 12,400 | R0: 2.4 | ICU Beds: 490/500',
    action: 'Divert non-critical emergency patients to temporary field camps and deploy 15,000 vaccine doses.'
  },
  { 
    id: 2, 
    scenario: 'flood',
    minsAgo: 14, 
    type: 'warning', 
    icon: Droplets, 
    title: 'Water inflow surge at Chembarambakkam', 
    desc: 'Reservoir inflow rate at 14,000 cusecs; sluice gate release recommended.',
    probability: 87,
    telemetry: 'Rainfall: 145 mm | River Level: 7.8m | Inflow: 14,000 cusecs',
    action: 'Open sluice gates immediately and issue low-lying zone evacuation warnings.'
  },
  { 
    id: 3, 
    scenario: 'flood',
    minsAgo: 28, 
    type: 'warning', 
    icon: Activity, 
    title: 'Evacuation traffic congestion on NH-45', 
    desc: 'Major commuter gridlock causing delays on designated flood evacuation corridors.',
    probability: 82,
    telemetry: 'Traffic Speed: 8 km/h | Corridor Load: 94% | Congestion: High',
    action: 'Deploy AI smart light cycle optimization and reroute incoming commuter lanes.'
  },
  { 
    id: 4, 
    scenario: 'flood',
    minsAgo: 45, 
    type: 'info', 
    icon: Info, 
    title: 'Heavy coastal rainfall telemetry alert', 
    desc: 'Coastal radar sensors recording 145mm cumulative rainfall in next 12 hours.',
    probability: 79,
    telemetry: 'Radar Rainfall: 145mm | Humidity: 91% | Temp: 29°C',
    action: 'Pre-position emergency response boats and activate coastal siren alerts.'
  },
  { 
    id: 5, 
    scenario: 'power',
    minsAgo: 62, 
    type: 'warning', 
    icon: Zap, 
    title: 'Thermal grid overload in North Chennai', 
    desc: 'A/C cooling demand driving peak grid load to 9,420 MW at 49.8 Hz.',
    probability: 81,
    telemetry: 'Peak Load: 9,420 MW | Freq: 49.8 Hz | Trans Temp: 84°C',
    action: 'Engage peaking backup generators and execute 30-min rolling load shedding in Sector 4.'
  },
];

export default function LiveAlerts() {
  const [liveAlerts, setLiveAlerts] = useState(defaultAlerts);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeAgo = (mins) => {
    const d = new Date(currentTime.getTime() - mins * 60000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
  };

  const handleNavigateToSimulation = (scenario) => {
    setSelectedAlert(null);
    const targetScenario = scenario || 'flood';
    navigate(`/simulation?scenario=${targetScenario}`);
    addToast(`Navigating to Predictive Simulation for '${targetScenario}'...`, 'info');
  };

  const handleExecuteAction = (alert) => {
    addToast(`AI Action Executed: ${alert.action}`, 'success');
    setSelectedAlert(null);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card h-[450px] flex flex-col relative"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-white font-poppins font-medium flex items-center gap-2">
              Live AI Telemetry Alerts
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Click any alert for deep AI inspection</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            CLICKABLE STREAM
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
          {liveAlerts.map((alert, i) => {
            const isCritical = alert.type === 'critical';
            const Icon = alert.icon;
            
            return (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleAlertClick(alert)}
                className={`p-3 rounded-xl border ${
                  isCritical 
                    ? 'border-danger/40 bg-danger/10 hover:border-danger/80' 
                    : alert.type === 'warning' 
                    ? 'border-amber-500/30 bg-amber-950/20 hover:border-amber-500/70' 
                    : 'border-white/10 bg-white/5 hover:border-blue-500/50'
                } flex gap-3 group hover:bg-black/60 transition-all cursor-pointer shadow-lg hover:scale-[1.01]`}
              >
                <div className={`mt-1 flex-shrink-0 ${isCritical ? 'text-danger animate-pulse' : alert.type === 'warning' ? 'text-warning' : 'text-secondary'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className={`text-xs font-bold ${isCritical ? 'text-red-300 group-hover:text-red-200' : alert.type === 'warning' ? 'text-amber-200 group-hover:text-amber-100' : 'text-white'}`}>
                      {alert.title}
                    </h4>
                    <span className="text-[9px] text-gray-400 font-mono shrink-0 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                      {formatTimeAgo(alert.minsAgo)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-snug mb-2">{alert.desc}</p>
                  
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-[9px] font-mono text-gray-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Risk Score: <strong className="text-white">{alert.probability}%</strong>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-primary flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      Inspect Alert <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* INTERACTIVE ALERT DEEP INSPECTION MODAL */}
      <AnimatePresence>
        {selectedAlert && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0b1324] border border-white/20 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedAlert(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${selectedAlert.type === 'critical' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'}`}>
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                    selectedAlert.type === 'critical' ? 'bg-danger/20 text-danger border-danger/40' : 'bg-warning/20 text-warning border-warning/40'
                  }`}>
                    {selectedAlert.type} THREAT DETECTED
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedAlert.title}</h3>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-xs">
                <div className="p-3 bg-black/40 rounded-xl border border-white/10">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-mono">Telemetry Data Ingested</div>
                  <div className="text-white font-mono font-bold text-xs">{selectedAlert.telemetry}</div>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/10">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-mono">Prediction Description</div>
                  <p className="text-gray-300 leading-relaxed text-xs">{selectedAlert.desc}</p>
                </div>

                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Prescriptive AI Action Plan
                  </div>
                  <p className="text-emerald-200 text-xs leading-relaxed">{selectedAlert.action}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-end pt-2 border-t border-white/10">
                <button 
                  onClick={() => handleExecuteAction(selectedAlert)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Execute AI Mitigation
                </button>

                <button 
                  onClick={() => handleNavigateToSimulation(selectedAlert.scenario)}
                  className="px-4 py-2 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30"
                >
                  <Play className="w-4 h-4" />
                  Run Predictive Simulation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
