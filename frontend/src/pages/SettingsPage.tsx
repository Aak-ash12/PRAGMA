import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Shield, Key, Save, Loader2, Copy, Check, 
  Sliders, Database, Server, User, ArrowRight, CheckCircle2, Lock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import DashboardFooter from '../components/layout/DashboardFooter';
import { useToast } from '../contexts/ToastContext';

type Tab = 'system' | 'notifications' | 'security' | 'api' | 'database';

export default function SettingsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>(
    (location.state as any)?.tab === 'profile' ? 'system' : ((location.state as any)?.tab || 'system')
  );
  const [isSaving, setIsSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if ((location.state as any)?.tab) {
      const tab = (location.state as any).tab;
      if (tab !== 'profile') {
        setActiveTab(tab);
      }
    }
  }, [location.state]);

  // System Config States
  const [engine, setEngine] = useState('mesa');
  const [confidence, setConfidence] = useState('85');
  const [budget, setBudget] = useState('15000');
  const [bypass, setBypass] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState('5');
  const [logLevel, setLogLevel] = useState('INFO');

  // Security States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(true);

  // Notification States
  const [critAlerts, setCritAlerts] = useState(true);
  const [simAlerts, setSimAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [smsDispatch, setSmsDispatch] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      addToast('System configurations updated and synced with Digital Twin Engine.', 'success');
    }, 800);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      addToast('Passwords do not match. Please verify.', 'danger');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast('Account password updated securely.', 'success');
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('sk_pragma_test_8f92j3n4k2m4_live');
    setCopiedKey(true);
    addToast('API Key copied to clipboard', 'success');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const tabs = [
    { id: 'system', label: 'System Config', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'api', label: 'API Keys & Access', icon: Key },
    { id: 'database', label: 'Engine & Storage', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 lg:pl-[280px]">
        <DashboardNavbar />
        
        <main className="p-6 md:p-10 pb-20 max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  <Sliders className="w-6 h-6" />
                </span>
                <h1 className="text-3xl font-poppins font-bold text-white tracking-tight">
                  System Settings & Controls
                </h1>
              </div>
              <p className="text-sm text-gray-400">
                Configure Digital Twin simulation parameters, security rules, notification pipelines, and API keys.
              </p>
            </div>

            <Link
              to="/profile"
              className="px-5 py-2.5 bg-gradient-to-r from-primary to-cyan-600 hover:from-primaryHover hover:to-cyan-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2"
            >
              <User className="w-4 h-4" /> Go to Officer Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Notice Banner to Profile */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-slate-900 to-primary/10 border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20 text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Looking for your Personal Profile or Avatar?</h4>
                <p className="text-xs text-gray-400">Manage officer name, email, government role, badge ID, and avatars on the dedicated profile page.</p>
              </div>
            </div>
            <Link 
              to="/profile" 
              className="whitespace-nowrap px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary hover:text-white border border-primary/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              Open Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Settings Main Card Container */}
          <div className="rounded-3xl bg-[#0d1527] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[520px]">
            
            {/* Settings Left Navigation Sidebar */}
            <div className="w-full md:w-64 border-r border-slate-800 bg-[#08101e] p-4 flex flex-col gap-1.5">
              <div className="text-[10px] uppercase font-bold text-gray-500 px-3 py-2">
                Configuration Categories
              </div>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-medium ${
                      isActive 
                        ? 'bg-primary/20 text-white border border-primary/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                    {tab.label}
                  </button>
                );
              })}

              <div className="mt-auto pt-6 border-t border-slate-800/80 px-2 space-y-2">
                <div className="text-[11px] text-gray-500">System Build: v2.4.0-Production</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Digital Twin Core Active
                </div>
              </div>
            </div>

            {/* Settings Tab Content */}
            <div className="flex-1 p-6 md:p-8 relative bg-[#0d1527]">
              <AnimatePresence mode="wait">
                
                {/* 1. System Config Tab */}
                {activeTab === 'system' && (
                  <motion.div
                    key="system"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-slate-800 pb-4">
                      <h2 className="text-xl font-bold text-white font-poppins">Global System Configurations</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Parameters governing simulation swarms, confidence thresholds, and dispatch policies.</p>
                    </div>
                    
                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Default Simulation Engine</label>
                          <select 
                            value={engine}
                            onChange={(e) => setEngine(e.target.value)}
                            className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-[#08101e] text-white transition-all sm:text-sm outline-none font-medium cursor-pointer"
                          >
                            <option value="mesa">Mesa Agent-Based Swarm (Recommended)</option>
                            <option value="anylogic">AnyLogic Smart City Connect</option>
                            <option value="custom">PRAGMA Hybrid Neural Engine</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Confidence Threshold (%)</label>
                          <input 
                            type="number" 
                            value={confidence} 
                            onChange={(e) => setConfidence(e.target.value)}
                            min="50" 
                            max="99" 
                            className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none font-medium" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Global Budget Cap (₹ Crore)</label>
                          <input 
                            type="number" 
                            value={budget} 
                            onChange={(e) => setBudget(e.target.value)}
                            className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none font-medium font-mono" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Telemetry Sync Interval</label>
                          <select 
                            value={refreshInterval}
                            onChange={(e) => setRefreshInterval(e.target.value)}
                            className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-[#08101e] text-white transition-all sm:text-sm outline-none font-medium cursor-pointer"
                          >
                            <option value="1">1 Second (Real-time Stream)</option>
                            <option value="5">5 Seconds (Balanced)</option>
                            <option value="15">15 Seconds (Low Bandwidth)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-800 rounded-2xl bg-[#08101e]/60">
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-0.5">Autonomous Governance Dispatch Bypass</h4>
                          <p className="text-xs text-gray-400">Allow AI swarms to auto-deploy critical disaster interventions if model confidence {'>'} 95%.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={bypass}
                            onChange={(e) => setBypass(e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex justify-end">
                        <button 
                          type="submit"
                          disabled={isSaving}
                          className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-70"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save Configurations
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* 2. Notifications Tab */}
                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-slate-800 pb-4">
                      <h2 className="text-xl font-bold text-white font-poppins">Notification Preferences</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Control emergency alerts, simulation completions, and email report dispatches.</p>
                    </div>
                    
                    <form onSubmit={handleSave} className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-slate-800 rounded-2xl bg-[#08101e]/60">
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-0.5">Critical AI Urban Alerts</h4>
                          <p className="text-xs text-gray-400">Receive immediate notifications when AI detects flood, grid outage, or hospital capacity warnings.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={critAlerts}
                            onChange={(e) => setCritAlerts(e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-800 rounded-2xl bg-[#08101e]/60">
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-0.5">Simulation Completion Signals</h4>
                          <p className="text-xs text-gray-400">Receive alert when a multi-agent demographic or hydrological scenario finishes execution.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={simAlerts}
                            onChange={(e) => setSimAlerts(e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-800 rounded-2xl bg-[#08101e]/60">
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-0.5">Automated Weekly Executive PDF Dispatches</h4>
                          <p className="text-xs text-gray-400">Receive compiled PDF analytics and governance summaries every Monday morning.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={weeklyReports}
                            onChange={(e) => setWeeklyReports(e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-800 rounded-2xl bg-[#08101e]/60">
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-0.5">Emergency SMS Dispatch</h4>
                          <p className="text-xs text-gray-400">Forward high-priority disaster warnings to your official registered mobile number.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={smsDispatch}
                            onChange={(e) => setSmsDispatch(e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex justify-end">
                        <button 
                          type="submit"
                          disabled={isSaving}
                          className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-70"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save Preferences
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* 3. Security Tab */}
                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-slate-800 pb-4">
                      <h2 className="text-xl font-bold text-white font-poppins">Security & Authentication</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Update administrative password and manage session encryption credentials.</p>
                    </div>
                    
                    <form onSubmit={handlePasswordUpdate} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Current Password</label>
                        <input 
                          type="password" 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••••••" 
                          className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none" 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">New Password</label>
                          <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter secure password" 
                            className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Confirm New Password</label>
                          <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password" 
                            className="block w-full px-4 py-3 border border-slate-700/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl bg-black/40 text-white transition-all sm:text-sm outline-none" 
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-800 rounded-2xl bg-[#08101e]/60">
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-0.5">Hardware 2FA / Passkey Enforce</h4>
                          <p className="text-xs text-gray-400">Require multi-factor OTP verification for all emergency directive deployments.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={twoFactor}
                            onChange={(e) => setTwoFactor(e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex justify-end">
                        <button 
                          type="submit"
                          disabled={isSaving}
                          className="flex items-center gap-2 bg-gradient-to-r from-primary to-cyan-600 hover:from-primaryHover hover:to-cyan-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-70"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                          Update Credentials
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* 4. API Keys Tab */}
                {activeTab === 'api' && (
                  <motion.div
                    key="api"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-slate-800 pb-4">
                      <h2 className="text-xl font-bold text-white font-poppins">API Keys & Machine Access</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Bearer tokens for programmatic integration with city sensors and IoT networks.</p>
                    </div>
                    
                    <div className="p-5 border border-slate-800 rounded-2xl bg-[#08101e] space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-white">Production Secret API Key</h4>
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          readOnly 
                          value="sk_pragma_test_8f92j3n4k2m4_live" 
                          className="block w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-black/40 text-cyan-300 font-mono text-xs outline-none" 
                        />
                        <button 
                          type="button"
                          onClick={copyToClipboard}
                          className="p-2.5 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-xl text-white transition-colors"
                          title="Copy Key"
                        >
                          {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-primary" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        Authorized scopes: `read:predictions`, `write:simulations`, `dispatch:policies`.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                      <button 
                        type="button"
                        onClick={() => addToast('New API Token generated and logged.', 'success')}
                        className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      >
                        <Key className="w-4 h-4" />
                        Roll New API Key
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 5. Engine & Storage Tab */}
                {activeTab === 'database' && (
                  <motion.div
                    key="database"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-slate-800 pb-4">
                      <h2 className="text-xl font-bold text-white font-poppins">Engine & Memory Management</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Control local cache, model checkpoint storage, and telemetry logs.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 border border-slate-800 rounded-2xl bg-[#08101e] space-y-2">
                        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                          <Server className="w-4 h-4" /> Local Storage Cache
                        </div>
                        <p className="text-xs text-gray-400">Stores active officer session, registered credentials, and chart cache.</p>
                        <button
                          type="button"
                          onClick={() => {
                            addToast('Application cache cleared.', 'info');
                          }}
                          className="mt-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium"
                        >
                          Clear Session Cache
                        </button>
                      </div>

                      <div className="p-4 border border-slate-800 rounded-2xl bg-[#08101e] space-y-2">
                        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                          <Database className="w-4 h-4" /> Export Audit Log
                        </div>
                        <p className="text-xs text-gray-400">Download complete JSON log of all AI decisions, interventions, and logins.</p>
                        <button
                          type="button"
                          onClick={() => {
                            addToast('Audit log JSON export initiated...', 'success');
                          }}
                          className="mt-2 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-medium"
                        >
                          Download Audit JSON
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          <DashboardFooter />
        </main>
      </div>
    </div>
  );
}
