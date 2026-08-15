import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldAlert, ShieldCheck, Cpu, Activity, AlertTriangle, 
  Layers, Zap, ArrowRight, User, Sparkles, Building2, Radio
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
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

  const [profile, setProfile] = useState({
    name: 'Daemon Targaryen',
    email: 'admin@pragma.gov',
    role: 'Government Officer',
    avatar: 'Daemon',
    clearance: 'Level 5 - Autonomous Override',
    department: 'Smart City Governance & Digital Infrastructure Directorate',
    badgeId: 'PRAGMA-GOV-TN-2026-088'
  });

  const loadProfile = () => {
    const email = localStorage.getItem('pragma_saved_email') || 'admin@pragma.gov';
    const role = localStorage.getItem('pragma_user_role') || 'Government Officer';
    const avatar = localStorage.getItem('pragma_user_avatar') || 'Daemon';
    const first = localStorage.getItem('pragma_first_name');
    const last = localStorage.getItem('pragma_last_name');
    const dept = localStorage.getItem('pragma_user_department') || 'Smart City Governance Directorate';
    const badge = localStorage.getItem('pragma_user_badge_id') || 'PRAGMA-GOV-2026';
    const clearance = localStorage.getItem('pragma_user_clearance') || 'Level 5 - Autonomous Override';

    const name = (first || last) ? `${first || ''} ${last || ''}`.trim() : (email.split('@')[0] || 'Officer');

    setProfile({
      name,
      email,
      role,
      avatar,
      clearance,
      department: dept,
      badgeId: badge
    });
  };

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('pragma_authenticated');
    if (isAuthenticated !== 'true') {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
    window.addEventListener('pragma_profile_updated', loadProfile);
    window.addEventListener('storage', loadProfile);
    return () => {
      window.removeEventListener('pragma_profile_updated', loadProfile);
      window.removeEventListener('storage', loadProfile);
    };
  }, []);

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

  const getRoleTheme = () => {
    const roleLower = profile.role.toLowerCase();
    if (roleLower.includes('disaster') || roleLower.includes('crisis') || profile.email.includes('crisis')) {
      return {
        title: 'Emergency Disaster Command & Crisis Operations HQ',
        badge: 'Crisis Authority',
        accentColor: 'from-rose-600/25 via-red-950/30 to-[#0d1527] border-rose-500/50 shadow-rose-900/20',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        icon: ShieldAlert,
        iconColor: 'text-rose-400',
        alertText: 'CRITICAL INUNDATION FOCUS: 145mm monsoon rainfall runoff model & ICU bed triage ready for deployment.',
        actions: [
          { label: 'Run Flood Simulation', path: '/simulation', icon: Activity, primary: true },
          { label: 'Disaster Risk Forecaster', path: '/prediction', icon: AlertTriangle, primary: false },
          { label: 'Dispatch ICU & Relief', path: '/resources', icon: ShieldCheck, primary: false }
        ]
      };
    }
    if (roleLower.includes('infrastructure') || roleLower.includes('utility') || profile.email.includes('utility')) {
      return {
        title: 'City Utilities & Transit Infrastructure Command',
        badge: 'Infrastructure Lead',
        accentColor: 'from-amber-600/25 via-amber-950/30 to-[#0d1527] border-amber-500/50 shadow-amber-900/20',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        icon: Zap,
        iconColor: 'text-amber-400',
        alertText: 'GRID TELEMETRY FOCUS: 18.1 GW peak cooling load & 420 MLD Coimbatore/Chennai water allocation online.',
        actions: [
          { label: 'Grid Peak Load Monitor', path: '/prediction', icon: Zap, primary: true },
          { label: 'Resource Optimizer', path: '/resources', icon: Layers, primary: false },
          { label: 'Live Sensor Analytics', path: '/analytics', icon: Activity, primary: false }
        ]
      };
    }
    if (roleLower.includes('policy') || roleLower.includes('analyst') || roleLower.includes('scientist') || profile.email.includes('analyst')) {
      return {
        title: 'Digital Twin Neural Swarm & XAI Research Lab',
        badge: 'AI Research Lead',
        accentColor: 'from-purple-600/25 via-indigo-950/30 to-[#0d1527] border-purple-500/50 shadow-purple-900/20',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        icon: Cpu,
        iconColor: 'text-purple-400',
        alertText: 'AI AUDIT FOCUS: 10,000+ Mesa citizen agents & SHAP decision importance vectors active for evaluation.',
        actions: [
          { label: 'Inspect Mesa Swarms', path: '/agents', icon: Cpu, primary: true },
          { label: 'SHAP Decision Weights', path: '/xai', icon: Layers, primary: false },
          { label: 'Validate Telemetry Data', path: '/datasets', icon: Activity, primary: false }
        ]
      };
    }
    // Default / Government Officer
    return {
      title: 'State Urban Governance & Executive Command HQ',
      badge: 'Executive Admin',
      accentColor: 'from-primary/25 via-blue-950/30 to-[#0d1527] border-primary/50 shadow-primary/20',
      badgeColor: 'bg-primary/20 text-cyan-300 border-primary/40',
      icon: ShieldCheck,
      iconColor: 'text-primary',
      alertText: 'GOVERNANCE FOCUS: 95.0% City SLA uptime active. ₹15,000 Cr municipal development budget under AI review.',
      actions: [
        { label: 'Review AI Policies', path: '/policies', icon: ShieldCheck, primary: true },
        { label: 'Generate PDF Report', path: '/reports', icon: Layers, primary: false },
        { label: 'Resource Redistribution', path: '/resources', icon: Activity, primary: false }
      ]
    };
  };

  const roleTheme = getRoleTheme();
  const RoleIcon = roleTheme.icon;

  return (
    <div className="min-h-screen bg-background flex text-gray-100 font-inter">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardNavbar />
        
        <main className="flex-1 ml-[280px] p-6 lg:p-8 space-y-6">
          
          {/* ROLE-TAILORED COMMAND HERO BANNER */}
          <motion.section 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl bg-gradient-to-r ${roleTheme.accentColor} border-2 p-6 shadow-xl relative overflow-hidden`}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              
              {/* Left: Officer & Role Identity */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-cyan-400 p-0.5 shadow-lg">
                    <div className="w-full h-full bg-[#081120] rounded-[14px] overflow-hidden flex items-center justify-center">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatar}&backgroundColor=081120`} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 p-1 bg-black/60 rounded-full border border-white/20">
                    <RoleIcon className={`w-3.5 h-3.5 ${roleTheme.iconColor}`} />
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-white font-poppins">
                      {profile.name}
                    </h2>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase ${roleTheme.badgeColor}`}>
                      {profile.clearance.split('-')[0].trim()}
                    </span>
                  </div>

                  <div className="text-xs text-gray-300 font-medium">
                    <span className="text-white font-semibold">{profile.role}</span> • {profile.department}
                  </div>

                  <p className="text-[11px] text-cyan-300 font-mono">
                    {roleTheme.alertText}
                  </p>
                </div>
              </div>

              {/* Right: Quick Action Buttons specific to Role */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                {roleTheme.actions.map((act) => {
                  const ActIcon = act.icon;
                  return (
                    <button
                      key={act.label}
                      onClick={() => navigate(act.path)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                        act.primary 
                          ? 'bg-primary hover:bg-primaryHover text-white shadow-lg shadow-primary/30' 
                          : 'bg-black/40 hover:bg-white/10 text-gray-200 border border-white/10 hover:text-white'
                      }`}
                    >
                      <ActIcon className="w-3.5 h-3.5" />
                      {act.label}
                      <ArrowRight className="w-3 h-3 opacity-70" />
                    </button>
                  );
                })}
              </div>

            </div>
          </motion.section>

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
