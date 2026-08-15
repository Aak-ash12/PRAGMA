import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Key, Save, Loader2, RefreshCw, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { useToast } from '../contexts/ToastContext';

type Tab = 'profile' | 'notifications' | 'security' | 'api' | 'system';

export default function SettingsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>((location.state as any)?.tab || 'profile');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if ((location.state as any)?.tab) {
      setActiveTab((location.state as any).tab);
    }
  }, [location.state]);
  const [avatarSeed, setAvatarSeed] = useState('Admin');
  const [copiedKey, setCopiedKey] = useState(false);
  const { addToast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API save
    setTimeout(() => {
      setIsSaving(false);
      addToast('Settings successfully updated.', 'success');
    }, 1200);
  };

  const changeAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(randomSeed);
    addToast('Avatar updated.', 'info');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('sk_pragma_test_8f92j3n4k2m4');
    setCopiedKey(true);
    addToast('API Key copied to clipboard', 'success');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'system', label: 'System Config', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'api', label: 'API Keys', icon: Key },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 lg:pl-[280px]">
        <DashboardNavbar />
        
        <main className="p-8 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-poppins font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400">Manage your account, preferences, and API access.</p>
            </div>

            <div className="glass-card flex flex-col md:flex-row overflow-hidden min-h-[500px]">
              {/* Settings Sidebar */}
              <div className="w-full md:w-64 border-r border-white/10 bg-black/20 p-4 flex flex-col gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                        isActive 
                          ? 'bg-primary/20 text-white border border-primary/30' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* Settings Content */}
              <div className="flex-1 p-8 relative">
                <AnimatePresence mode="wait">
                  
                  {activeTab === 'profile' && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>
                      
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
                          <div className="w-full h-full bg-black rounded-full overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=081120`} alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                        </div>
                        <button 
                          onClick={changeAvatar}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm text-white transition-colors flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" /> Change Avatar
                        </button>
                      </div>

                      <form onSubmit={handleSave} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">First Name</label>
                            <input type="text" defaultValue="System" className="block w-full px-3 py-2.5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl bg-black/20 text-white transition-all sm:text-sm outline-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Last Name</label>
                            <input type="text" defaultValue="Admin" className="block w-full px-3 py-2.5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl bg-black/20 text-white transition-all sm:text-sm outline-none" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                          <input type="email" defaultValue="admin@pragma.gov" className="block w-full px-3 py-2.5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl bg-black/20 text-white transition-all sm:text-sm outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Clearance Level</label>
                          <input type="text" defaultValue="Level 5 (Maximum)" disabled className="block w-full px-3 py-2.5 border border-white/5 rounded-xl bg-black/40 text-gray-500 sm:text-sm outline-none cursor-not-allowed" />
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-end">
                          <button 
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {activeTab === 'notifications' && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
                      
                      <form onSubmit={handleSave} className="space-y-6">
                        
                        <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-black/20">
                          <div>
                            <h4 className="text-sm font-medium text-white mb-1">Critical AI Alerts</h4>
                            <p className="text-xs text-gray-400">Receive SMS and Email when AI detects a high-risk event.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-black/20">
                          <div>
                            <h4 className="text-sm font-medium text-white mb-1">Simulation Completion</h4>
                            <p className="text-xs text-gray-400">Notify me when a long-running Digital Twin simulation finishes.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-black/20">
                          <div>
                            <h4 className="text-sm font-medium text-white mb-1">Weekly Reports</h4>
                            <p className="text-xs text-gray-400">Receive automated PDF summaries every Monday morning.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-end">
                          <button 
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Preferences
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {activeTab === 'security' && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
                      
                      <form onSubmit={handleSave} className="space-y-5">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Current Password</label>
                          <input type="password" placeholder="••••••••" className="block w-full px-3 py-2.5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl bg-black/20 text-white transition-all sm:text-sm outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">New Password</label>
                          <input type="password" placeholder="Enter new password" className="block w-full px-3 py-2.5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl bg-black/20 text-white transition-all sm:text-sm outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Confirm New Password</label>
                          <input type="password" placeholder="Confirm new password" className="block w-full px-3 py-2.5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl bg-black/20 text-white transition-all sm:text-sm outline-none" />
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-end">
                          <button 
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                            Update Password
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {activeTab === 'api' && (
                    <motion.div
                      key="api"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-xl font-semibold text-white mb-2">API Access Keys</h2>
                      <p className="text-sm text-gray-400 mb-6">Manage your secret keys for accessing the PRAGMA engine programmatically.</p>
                      
                      <div className="p-4 border border-white/10 rounded-xl bg-black/20 mb-6">
                        <h4 className="text-sm font-medium text-white mb-2">Production Key</h4>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            readOnly 
                            value="sk_pragma_test_8f92j3n4k2m4" 
                            className="block w-full px-3 py-2.5 border border-white/10 rounded-xl bg-black/40 text-gray-300 font-mono sm:text-sm outline-none" 
                          />
                          <button 
                            onClick={copyToClipboard}
                            className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-colors"
                          >
                            {copiedKey ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 tracking-wider">Created on Jul 30, 2026. Last used 2 hours ago.</p>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex justify-end">
                        <button 
                          onClick={() => addToast('New API Key Generated.', 'success')}
                          className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        >
                          <Key className="w-4 h-4" />
                          Generate New Key
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'system' && (
                    <motion.div
                      key="system"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-xl font-semibold text-white mb-6">Global System Configurations</h2>
                      
                      <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Default Simulation Engine</label>
                            <select className="block w-full px-3 py-2.5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl bg-black/20 text-white transition-all sm:text-sm outline-none cursor-pointer">
                              <option value="mesa">Mesa ABM (Default)</option>
                              <option value="anylogic">AnyLogic Connect</option>
                              <option value="custom">Custom ML Model</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Confidence Threshold (%)</label>
                            <input type="number" defaultValue="85" min="50" max="99" className="block w-full px-3 py-2.5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl bg-black/20 text-white transition-all sm:text-sm outline-none" />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Global Budget Constraint (₹ Cr)</label>
                          <input type="number" defaultValue="15000" className="block w-full px-3 py-2.5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl bg-black/20 text-white transition-all sm:text-sm outline-none" />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-black/20">
                          <div>
                            <h4 className="text-sm font-medium text-white mb-1">Human-in-the-loop Bypass</h4>
                            <p className="text-xs text-gray-400">Allow AI to auto-deploy critical policies if confidence {'>'} 95%.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-end">
                          <button 
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Configurations
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>

          </motion.div>
        </main>
      </div>
    </div>
  );
}
