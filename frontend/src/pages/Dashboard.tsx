import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, ShieldCheck, Cpu, Activity, AlertTriangle, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import DashboardFooter from '../components/layout/DashboardFooter';
import KPICard from '../components/dashboard/KPICard';
import LiveMap from '../components/dashboard/LiveMap';
import LiveAlerts from '../components/dashboard/LiveAlerts';
import ResourcePieChart from '../components/dashboard/ResourcePieChart';
import PredictiveLineCharts from '../components/dashboard/PredictiveLineCharts';
import PolicyRecommendations from '../components/dashboard/PolicyRecommendations';
import AgentStatusPanel from '../components/dashboard/AgentStatusPanel';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    active_alerts: 12,
    governance_score: 95.0,
    resources_deployed: 1420,
    ai_confidence: 98.5
  });

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { addToast } = useToast();

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('pragma_authenticated');
    if (isAuthenticated !== 'true') {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => {
        if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
          setStats(prev => ({
            ...prev,
            ...res.data
          }));
        }
      })
      .catch(err => {
        console.error("Failed to load dashboard stats", err);
      });
  }, []);

  const handleCardClick = (cardTitle: string) => {
    addToast(`Opening ${cardTitle} analytics & controls...`, 'info');
    setActiveModal(cardTitle);
  };

  const governanceScore = stats?.governance_score ?? 95.0;
  const activeAlerts = stats?.active_alerts ?? 12;
  const resourcesDeployed = stats?.resources_deployed ?? 1420;
  const aiConfidence = stats?.ai_confidence ?? 98.5;

  return (
    <div className="min-h-screen bg-background flex text-gray-100 font-inter">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardNavbar />
        
        <main className="flex-1 ml-[280px] p-6 lg:p-8 space-y-6">
          {/* TOP KPI CARDS */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <KPICard
              title="Governance Score"
              value={`${governanceScore}%`}
              delay={0}
              progress={governanceScore}
              onClick={() => handleCardClick('Governance Score')}
            />
            <KPICard
              title="Active Alerts"
              value={String(activeAlerts)}
              subtitle="Requires Attention"
              delay={0.1}
              onClick={() => handleCardClick('Active Alerts')}
            />
            <KPICard
              title="Active AI Agents"
              value="10"
              delay={0.2}
              badge={{ text: 'Online', color: 'success' }}
              onClick={() => handleCardClick('Active AI Agents')}
            />
            <KPICard
              title="Resources Deployed"
              value={String(resourcesDeployed)}
              delay={0.3}
              badge={{ text: 'Active', color: 'success' }}
              onClick={() => handleCardClick('Resources Deployed')}
            />
            <KPICard
              title="AI Confidence"
              value={`${aiConfidence}%`}
              delay={0.4}
              progress={aiConfidence}
              onClick={() => handleCardClick('AI Confidence')}
            />
            <KPICard
              title="Current Risk Index"
              value="Medium"
              delay={0.5}
              badge={{ text: 'Elevated', color: 'warning' }}
              onClick={() => handleCardClick('Current Risk Index')}
            />
          </section>

          {/* CENTER PANEL: Map & Alerts */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LiveMap />
            </div>
            <div className="lg:col-span-1">
              <LiveAlerts />
            </div>
          </section>

          {/* BOTTOM PANELS */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ResourcePieChart />
            <PredictiveLineCharts />
            <PolicyRecommendations />
          </section>
          
          {/* AGENT STATUS */}
          <section>
            <AgentStatusPanel />
          </section>
        </main>

        <DashboardFooter />
      </div>

      {/* Interactive Detail Modals for 6 KPI Cards */}
      <AnimatePresence>
        {activeModal && (
          <div
            onClick={() => setActiveModal(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card bg-[#0D1527] border-2 border-primary/60 p-6 rounded-2xl max-w-lg w-full relative shadow-[0_0_50px_rgba(37,99,235,0.3)] overflow-hidden"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal 1: Governance Score */}
              {activeModal === 'Governance Score' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/20 rounded-xl border border-primary/40">
                      <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-poppins">Governance Score ({governanceScore}%)</h3>
                      <p className="text-xs text-gray-400">Public Administrative Audit & SLA Metrics</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">SLA Uptime</div>
                      <div className="text-xl font-mono font-bold text-success">99.2%</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Avg Response Time</div>
                      <div className="text-xl font-mono font-bold text-white">12 Mins</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Citizen Approval</div>
                      <div className="text-xl font-mono font-bold text-primary">94.5%</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Resolved Grievances</div>
                      <div className="text-xl font-mono font-bold text-white">4,820</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToast('Initiating Governance Quality Audit across districts...', 'success');
                      setActiveModal(null);
                    }}
                    className="w-full bg-primary hover:bg-primaryHover text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary/30"
                  >
                    Run Governance Quality Audit
                  </button>
                </div>
              )}

              {/* Modal 2: Active Alerts */}
              {activeModal === 'Active Alerts' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-danger/20 rounded-xl border border-danger/40">
                      <AlertTriangle className="w-6 h-6 text-danger" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-poppins">Active Emergency Alerts ({activeAlerts})</h3>
                      <p className="text-xs text-gray-400">High-Priority Infrastructure Warnings</p>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
                    <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-xs">
                      <div className="font-bold text-danger">Coimbatore Water Reservoir Saturation (&lt;15%)</div>
                      <div className="text-[10px] text-gray-300 mt-0.5">Phase-2 rationing required immediately.</div>
                    </div>
                    <div className="p-3 bg-warning/10 border border-warning/30 rounded-xl text-xs">
                      <div className="font-bold text-warning">NH-45 Express Corridor Traffic Gridlock</div>
                      <div className="text-[10px] text-gray-300 mt-0.5">Rerouting required for festival exodus.</div>
                    </div>
                    <div className="p-3 bg-warning/10 border border-warning/30 rounded-xl text-xs">
                      <div className="font-bold text-warning">North Chennai Transformer Peak Load Surge</div>
                      <div className="text-[10px] text-gray-300 mt-0.5">Peaking generator activation recommended.</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToast('Emergency Response Teams Acknowledged Alerts!', 'success');
                      setActiveModal(null);
                    }}
                    className="w-full bg-danger hover:bg-danger/80 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-danger/30"
                  >
                    Acknowledge & Dispatch Emergency Response
                  </button>
                </div>
              )}

              {/* Modal 3: Active AI Agents */}
              {activeModal === 'Active AI Agents' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-success/20 rounded-xl border border-success/40">
                      <Cpu className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-poppins">AI Agent Swarm (10 Online)</h3>
                      <p className="text-xs text-gray-400">Mesa Agent-Based Modeling (ABM) Framework</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-white font-bold">Agent 1-4</div>
                      <div className="text-[10px] text-gray-400">Citizen ABM Mobility</div>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-white font-bold">Agent 5-6</div>
                      <div className="text-[10px] text-gray-400">Hydro Flow Dispatch</div>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-white font-bold">Agent 7-8</div>
                      <div className="text-[10px] text-gray-400">Power Grid Balancer</div>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-white font-bold">Agent 9-10</div>
                      <div className="text-[10px] text-gray-400">Epidemic Triage Agent</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToast('Synced all 10 Mesa AI Agent Swarm processes.', 'success');
                      setActiveModal(null);
                    }}
                    className="w-full bg-success hover:bg-success/80 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-success/30"
                  >
                    Re-Sync Agent Swarm State
                  </button>
                </div>
              )}

              {/* Modal 4: Resources Deployed */}
              {activeModal === 'Resources Deployed' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary/20 rounded-xl border border-secondary/40">
                      <Layers className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-poppins">State Resources Deployed ({resourcesDeployed})</h3>
                      <p className="text-xs text-gray-400">Active Asset Inventory Breakdown</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Water Units</div>
                      <div className="text-lg font-mono font-bold text-secondary">420 MLD</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Emergency Units</div>
                      <div className="text-lg font-mono font-bold text-warning">415 Units</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Medical Kits</div>
                      <div className="text-lg font-mono font-bold text-success">585 Reserves</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Backup Power Gen</div>
                      <div className="text-lg font-mono font-bold text-white">100 Units</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToast('Optimized resource deployment allocations!', 'success');
                      setActiveModal(null);
                    }}
                    className="w-full bg-secondary hover:bg-secondary/80 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-secondary/30"
                  >
                    Rebalance Asset Deployment Matrix
                  </button>
                </div>
              )}

              {/* Modal 5: AI Confidence */}
              {activeModal === 'AI Confidence' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/20 rounded-xl border border-primary/40">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-poppins">AI Model Confidence ({aiConfidence}%)</h3>
                      <p className="text-xs text-gray-400">Statistical R² Accuracy & Validation</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-gray-300">XGBoost Crisis Predictor</span>
                      <span className="font-mono font-bold text-success">99.2% R²</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-gray-300">SIR Epidemic Neural Net</span>
                      <span className="font-mono font-bold text-success">97.8% R²</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-gray-300">Prophet Demographic Regressor</span>
                      <span className="font-mono font-bold text-success">98.5% R²</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToast('Re-calibrated AI Model hyperparameters.', 'success');
                      setActiveModal(null);
                    }}
                    className="w-full bg-primary hover:bg-primaryHover text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary/30"
                  >
                    Re-Calibrate Machine Learning Models
                  </button>
                </div>
              )}

              {/* Modal 6: Current Risk Index */}
              {activeModal === 'Current Risk Index' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-warning/20 rounded-xl border border-warning/40">
                      <ShieldAlert className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-poppins">Current Risk Index: Medium (Elevated)</h3>
                      <p className="text-xs text-gray-400">State Catastrophe & Hazard Matrix</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 flex justify-between items-center">
                      <span className="text-gray-300">Coastal Flood Vulnerability</span>
                      <span className="font-mono font-bold text-danger">High (85%)</span>
                    </div>
                    <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 flex justify-between items-center">
                      <span className="text-gray-300">Power Grid Thermal Strain</span>
                      <span className="font-mono font-bold text-warning">Medium (45%)</span>
                    </div>
                    <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 flex justify-between items-center">
                      <span className="text-gray-300">Epidemic Spread Risk</span>
                      <span className="font-mono font-bold text-success">Low (3%)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToast('State Catastrophe Relief Protocol Deployed!', 'success');
                      setActiveModal(null);
                    }}
                    className="w-full bg-warning text-black hover:bg-warning/90 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-warning/30"
                  >
                    Deploy Catastrophe Mitigation Plan
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
